using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using System.Data;
using System.Net;

namespace Bridge.Background.Worker
{
    public class Utility
    {
        private readonly ILogger<Utility> _logger;
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private string connectionString;
        private bool enableEmailCommunication;
        private string carbonCopy;

        public Utility(IConfiguration configuration, ISyncProvider syncProvider, ILogger<Utility> logger)
        {
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
        }

        public async Task SendMail(string to, string cc, string bcc, string subject, string body, string managerID = null, string rrNumber = null )
        {
            var isDevEnv = _configuration.GetValue<bool>("IsDevEnvironment");
            var toAddressForGmailCommunication = _configuration.GetValue<string>("ToAddressForGmailCommunication");

            if (isDevEnv)
            {
                MailCredential mailCredential = new MailCredential()
                {
                    FromUserName = _configuration["EmailCredential:From"],
                    Host = _configuration["EmailCredential:Host"],
                    Password = _configuration["EmailCredential:Password"],
                };

                var employeeSendMailRequest = new SendMailRequest
                {
                    To = isDevEnv ? toAddressForGmailCommunication : to,
                    Cc = isDevEnv ? string.Empty : cc,
                    Bcc = isDevEnv ? string.Empty : bcc,
                    Subject = subject,
                    Body = body,
                    MailCredential = mailCredential,
                    EmployeeID = managerID,
                    RRNumber = rrNumber,
                    IsBodyHtml = true
                };

                HttpResponseMessage employeeMailResponse = MailService.SendMail(employeeSendMailRequest);

                if (employeeMailResponse.StatusCode == HttpStatusCode.OK)
                {
                    _logger.LogInformation("Email to manager {ManagerID} has Succesfully sent for scheduled RRumber {RRNumber}, On : {DateTime} ", managerID, rrNumber, DateTime.Now);
                }
                else
                {
                    _logger.LogInformation("Email to manager {EmployeeID} has not Succesfully sent for scheduled RRumber {RRNumber} due to {status}, On : {DateTime} ", managerID, rrNumber, employeeMailResponse.Content?.ReadAsStringAsync().Result, DateTime.Now);
                }

                MailNotification mailNotification = MapMailNotificationRequest(employeeSendMailRequest, employeeMailResponse);

                await InsetIntoMailNotification(mailNotification);
            }
            else
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();

                sqlParameters.Add(new QueryParameters
                {
                    ValueName = "@recipients",
                    Value = to,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(new QueryParameters
                {
                    ValueName = "@copy_recipients",
                    Value = cc,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(new QueryParameters
                {
                    ValueName = "@blind_copy_recipients",
                    Value = bcc,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });

                sqlParameters.Add(new QueryParameters
                {
                    ValueName = "@subject",
                    Value = subject,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(new QueryParameters
                {
                    ValueName = "@body",
                    Value = body,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(new QueryParameters
                {
                    ValueName = "@body_format ",
                    Value = "HTML",
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                await _syncProvider.GetByStoredProcedure(connectionString, "msdb.dbo.sp_send_dbmail", sqlParameters);
            }

        }

        public MailNotification MapMailNotificationRequest(SendMailRequest sendMailRequest, HttpResponseMessage responseMessage)
        {
            return new MailNotification()
            {
                To = sendMailRequest.To,
                Cc = sendMailRequest.Cc,
                Bcc = sendMailRequest.Bcc,
                Body = sendMailRequest.Body,
                Error = responseMessage.Content?.ReadAsStringAsync().Result,
                From = sendMailRequest.MailCredential.FromUserName,
                Subject = sendMailRequest.Subject,
                Status = responseMessage.StatusCode == HttpStatusCode.OK ? Status.Success.ToString() : Status.Error.ToString(),
                EmployeeID = sendMailRequest.EmployeeID,
                RRNumber = sendMailRequest.RRNumber
            };
        }

        public async Task InsetIntoMailNotification(MailNotification mailNotification)
        {
            connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

            var parameters = new object[]
             {
                 mailNotification.From, mailNotification.To, mailNotification.Cc, mailNotification.Bcc,
                    mailNotification.Subject, mailNotification.Body, mailNotification.Error, mailNotification.Status, mailNotification.EmployeeID, mailNotification.RRNumber
             };
            await _syncProvider.InsertOrUpdateByQuery(connectionString, string.Format("Insert into MailNotification ([from], [to], cc, bcc, subject, body, error, isactive, createdon, [status], EmployeeID, RRNumber ) values ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', 1, GETDATE(), '{7}', '{8}', '{9}')", parameters));
        }
    }
}

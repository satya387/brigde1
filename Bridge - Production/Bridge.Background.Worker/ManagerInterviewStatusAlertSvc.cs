using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using System.Data;
using System.Net;

namespace Bridge.Background.Worker
{
    public sealed class ManagerInterviewStatusAlertSvc
    {
        private readonly ILogger<ManagerInterviewStatusAlertSvc> _logger;
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private readonly Utility _utility;
        private string connectionString;
        private bool enableEmailCommunication;
        private string carbonCopy;

        public ManagerInterviewStatusAlertSvc(ILogger<ManagerInterviewStatusAlertSvc> logger, IConfiguration configuration, ISyncProvider syncProvider, Utility utility)
        {
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
            _utility = utility;
        }

        public async Task ProcessManagerInterviewStatusAlert()
        {

            var getScheduledOpportunitiesDetails = await GetScheduledOpportunities();
            if (getScheduledOpportunitiesDetails.Count > 0)
            {
                _logger.LogInformation("Fetched all the manager's scheduled opportunities details. Count, Total : {total} is been captured, DateTime : {DateTime}", getScheduledOpportunitiesDetails.Count, DateTime.Now);
                await SendEmailNotificationForManagerOnScheduledDeatils(getScheduledOpportunitiesDetails);
            }
            else
            {
                _logger.LogInformation("No scheduled opportunities details found, DateTime : {DateTime}", DateTime.Now);
            }
        }

        /// <summary>
        /// Fetch Scheduled Opportunities
        /// </summary>
        /// <returns>ScheduledOpportunities</returns>
        private async Task<List<ScheduledOpportunities>> GetScheduledOpportunities()
        {
            var scheduledOpportunitiesList = new List<ScheduledOpportunities>();

            connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
            var scheduledOpportunitiesDataTable = await _syncProvider.GetByStoredProcedure(connectionString, "USP_GetScheduledOpportunities", new List<QueryParameters>());

            foreach (DataRow row in scheduledOpportunitiesDataTable.Rows)
            {
                var scheduledOpportunity = new ScheduledOpportunities()
                {
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    RequesterID = Utilities.CheckDBNullForString(row, "Requester"),
                    RequesterName = Utilities.CheckDBNullForString(row, "RequesterName"),
                    RequesterMailId = Utilities.CheckDBNullForString(row, "RequesterMailId"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "EmployeeName"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjName"),
                    ScheduledDate = Utilities.CheckDBNullForDate(row, "ScheduledDate"),
                    Status = Utilities.CheckDBNullForString(row, "Status"),
                    Role = Utilities.CheckDBNullForString(row, "Role")
                };
                scheduledOpportunitiesList.Add(scheduledOpportunity);
            }
            return scheduledOpportunitiesList;
        }

        public async Task SendEmailNotificationForManagerOnScheduledDeatils(List<ScheduledOpportunities> empDetailsForMatchingRRs)
        {
            enableEmailCommunication = _configuration.GetValue<bool>("EnableEmailCommunication");
            carbonCopy = _configuration.GetValue<string>("carbonCopy") ?? string.Empty;

            foreach (ScheduledOpportunities alert in empDetailsForMatchingRRs)
            {
                string managerMailBody = $"Dear {alert.RequesterName},<br /><br />" +
                          $"This is a gentle reminder to you about the interview conducted on {alert.ScheduledDate:MM/dd/yyyy} for the RR - {alert.RRNumber} - {alert.Role} role with {alert.EmployeeName}. " +
                          "We would greatly appreciate it if you could update the application status in the BRIDGE system against the RR.<br /><br />" +
                          "Thank you very much for your attention to this matter. If you need further assistance, please reach us at wfm-team@emids.com<br /><br />" +
                          "Thanking you,<br />" +
                          "WFM Team";

                if (enableEmailCommunication)
                {
                    _logger.LogInformation("Email notification successfully triggered for Manager {ManagerName} with Employee {EmployeeName} for scheduled RR Number {RRNumber} on: {DateTime}", alert.RequesterName, alert.EmployeeName, alert.RRNumber, DateTime.Now);
                    await _utility.SendMail(alert.RequesterMailId, carbonCopy, null, "Subject: BRIDGE: Reminder: Request for Interview Status Update", managerMailBody, alert.RequesterID, alert.RRNumber);
                }
            }
        }
    }
}


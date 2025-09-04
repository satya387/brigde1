using Bridge.Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Utility
{
    [ExcludeFromCodeCoverage]
    public class MailService
    {
        public static HttpResponseMessage SendMail(SendMailRequest sendMailRequest)
        {
            if (sendMailRequest != null && (string.IsNullOrWhiteSpace(sendMailRequest.MailCredential.Host) || string.IsNullOrWhiteSpace(sendMailRequest.MailCredential.FromUserName) || string.IsNullOrWhiteSpace(sendMailRequest.MailCredential.Password)))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent("Credential Not Found.")
                };
            }

            if (sendMailRequest != null && string.IsNullOrWhiteSpace(sendMailRequest.To))
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("[To] not found.")
                };
            }

            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(sendMailRequest.MailCredential.FromUserName);
            mailMessage.To.Add(sendMailRequest.To);
            mailMessage.Subject = sendMailRequest.Subject;
            mailMessage.Body = sendMailRequest.Body;
            mailMessage.IsBodyHtml = sendMailRequest.IsBodyHtml;

            if (!string.IsNullOrWhiteSpace(sendMailRequest.Cc))
            {
                mailMessage.CC.Add(sendMailRequest.Cc);
            }
            if (!string.IsNullOrWhiteSpace(sendMailRequest.Bcc))
            {
                mailMessage.CC.Add(sendMailRequest.Bcc);
            }

            SmtpClient smtpClient = new SmtpClient();
            smtpClient.Host = sendMailRequest.MailCredential.Host;
            smtpClient.Port = 587;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(sendMailRequest.MailCredential.FromUserName, sendMailRequest.MailCredential.Password);
            smtpClient.EnableSsl = true;
            smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;

            if (sendMailRequest.SendCalendarInvite)
            {
                AlternateView calendarView = SendCalendarInvite(sendMailRequest, mailMessage);
                mailMessage.AlternateViews.Add(calendarView);
            }

            try
            {
                smtpClient.Send(mailMessage);

                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(ex.Message)
                };
            }
        }

        public static AlternateView SendCalendarInvite(SendMailRequest sendMailRequest, MailMessage mailMessage)
        {
            string startTime = TimeZoneInfo.ConvertTimeToUtc(Convert.ToDateTime(sendMailRequest.DiscussionStartTime)).ToString("yyyyMMddTHHmmssZ");
            string endTime = TimeZoneInfo.ConvertTimeToUtc(Convert.ToDateTime(sendMailRequest.DiscussionStartTime.AddMinutes(sendMailRequest.Duration))).ToString("yyyyMMddTHHmmssZ");

            StringBuilder str = new StringBuilder();
            str.AppendLine("BEGIN:VCALENDAR");

            //PRODID: identifier for the product that created the Calendar object
            str.AppendLine("PRODID:-//" + mailMessage.From.Address);
            str.AppendLine("VERSION:2.0");
            str.AppendLine("METHOD:REQUEST");

            str.AppendLine("BEGIN:VEVENT");

            str.AppendLine(string.Format("DTSTART:{0:yyyyMMddTHHmmssZ}", startTime));
            str.AppendLine(string.Format("DTSTAMP:{0:yyyyMMddTHHmmssZ}", DateTime.Now));
            str.AppendLine(string.Format("DTEND:{0:yyyyMMddTHHmmssZ}", endTime));
            str.AppendLine(string.Format("LOCATION: {0}", sendMailRequest.Location));

            // UID should be unique.
            str.AppendLine(string.Format("UID:{0}", Guid.NewGuid()));
            str.AppendLine(string.Format("DESCRIPTION:{0}", sendMailRequest.Body));
            str.AppendLine(string.Format("X-ALT-DESC;FMTTYPE=text/html:{0}", sendMailRequest.Body));
            str.AppendLine(string.Format("SUMMARY:{0}", sendMailRequest.Subject));

            str.AppendLine(string.Format("ORGANIZER:MAILTO:{0}", mailMessage.From.Address));
            str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";RSVP=TRUE:mailto:{1}", mailMessage.To[0].DisplayName, mailMessage.To[0].Address));


            str.AppendLine("STATUS:CONFIRMED");
            str.AppendLine("BEGIN:VALARM");
            str.AppendLine("TRIGGER:-PT15M");
            str.AppendLine("ACTION:Display");
            str.AppendLine("DESCRIPTION:Reminder");
            str.AppendLine("END:VALARM");

            str.AppendLine("END:VEVENT");
            str.AppendLine("END:VCALENDAR");

            System.Net.Mime.ContentType ct = new System.Net.Mime.ContentType("text/calendar");
            ct.Parameters.Add("method", "REQUEST");
            ct.Parameters.Add("name", "meeting.ics");

            return AlternateView.CreateAlternateViewFromString(str.ToString(), ct);
        }
    }
}

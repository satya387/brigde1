using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class SendMailRequest
    {
        public string To { get; set; }
        public string Cc { get; set; }
        public string Bcc { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public MailCredential MailCredential { get; set; }
        public string EmployeeID { get; set; }
        public string RRNumber { get; set; }
        public DateTime DiscussionStartTime { get; set; }
        public int Duration { get; set; }
        public string Location { get; set; }
        public bool SendCalendarInvite { get; set; }
        public bool IsBodyHtml { get; set; }
    }
}

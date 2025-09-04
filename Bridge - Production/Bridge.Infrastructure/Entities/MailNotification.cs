using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class MailNotification
    {
        public int Id { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Cc { get; set; }
        public string Bcc { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string Status { get; set; }
        public string Error { get; set; }
        public string EmployeeID { get; set; }
        public string RRNumber { get; set; }
    }
}

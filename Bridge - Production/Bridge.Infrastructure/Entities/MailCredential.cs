using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class MailCredential
    {
        public string Host { get; set; }
        public string FromUserName { get; set; }
        public string Password { get; set; }
    }
}

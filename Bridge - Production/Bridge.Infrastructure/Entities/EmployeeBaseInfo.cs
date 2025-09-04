using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class EmployeeBaseInfo
    {
        public string DisplayName { get; set; }
        public string GivenName { get; set; }
        public string JobTitle { get; set; }
        public string Mail { get; set; }
        public string OfficeLocation { get; set; }
        public string Surname { get; set; }
        public string UserPrincipalName { get; set; }
    }
}

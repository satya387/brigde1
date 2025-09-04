using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class EmployeeSummaryResponse
    {
        public Dictionary<string, object> EmployeeSummary { get;set; }
        public Dictionary<string, object> ManagerSummary { get;set; }
    }
}
 
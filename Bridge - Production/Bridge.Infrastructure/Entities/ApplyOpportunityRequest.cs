using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class ApplyOpportunityRequest
    {
        public string EmployeeId { get; set; }
        public int ResourceRequestId { get; set; }
        public string ResourceRequestNumber { get; set; } 
        public string CreatedBy { get; set; }
    }
}

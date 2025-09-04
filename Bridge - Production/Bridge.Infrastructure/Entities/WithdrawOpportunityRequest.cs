using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class WithdrawOpportunityRequest
    {
        public string EmployeeId { get; set; }
        public int ResourceRequestId { get; set; }
        public string ResourceRequestNumber { get; set; }
        public string DisapprovedBy { get; set; }
        public string ReasonForDisapprove { get; set; }
        public string AdditionalComments { get; set; } = "";
        public bool IsMeetingHappened { get; set; }
    }
}

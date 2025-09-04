using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class GetOpportunityHistoryResponse
    {
        public string ActualMessage { get; set; }
        public string EmployeeName { get; set; }    
        public string ManagerName { get; set; }
        public string WFMName { get; set; }
        public string Comments { get; set; }
        public string AdditionalComments { get; set; }
        public string ActionPerformedDate { get; set; }


    }
}

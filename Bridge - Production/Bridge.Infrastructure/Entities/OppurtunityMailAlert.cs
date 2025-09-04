using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class OppurtunityMailAlert
    {
        public string EmployeeID { get; set; }
        public string RRNumber { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeEmail { get; set; }
        public int? RRId { get; set; }
    }
}

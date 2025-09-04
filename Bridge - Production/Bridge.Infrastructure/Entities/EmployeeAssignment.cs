using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class EmployeeAssignment
    {
        public int? Id { get; set; }
        public string EmidsUniqueId { get; set; }
        public string ProjectName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Technologies { get; set; }
        public string KeyResponsibilities { get; set; }
        public int? ProjectId { get; set; }
        public string ProjectRole { get; set; }
        public int? ResourceAssignId { get; set; }
    }
}

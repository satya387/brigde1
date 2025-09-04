using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class EmployeeProject
    {
        public int? ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string EmployeeId { get; set; }
        public decimal Allocation { get; set; }
        public DateTime? AssignDate { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string ProjectRole { get; set; }
        public string ProjectKeyResponsibilities { get; set; }
        public string ProjectSkills { get; set; }
        public int? ResourceAssignId { get; set; }
    }
}

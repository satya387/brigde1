using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class OpportunityFilter
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; }
        public int? MinExperienceInYears { get; set; }
        public int? MaxExperienceInYears { get; set; }
        public string PrimarySkills { get; set; }
        public string Location { get; set; }
        public string Role { get; set; }
        public string Country { get; set; }
        public string ProjectName { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class EmployeeSkillMatrix
    {
        public string EmployeeId { get; set; }
        public string Proficiency { get; set; }
        public string COE { get; set; }
        public string BeginnerSkills { get; set; }
        public string IntermediateSkills { get; set; }
        public string AdvancedSkills { get; set; }
        public string ExpertSkills { get; set; }
        public string PrimarySkills { get; set; }
        public string SecondarySkills { get; set; }
        public string Certifications { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class AnalysisResponse
    {
        public string EmployeeName { get; set; }
        public string PrimarySkills { get; set; }
        public string SecondarySkills { get; set; }
        public string EmpRole { get; set; }
        public int Experience { get; set; }
        public string Location { get; set; }

        public string EmployeeId { get; set; }
        public string Designation { get; set; }
        public string ManagerID { get; set; }
    }
}

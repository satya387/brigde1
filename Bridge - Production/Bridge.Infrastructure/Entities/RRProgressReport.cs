using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class RRProgressReport
    {
        public string RRNumber { get; set; }
        public string ProjectName { get; set; }
        public string RoleRequested { get; set; }
        public string PrimarySkills { get; set; }
        public string WorkLocation { get; set; }
        public string Experience { get; set; }
        public string PostedOn { get; set; }
        public RRsApplication RRsApplication { get; set; }
    }
}

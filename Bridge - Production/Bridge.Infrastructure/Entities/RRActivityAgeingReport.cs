using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class RRAgeingReport
    {
        public int? RRId { get; set; }
        public string RRNumber { get; set; }
        public string ProjectName { get; set; }
        public string RoleRequested { get; set; }
        public string PostedOn { get; set; }
        public int? Ageing { get; set; }
    }
}

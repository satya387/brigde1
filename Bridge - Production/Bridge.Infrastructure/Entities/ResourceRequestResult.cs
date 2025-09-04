using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class ResourceRequestResult
    {
        public ResourceRequestDetails ResourceRequestDetails { get; set; }
        public int? Applicants { get; set; }
    }
}

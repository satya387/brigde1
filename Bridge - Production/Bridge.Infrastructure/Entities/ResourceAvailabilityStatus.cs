using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class ResourceAvailabilityStatus
    {
        public int? Id { get; set; }
        public string AvailableStatus { get; set; }
        public string ErrorMessage { get; set; }
    }
}

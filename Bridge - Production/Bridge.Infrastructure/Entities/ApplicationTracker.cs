using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class ApplicationTracker
    {
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public bool IsProfileUpdated { get; set; } = false;
        public string MachineName { get; set; }
        public string MachineIP { get; set; }
        public string BrowserType { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class Country
    {
        public int LocationId { get; set; } 
        public string LocationName { get; set; }
        public string Code { get; set; }
        public List<City> Cities { get; set; }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace Bridge.Infrastructure.Entities
{
    public class ResourceRequestDetailsHeader
    {
        [FromHeader]
        public int id { get; set; } = 0;
        [FromHeader]
        public string EmployeeID { get; set; } = "";
    }
}

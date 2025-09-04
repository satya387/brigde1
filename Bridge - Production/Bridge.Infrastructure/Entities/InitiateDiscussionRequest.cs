using Bridge.Infrastructure.Entities.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class InitiateDiscussionRequest
    {
        public DateTime DiscussionStartTime { get; set; }

        public int DiscussionDuration { get; set; }

        [RegularExpression(@"^((\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)\s*[;]{0,1}\s*)+$", ErrorMessage = "Please provide correct optional mail Ids.")]
        public string OptionalAttendees { get; set; }

        [RegularExpression(@"^((\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)\s*[;]{0,1}\s*)+$", ErrorMessage ="Please provide correct employee mail Id.")]
        public string EmployeeMailId { get; set; }

        public string EmployeeId { get; set; }

        [RegularExpression(@"^((\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)\s*[;]{0,1}\s*)+$", ErrorMessage = "Please provide correct manager mail Id.")]
        public string ManagerEmployeeMailId { get; set; }

        public string ManagerEmployeeId { get; set; }

        public int RrId { get; set; }

        public string ResourceRequestNumber { get; set; }

        public string Location { get; set; }

        public string  Status { get; set; }  
    }
}

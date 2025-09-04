using System.ComponentModel.DataAnnotations;

namespace Bridge.Infrastructure.Entities
{
    public class ResourceAvailability
    {
        [Required]
        public string EmployeeId { get; set; }
        public string AvailableStatus { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public string WFMSpoc { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public string WFMEmployeeId { get; set; }
        public DateTime? ManagerApproveOrWithdrawDate { get; set; }
        public string ReleaseReason { get; set; }
        public bool InformedEmployee { get; set; }
        public DateTime? WfmSuggestedDate { get; set; }
        public string ManagerId { get; set; }
        public string WfmRejectComment { get; set; }
        public string Comments { get; set; }

    }
}
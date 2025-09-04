namespace Bridge.Infrastructure.Entities
{
    public class ManagerResources 
    {
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string Role { get; set; }
        public int? ExperienceYears { get; set; }
        public string ProjectName { get; set; }
        public int? ExperienceInProject { get; set; }
        public string AllocatedOn { get; set; }
        public string Status { get; set; }
        public string BillingStatus { get; set; }

        #region  Update Resource Status api will update below property
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }  
        public string WFMEmployeeId { get; set; }
        public string ManagerApproveOrWithdrawDate { get; set; }
        public string ReleaseReason { get; set; }
        public string InformedEmployee { get; set; }
        public string WfmSuggestedDate { get; set; }
        public string ManagerId { get; set; }
        public string WfmRejectComment { get; set; }
        public string Comments { get; set; }
        #endregion
    }
}

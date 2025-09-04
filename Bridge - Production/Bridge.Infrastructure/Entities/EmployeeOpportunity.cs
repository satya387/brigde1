namespace Bridge.Infrastructure.Entities
{
    public class EmployeeOpportunity
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; }
        public int RrId { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string DisapprovedBy { get; set; }
        public string ReasonForDisapprove { get; set; }
        public int StatusId { get; set; }
        public string Comments { get; set; }
        public string AdditionalComments { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public DateTime? AllocationStartDate { get; set; }
        public int? AllocationPercentage { get; set; }
        public int? WfmAllocationPercentage { get; set; }
        public DateTime? WfmAllocationStartDate { get; set; }
        public string RequesterID { get; set; }
        public string Status { get; set; }
        public bool IsRampUpProject { get; set; }
    }
}

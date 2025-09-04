namespace Bridge.Infrastructure.Entities
{
    public class ResourceAllocationDetails
    {
        public string EmployeeId { get; set; }
        public string RRNumber { get; set; }
        public string ProjectName { get; set; }
        public string EmployeeName { get; set; }
        public string Location { get; set; }
        public string PrimarySkill { get; set; }
        public string SecondarySkill { get; set; }
        public int? AllocationPercentage { get; set; }
        public DateTime? AllocationStartDate { get; set; }
        public string WFMSpoc { get; set; }
        public string RequesterName { get; set; }
        public int? WfmAllocationPercentage { get; set; }
        public DateTime? WfmAllocationStartDate { get; set; }
        public string CityName { get; set; }
        public string AdditionalComments { get; set; }
        public string RequesterID { get; set; }
        public int? RrId { get; set; }
        public string RRCreatedDate { get; set; }
        public int? AvailableAllocationPercentage { get; set; }
    }
}

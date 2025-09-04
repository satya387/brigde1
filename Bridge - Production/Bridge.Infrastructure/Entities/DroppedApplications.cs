namespace Bridge.Infrastructure.Entities
{
    public class DroppedApplications
    {
        public int? RrId { get; set; }
        public string RRNumber { get; set; }
        public string ProjectName  { get; set; }
        public int? RRAging { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeId { get; set; }
        public string RRSkills { get; set; }
        public string Location { get; set; }
        public string CityName { get; set; }
        public int? Experience { get; set; }
        public DateTime? AppliedOn { get; set; }
        public string DroppedReason { get; set; }
        public string AdditionalComments { get; set; }
        public string Status { get; set; }

    }
}

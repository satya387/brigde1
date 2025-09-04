namespace Bridge.Infrastructure.Entities
{
    /// <summary>
    /// Released Employee Response
    /// </summary>
    public class ReleasedEmployeeResponse
    {
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeEmailId { get; set; }
        public string Designation { get; set; }
        public string ReportingManagerName { get; set; }
        public string PrimarySkills { get; set; }
        public string SecondarySkills { get; set; }
        public string EmployeeRole { get; set; }
        public double Experience { get; set; }
        public string ProjectName { get; set; }
        public string BusinessLocation { get; set; }
        public string WorkingLocation { get; set; }         
        public string WfmSpoc { get; set; }
        public DateTime? ReleaseRequestOn { get; set; }
        public DateTime? PlannedReleaseDate { get; set; }
        public string ReleaseReason { get; set; }
        public bool TalentInformed { get; set; } = false;
        public string Status { get; set; }
        public string RRRequesterId { get; set; }
        public string WfmRejectComment { get; set; }
        public string Comments { get; set; }

    }
}

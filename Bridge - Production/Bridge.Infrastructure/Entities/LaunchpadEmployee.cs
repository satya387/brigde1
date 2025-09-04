namespace Bridge.Infrastructure.Entities
{


    public class LaunchpadEmployee
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
        public int MatchPercentage { get; set; }
        public string MatchCriteria { get; set; }
        public string AvailableOn { get; set; }
        public string WfmSpoc { get; set; }
        public int? Aging { get; set; }
        public string OnLaunchPadFrom { get; set; }
        public string Availability { get; set; }
        public string EffectiveTill { get; set; }
        public string RRNumber { get; set; }
        public int? RRId { get; set; }
        public int? AvailableAllocationPercentage { get; set; }
        public string Studio { get; set; }
        public string ReleaseStatus { get; set; }
        public double EmidsExperience { get; set; }
        public int? ProfileCompleteness { get; set; }
    }
}
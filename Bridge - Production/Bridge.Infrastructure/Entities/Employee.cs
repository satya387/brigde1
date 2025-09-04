namespace Bridge.Infrastructure.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string EmidsUniqueId { get; set; }
        public string EmployeeName { get; set; }
        public string Designation { get; set; }
        public string CurrentProject { get; set; }
        public string CurrentManagerId { get; set; }
        public string Status { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public string Location { get; set; }
        public string About { get; set; }
        public string Role { get; set; }
        public string PrimarySkills { get; set; }
        public string SecondarySkills { get; set; }
        public string ReportingManagerName { get; set; }
        public string AccountName { get; set; }
        public string BusinessLocation { get; set; }
        public double EmidsExperience { get; set; }
        public double PastExperience { get; set; }

        public EmployeeSkillMatrix SkillMatrix { get; set; }
        public List<EmployeeProject> EmployeeProjects { get; set; }
        public List<EmployeeAssignment> PreviousOrgAssignments { get; set; }
        public string WorkingLocation { get; set; }
        public int? IsLaunchpadEmployee { get; set; }
        public int MatchPercentage { get; set; }
        public string MatchCriteria { get; set; }
        public double TotalExperience { get; set; }
        public int? AplliedOpportunityCount { get; set; }
        public string EmployeeUserName { get; set; }
        public int? AvailableAllocationPercentage { get; set; }
        public int? Aging { get; set; }
        public string Studio { get; set; }
    }
}

namespace Bridge.Infrastructure.Entities
{
    public class EmployeeAuthenticationDetails
    {
        public string EmployeeId { get; set; }
        public string EmployeeEmailId { get; set; }
        public string Role { get; set; }
        public int? IsLaunchpadEmployee { get; set; }
        public string EmployeeCountry { get; set; }
        public bool IsFutureReleaseEmployee { get; set; }
        public string EmployeeStatus { get; set; }
        public bool ExceedMaxLimitForApplyOpportunity { get; set; }
        public string EmployeeUserName { get; set; }
        public string  EmployeeName { get; set; }
    }
}

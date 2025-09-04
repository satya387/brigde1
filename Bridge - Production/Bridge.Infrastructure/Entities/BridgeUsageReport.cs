using Bridge.Infrastructure.Entities.Enum;

namespace Bridge.Infrastructure.Entities
{
    public class BridgeUsageReport
    {
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string WorkLocation { get; set; }
        public string Role { get; set; }
        public int? NoOfTimesLoggedIn { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? ProfileUpdatedOn { get; set; }
        public int? NoOfRRsOwned { get; set; }
        public RRsApplication ManagerRRsApplication { get; set; }
        public RRsApplication EmployeeRRsApplication { get; set; }
    }
    public class RRsApplication
    {
        public int? Active { get; set; }
        public int? Withdrawn { get; set; }
        public int? Declined { get; set; }
        public int? Scheduled { get; set; }
        public int? AllocationRequested { get; set; }
        public int? Dropped { get; set; }
        public string ReasonForReject { get; set; }
        public int? Total { get; set; }
    }
}

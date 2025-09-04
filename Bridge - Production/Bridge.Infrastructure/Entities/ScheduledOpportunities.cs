namespace Bridge.Infrastructure.Entities
{
    public class ScheduledOpportunities
    {
        public string RRNumber { get; set; }
        public string RequesterID { get; set; }
        public string RequesterName { get; set; }
        public string RequesterMailId { get; set; }
        public string ProjectName { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public string Status { get; set; }
        public string EmployeeName { get; set; }
        public string Role { get; set; }
    }
}

namespace Bridge.Infrastructure.Entities
{
    public class ResourceRequestDetails
    {
        public int? RRId { get; set; }
        public DateTime? StartDate { get; set; }
        public string AccountName { get; set; }
        public int? MinimumExp { get; set; }
        public int? Allocation { get; set; }
        public string WorkLocation { get; set; }
        public string PrimarySkill { get; set; }
        public string SecondarySkill { get; set; }
        public string ManagerId { get; set; }
        public string About { get; set; }
        public string JobSummary { get; set; }
        public string RolesandResponsibilities { get; set; }
        public DateTime? OpenTill { get; set; }
        public string RRNumber { get; set; }
        public string Role { get; set; }
        public string JobTitle { get; set; }
        public string RRCountry { get; set; }
        public string RrRequesterId { get; set; }
        public string RequesterMailId { get; set; }
        public string RequesterName { get; set; }
        public string ProjectManagerId { get; set; }
        public string ProjectManagerMailID { get; set; }
        public string ProjectManagerName { get; set; }
        public string MatchCriteria { get; set; } = "";
        public int MatchPercentage { get; set; } = 0;
    }
}

namespace Bridge.Infrastructure.Entities
{
    public class ResourceRequest
    {
        public string RRNumber { get; set; }

        public string ProjectName { get; set; }

        public string JobTitle { get; set; }

        public string PrimarySkill { get; set; }

        public string SecondarySkill { get; set; }

        public int? Experience { get; set; }

        public int? Allocation { get; set; }

        public string Location { get; set; }

        public DateTime? StartDate { get; set; }

        public string Designation { get; set; }

        public int? RRId { get; set; }

        public int MatchPercentage { get; set; }

        public string MatchCriteria { get; set; }

        public string RrComments { get; set; }
    }
}

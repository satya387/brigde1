namespace Bridge.Infrastructure.Entities
{
    public class ResourceRequestsComments
    {
        public int? RRID { get; set; }
        public string RRNumber { get; set; }
        public string RRComment { get; set; }
        public string WFMCreatedBy { get; set; } 
        public DateTime? WFMCreatedDate { get; set; }
    }
}

namespace Bridge.Infrastructure.Entities
{
    public class SearchRequest
    {
        public string SearchElement { get; set; }
        public bool IsManager { get; set; }
        public string EmployeeId { get; set; }
    }
}

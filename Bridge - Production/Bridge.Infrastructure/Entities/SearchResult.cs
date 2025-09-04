namespace Bridge.Infrastructure.Entities
{
    public class SearchResult
    {
        public List<LaunchpadEmployee> EmployeeSearchResult { get; set; }
        public List<ResourceRequest> ResourceRequestSearchResult { get; set; }
        public List<LaunchpadEmployee> FutureAvailableEmployees { get; set; }
    }
}

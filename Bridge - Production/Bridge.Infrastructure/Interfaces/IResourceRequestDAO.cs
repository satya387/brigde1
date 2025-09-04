using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IResourceRequestDAO
    {
        public Task<ResourceRequestDetails> GetResourceRequestDetails(int resourceRequestId);
        public Task<List<ResourceRequest>> GetActiveResourceRequestsForManager(string managerId);
        public Task<List<ResourceRequest>> GetEmployeeOpportunitiesOnFilter(string country, string[] formattedLocation, int minExperience, int maxExperience, string[] formattedSkill, List<int> resourceRequestIdsEmployeeApplied, string[] designation, string[] projectNames, Employee employee, string employeeId, bool isFilterApplied = false);
        public Task<List<ResourceRequest>> GetResourceRequestsSearchData(string employeeId);
        public Task<Dictionary<int, int>> GetAppliedCountForAllResourceRequests(List<int> rridList);

        public Task<List<int>> GetRRIdsForEmployee(string employeeId);
    }
}

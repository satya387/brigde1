using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;

namespace Bridge.API.Synchronizer
{
    public class SearchSync : ISearchSync
    {
        private readonly IEmployeeSync _employeeSearch;
        private readonly IResourceRequestSync _resourceRequestSearch;

        public SearchSync(IEmployeeSync employeeSync, IResourceRequestSync resourceRequestSearch)
        {
            _employeeSearch = employeeSync;
            _resourceRequestSearch = resourceRequestSearch;
        }

        public async Task<SearchResult> GlobalSearch(string searchElement, bool isManager, string employeeId)
        {
            var emplyoeeResults = new List<LaunchpadEmployee>();
            var futureEmployees = new List<LaunchpadEmployee>();
             
            if (isManager)
            {
                emplyoeeResults = await _employeeSearch.EmployeeSearchData(searchElement);
                futureEmployees = await _employeeSearch.EmployeeFutureSearchData(searchElement); 
            }
           
            var resourceRequestSearchResults = await _resourceRequestSearch.GetResourceRequestsSearchData(searchElement, employeeId);

            var searchResult = new SearchResult
            {
                EmployeeSearchResult = emplyoeeResults,
                ResourceRequestSearchResult = resourceRequestSearchResults,
                FutureAvailableEmployees = futureEmployees,
            };

            return searchResult;
        }
    }
}

using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;

namespace Bridge.API.Synchronizer
{
    public class FilterSync : IFilterSync
    {
        private readonly IFilterDAO _filterDAO;
        public FilterSync(IFilterDAO filterDAO)
        {
            _filterDAO = filterDAO;
        }

        public async Task<OpportunityFilter> GetEmployeeOpportunitySearchFilter(string employeeId)
        {
            return await _filterDAO.GetEmployeeOpportunitySearchFilter(employeeId);
        }

        public async Task<int?> SaveEmployeeOpportunityFilter(OpportunityFilter opportunityFilter)
        {
            return await _filterDAO.SaveEmployeeOpportunityFilter(opportunityFilter);
        }

        public async Task<List<ProjectDetails>> GetProjectsDetailsOfActiveRRs()
        {
            return await _filterDAO.GetProjectsDetailsOfActiveRRs();
        }
    }
}

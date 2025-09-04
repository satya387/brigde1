using Bridge.Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IFilterSync
    {
        public Task<OpportunityFilter> GetEmployeeOpportunitySearchFilter(string employeeId);
        public Task<int?> SaveEmployeeOpportunityFilter(OpportunityFilter opportunityFilter);
        public Task<List<ProjectDetails>> GetProjectsDetailsOfActiveRRs();

    }
}

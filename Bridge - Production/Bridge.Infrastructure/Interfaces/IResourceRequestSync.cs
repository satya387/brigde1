using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Enum;
using System.Data;
using static Bridge.Infrastructure.Utility.Utilities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IResourceRequestSync
    {
        public Task<ResourceRequestResult> GetResourceRequestsById(ResourceRequestDetailsHeader resourceRequestDetailsHeader);
        public Task<List<ResourceRequestWithApplicantsCount>> GetEmployeeOpportunities(string employeeId);
        public Task<List<ResourceRequest>> GetActiveResourceRequestsForManager(ManagerEmployeeIdsModel managerEmployeeIdsModel);
        public Task<List<ResourceRequest>> GetResourceRequestsSearchData(string searchElement, string employeeId);
        public Task<List<AppliedOpportunity>> GetApplicantsByRRId(int rrId);
        Task<List<GetOpportunityHistoryResponse>> GetOpportunityHistory(int rrId, OpportunityHistoryType historyType);
        Task<List<ActiveRrResponse>> GetActiveRRs(string status);
        Task<LaunchPadResourceAnalysisResponses> GetViewLaunchPadResourceAnalysis();
    }
}

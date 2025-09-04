using Bridge.Infrastructure.Entities;
using System.Data;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IEmployeeSync
    {
        public Task<List<Employee>> GetEmployees(string location);
        public Task<int?> ApplyOpportunity(ApplyOpportunityRequest applyOpportunityRequest);
        public Task<List<AppliedOpportunity>> GetSelfAppliedOpportunities(string employeeId);
        public Task<List<ApplicationReviewResponse>> GetEmployeeAppliedOpportunitiesForManager(string managerEmployeeId);
        public Task<List<LaunchpadEmployee>> GetLaunchpadEmployees();
        Task<int?> WithdrawAppliedOpportunity(WithdrawOpportunityRequest withdrawOpportunityRequest, bool isDisapprovedByManager);
        Task<int?> ApproveAppliedOpportunity(EmployeeOpportunity employeeOpportunity);
        Task<int?> InitiateDiscussion(InitiateDiscussionRequest initiateDiscussionRequest);
        Task<Employee> GetEmployeeProfileDetails(string employeeId);
        public Task<List<LaunchpadEmployee>> EmployeeSearchData(string serachElement);
        Task<List<LaunchpadEmployee>> EmployeeFutureSearchData(string searchElement);
        public Task<List<DisapprovalReasons>> GetDisapprovalReasons();
        public Task<List<EmployeeAssignment>> GetPreviousOrgAssignments(string employeeId);
        public Task<int> UpsertPreviousOrgAssignments(EmployeeAssignment previousOrgAssignment);
        public Task<int> UpsertEmployeeOpportunity(EmployeeOpportunity employeeOpportunity);
        public Task<int?> UpdateEmployeeWriteUp(UpdateEmployeeWriteUp updateEmployeeAboutText);
        public Task<int?> UpdateRoleAndResponsibilityOfEmployee(EmployeeAssignment updateRoleAndResponsibilityOfEmployee);
        public Task<List<Employee>> GetRRMatchingLaunchPadEmployees(ResourceRequest resourceRequest);
        Task<List<ResourceAvailabilityStatus>> CheckResourceStatus(string employeeId);
        Task<List<GetTalentHistoryResponse>> GetTalentHistory(string employeeId);
    }
}

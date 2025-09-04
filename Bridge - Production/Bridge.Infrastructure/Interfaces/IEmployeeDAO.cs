using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Bridge.Infrastructure.Utility.Utilities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IEmployeeDAO
    {
        public Task<List<Employee>> GetEmployees(string employeeId = "-1", string loginName = "-1");
        public Task<List<Employee>> GetLaunchpadEmployeesFromSP(string employeeId = "-1", string loginName = "-1", bool isEarmarkedRequired = false);
        public Task<int?> ApplyOpportunity(ApplyOpportunityRequest applyOpportunityRequest);
        public Task<List<EmployeeOpportunity>> GetAppliedOpportunitiesRrIdsAndStatus(string employeeId);
        public Task<List<AppliedOpportunity>> GetSelfAppliedOpportunities(List<EmployeeOpportunity> appliedOpportunitiesRrIds, string employeeId);
        public Task<List<LaunchpadEmployee>> GetLaunchpadEmployees();
        Task<List<EmployeeOpportunity>> GetEmployeeRrIdForAppliedRrs(List<ResourceRequest> resourceRequests);
        Task<List<AppliedOpportunity>> GetEmployeeDetailsFromEmployeeIds(List<EmployeeOpportunity> employeeIds, List<EmployeeProject> employeeProjectDetails);
        List<ApplicationReviewResponse> GetEmployeeAppliedOpportunitiesForManager(List<ResourceRequest> resourceRequests, List<AppliedOpportunity> employeeDetailsWithRrId);
        public Task<int> GetAppliedEmployeesCountForResourceRequest(int resourceRequestId);
        public Task<OpportunityFilter> EmployeeOpportunitySearchCriteria(string employeeId);
        public Task<List<int>> ListOfResourceRequestIds(string employeeID);
        Task<int> SendEmailNotificationForAppliedOpportunity(ApplyOpportunityRequest applyOpportunityRequest);
        Task InsetIntoMailNotification(MailNotification mailNotification);
        Task<int?> WithdrawAppliedOpportunity(WithdrawOpportunityRequest withdrawOpportunityRequest, bool isDisapprovedByManager);
        Task<int?> ApproveAppliedOpportunity(EmployeeOpportunity employeeOpportunity);
        Task<int?> InitiateDiscussion(InitiateDiscussionRequest initiateDiscussionRequest);
        Task<EmployeeSkillMatrix> GetEmployeeSpecificSkillMatrix(string employeeId);
        Task<List<EmployeeSkillMatrix>> GetAllEmployeesSkillMatrix(string employeeId = "-1");
        Task<Employee> GetEmployeeSpecificDetails(string employeeId);
        Task<List<EmployeeProject>> GetEmidsProjects(string employeeId, string searchText);
        Task<Employee> GetEmployeeProfileDetails(Employee employeeDetail, List<EmployeeProject> emidsProjects, EmployeeSkillMatrix employeeSkillMatrix, List<EmployeeAssignment> previousOrgAssignments);
        public Task<List<LaunchpadEmployee>> GetEmployeesSearchData();
        public Task<List<DisapprovalReasons>> GetDisapprovalReasons();
        public Task<EmployeeAuthenticationDetails> GetEmployeeAuthenticationDetails(string userMailId);
        public Task<List<EmployeeAssignment>> GetPreviousOrgAssignments(string employeeId, string stmtType);
        public Task<int> UpsertPreviousOrgAssignments(EmployeeAssignment previousOrgAssignment);
        public Task<int?> UpdateEmployeeWriteUp(UpdateEmployeeWriteUp updateEmployeeAboutText);
        public Task<int> UpsertEmployeeOpportunity(EmployeeOpportunity employeeOpportunity);
        public Task<int?> UpdateRoleAndResponsibilityOfEmployee(EmployeeAssignment updateRoleAndResponsibilityOfEmployee);
        public Task<List<Employee>> GetRRMatchingLaunchPadEmployees(ResourceRequest resourceRequest);

        Task<List<EmployeeProject>> GetEmployeeProjectDetails(List<string> employeeIDs);
        Task<List<ResourceAvailabilityStatus>> CheckResourceStatus(string employeeId);
        Task<List<GetOpportunityHistoryResponse>> GetOpportunityHistory(int rrId, OpportunityHistoryType historyType);
        Task<List<GetTalentHistoryResponse>> GetTalentHistory(string employeeId);
        Task<List<ActiveRrResponse>> GetActiveRRs(string status);
        Task<LaunchPadResourceAnalysisResponses> GetViewLaunchPadResourceAnalysis();
    }
}

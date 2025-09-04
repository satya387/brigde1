using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using System.Data;

namespace Bridge.API.Synchronizer
{
    public class EmployeeSync : IEmployeeSync
    {
        private readonly IEmployeeDAO _employeeDAO;
        private readonly IResourceRequestDAO _resourceRequestDAO;
        private readonly IResourceRequestSync _resourceSync;
        private readonly IWFMHandlerDAO _wFMHandlerDAO;
        public EmployeeSync(IEmployeeDAO employeeDAO, IResourceRequestDAO resourceRequestDAO, IResourceRequestSync resourceSync, IWFMHandlerDAO wFMHandlerDAO)
        {
            _employeeDAO = employeeDAO;
            _resourceRequestDAO = resourceRequestDAO;
            _resourceSync = resourceSync;
            _wFMHandlerDAO = wFMHandlerDAO;
        }

        public async Task<int?> ApplyOpportunity(ApplyOpportunityRequest applyOpportunityRequest)
        {
            var resultStatus = await _employeeDAO.ApplyOpportunity(applyOpportunityRequest);
            if (resultStatus == StatusCodes.Status200OK)
            {
                return await _employeeDAO.SendEmailNotificationForAppliedOpportunity(applyOpportunityRequest);
            }
            return resultStatus;
        }

        public async Task<List<Employee>> GetEmployees(string location)
        {
            return await _employeeDAO.GetEmployees(location);
        }

        public async Task<List<LaunchpadEmployee>> GetLaunchpadEmployees()
        {
            return await _employeeDAO.GetLaunchpadEmployees();
        }

        public async Task<List<AppliedOpportunity>> GetSelfAppliedOpportunities(string employeeId)
        {
            var appliedOpportunitiesRrIds = await _employeeDAO.GetAppliedOpportunitiesRrIdsAndStatus(employeeId);
            if (appliedOpportunitiesRrIds == null || appliedOpportunitiesRrIds.Count == 0) return null;

            return await _employeeDAO.GetSelfAppliedOpportunities(appliedOpportunitiesRrIds, employeeId);
        }

        public async Task<List<ApplicationReviewResponse>> GetEmployeeAppliedOpportunitiesForManager(string managerEmployeeId)
        {
            var activeResoruceRequestsForManager = await _resourceRequestDAO.GetActiveResourceRequestsForManager(managerEmployeeId);

            if (activeResoruceRequestsForManager == null || activeResoruceRequestsForManager.Count == 0) return null;

            var employeeIdsForAppliedResourceRequests = await _employeeDAO.GetEmployeeRrIdForAppliedRrs(activeResoruceRequestsForManager);

            if (employeeIdsForAppliedResourceRequests == null || employeeIdsForAppliedResourceRequests.Count == 0) 
                employeeIdsForAppliedResourceRequests = new List<EmployeeOpportunity>();

            var employeesIds = employeeIdsForAppliedResourceRequests.Select(result => result?.EmployeeId ?? "").ToList();

            var employeeProjectDetails = await _employeeDAO.GetEmployeeProjectDetails(employeesIds);

            var employeeDetailsWithRrId = await _employeeDAO.GetEmployeeDetailsFromEmployeeIds(employeeIdsForAppliedResourceRequests, employeeProjectDetails);

            if (employeeDetailsWithRrId == null || employeeDetailsWithRrId.Count == 0) employeeDetailsWithRrId = new List<AppliedOpportunity>();

            return _employeeDAO.GetEmployeeAppliedOpportunitiesForManager(activeResoruceRequestsForManager, employeeDetailsWithRrId);
        }

        public async Task<int?> WithdrawAppliedOpportunity(WithdrawOpportunityRequest withdrawOpportunityRequest, bool isDisapprovedByManager)
        {
            return await _employeeDAO.WithdrawAppliedOpportunity(withdrawOpportunityRequest, isDisapprovedByManager);
        }

        public async Task<int?> ApproveAppliedOpportunity(EmployeeOpportunity employeeOpportunity)
        {
            return   await _employeeDAO.ApproveAppliedOpportunity(employeeOpportunity);
        }
        public async Task<List<ResourceAvailabilityStatus>> CheckResourceStatus(string employeeId)
        {
          return  await _employeeDAO.CheckResourceStatus(employeeId);
        }

        public async Task<Employee> GetEmployeeProfileDetails(string employeeId)
        {
            var employeeDetail = await _employeeDAO.GetEmployeeSpecificDetails(employeeId);

            if (employeeDetail == null) return null;

            var employeeEmidsProjects = await _employeeDAO.GetEmidsProjects(employeeId, string.Empty);

            var employeeSkillMatrix = await _employeeDAO.GetEmployeeSpecificSkillMatrix(employeeId);

            var previousOrgAssignments =  await _employeeDAO.GetPreviousOrgAssignments(employeeId, "Select");

            return await _employeeDAO.GetEmployeeProfileDetails(employeeDetail, employeeEmidsProjects, employeeSkillMatrix, previousOrgAssignments);
        }

        public async Task<List<LaunchpadEmployee>> EmployeeSearchData(string searchElement)
        {
            var emplyoeedetails = await _employeeDAO.GetEmployeesSearchData();
            var empDetails = new List<LaunchpadEmployee>(emplyoeedetails);
            string[] searchTerms = searchElement.Split(new string[] { "+" }, StringSplitOptions.RemoveEmptyEntries);
            var emidsProj = await _employeeDAO.GetEmidsProjects(string.Empty, searchElement);
            var prevsProj = await _employeeDAO.GetPreviousOrgAssignments(searchElement, "GlobalSearch");
            foreach (var term in searchTerms)
            {
                SearchEmployeesDetails(ref emplyoeedetails, term.Trim().ToLower());
            }

            var emidsAssign = (from emp in empDetails
                                   join prj in emidsProj
                                   on emp.EmployeeId equals prj.EmployeeId
                                   select emp).ToList();
            var previousAssign = (from emp in empDetails
                               join prj in prevsProj
                               on emp.EmployeeId equals prj.EmidsUniqueId
                               select emp).ToList();
            emplyoeedetails.AddRange(emidsAssign.Except(emplyoeedetails).ToList());
            emplyoeedetails.AddRange(previousAssign.Except(emplyoeedetails).ToList());
            return emplyoeedetails;
        }

        public List<LaunchpadEmployee> SearchEmployeesDetails(ref List<LaunchpadEmployee> employeedetails, string SearchTerm)
        {
            employeedetails = employeedetails
               .Where(employee =>
                   (employee.ProjectName != null && employee.ProjectName.ToLower().Contains(SearchTerm)) ||
                   (employee.BusinessLocation != null && employee.BusinessLocation.ToLower().Contains(SearchTerm)) ||
                   (employee.Designation != null && employee.Designation.ToLower().Contains(SearchTerm)) ||
                   (employee.EmployeeEmailId != null && employee.EmployeeEmailId.ToLower().Contains(SearchTerm)) ||
                   (employee.EmployeeName != null && employee.EmployeeName.ToLower().Contains(SearchTerm)) ||
                   (employee.WorkingLocation != null && employee.WorkingLocation.ToLower().Contains(SearchTerm)) ||
                   Utilities.SearchInCommaSeparatedValues(employee.PrimarySkills, SearchTerm) ||
                   Utilities.SearchInCommaSeparatedValues(employee.SecondarySkills, SearchTerm) ||
                   (employee.Experience > 0 && employee.Experience.ToString().Contains(SearchTerm)) ||
                   (employee.EmployeeId != null && employee.EmployeeId.ToLower().Contains(SearchTerm)))
               .ToList();

            return employeedetails;
        }

        public async Task<int?> InitiateDiscussion(InitiateDiscussionRequest initiateDiscussionRequest)
        {
            return await _employeeDAO.InitiateDiscussion(initiateDiscussionRequest);
        } 

        public async Task<List<DisapprovalReasons>> GetDisapprovalReasons()
        {
            return await _employeeDAO.GetDisapprovalReasons();
        }

        public async Task<List<EmployeeAssignment>> GetPreviousOrgAssignments(string employeeId)
        {
            return await _employeeDAO.GetPreviousOrgAssignments(employeeId, "Select");
        }

        public async Task<int> UpsertPreviousOrgAssignments(EmployeeAssignment previousOrgAssignment)
        {
            return await _employeeDAO.UpsertPreviousOrgAssignments(previousOrgAssignment);
        }

        public async Task<int> UpsertEmployeeOpportunity(EmployeeOpportunity employeeOpportunity)
        {
            return await _employeeDAO.UpsertEmployeeOpportunity(employeeOpportunity);
        }

        public async Task<int?> UpdateEmployeeWriteUp(UpdateEmployeeWriteUp updateEmployeeWriteUp)
        {
            return await _employeeDAO.UpdateEmployeeWriteUp(updateEmployeeWriteUp);
        }

        public async Task<int?> UpdateRoleAndResponsibilityOfEmployee(EmployeeAssignment updateRoleAndResponsibilityOfEmployee) 
        {
            return await _employeeDAO.UpdateRoleAndResponsibilityOfEmployee(updateRoleAndResponsibilityOfEmployee);
        }

        public async Task<List<Employee>> GetRRMatchingLaunchPadEmployees(ResourceRequest resourceRequest)
        {
            return await _employeeDAO.GetRRMatchingLaunchPadEmployees(resourceRequest);
        }

        public async Task<List<LaunchpadEmployee>> EmployeeFutureSearchData(string searchElement)
        {
            var emplyoeedetails = await _wFMHandlerDAO.GetFutureAvailableResources();
            var empDetails = new List<LaunchpadEmployee>(emplyoeedetails);
            string[] searchTerms = searchElement.Split(new string[] { "+" }, StringSplitOptions.RemoveEmptyEntries);
            var emidsProj = await _employeeDAO.GetEmidsProjects(string.Empty, searchElement);
            var prevsProj = await _employeeDAO.GetPreviousOrgAssignments(searchElement, "GlobalSearch");
            foreach (var term in searchTerms)
            {
                SearchEmployeesDetails(ref emplyoeedetails, term.Trim().ToLower());
            }

            var emidsAssign = (from emp in empDetails
                               join prj in emidsProj
                               on emp.EmployeeId equals prj.EmployeeId
                               select emp).ToList();
            var previousAssign = (from emp in empDetails
                                  join prj in prevsProj
                                  on emp.EmployeeId equals prj.EmidsUniqueId
                                  select emp).ToList();
            emplyoeedetails.AddRange(emidsAssign.Except(emplyoeedetails).ToList());
            emplyoeedetails.AddRange(previousAssign.Except(emplyoeedetails).ToList());
            return emplyoeedetails;
        }

        public async Task<List<GetTalentHistoryResponse>> GetTalentHistory(string employeeId)
        {
            return await _employeeDAO.GetTalentHistory(employeeId);
        }

    }
}

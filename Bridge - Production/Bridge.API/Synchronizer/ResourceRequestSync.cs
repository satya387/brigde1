using Bridge.API.DAO.Mappers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using Microsoft.AspNetCore.Mvc;
using System.Data;


namespace Bridge.API.Synchronizer
{
    public class ResourceRequestSync : IResourceRequestSync
    {
        private readonly IResourceRequestDAO _resourceRequestDAO;
        private readonly IEmployeeDAO _employeeDAO;
        public ResourceRequestSync(IResourceRequestDAO resourceRequestDAO, IEmployeeDAO iEmployeeDAO)
        {
            _resourceRequestDAO = resourceRequestDAO;
            _employeeDAO = iEmployeeDAO;
        }
        public async Task<ResourceRequestResult> GetResourceRequestsById(ResourceRequestDetailsHeader resourceRequestDetailsHeader)
        {
            
            int countOfEmployessAppliedForResourceRequest = _employeeDAO.GetAppliedEmployeesCountForResourceRequest(resourceRequestDetailsHeader.id).Result;

            var res = await _resourceRequestDAO.GetResourceRequestDetails(resourceRequestDetailsHeader.id);
            if (res != null)
            {
                var employees = await _employeeDAO.GetEmployees(resourceRequestDetailsHeader.EmployeeID);
                var resourceRequest = EmployeeMapper.MapResourceRequest(res);
                var matchingEmployees = new List<Employee>();
                Utilities.GetMatchIndicator(resourceRequest, employees?.FirstOrDefault());

                res.MatchCriteria = resourceRequest.MatchCriteria??"";
                res.MatchPercentage = resourceRequest.MatchPercentage;
            }
            var result = new ResourceRequestResult
            {
                ResourceRequestDetails = res,
                Applicants = countOfEmployessAppliedForResourceRequest
            };

            return result;
        }

        public async Task<List<ResourceRequestWithApplicantsCount>> GetEmployeeOpportunities(string employeeId)
        {
            string[] formattedSkill = null;
            string skills = null;
            string locationName = null;
            int minExperience = 0, maxExperience = 0;
            const int totalMonths = 12;
            string designation = null;
            bool isFilterApplied = false;
            string accountName = null;
            string[] formattedDesignation = null;
            string[] formattedLocation = null;
            string country = null;
            string projectName = null;
            string[] formattedProjectNames = null;
            List<ResourceRequestWithApplicantsCount> resourceRequestWithApplicantsCounts = new List<ResourceRequestWithApplicantsCount>();
            List<int> resourceRequestIdsEmployeeApplied = new List<int>();

            var opportunityFilterData = await _employeeDAO.EmployeeOpportunitySearchCriteria(employeeId);
            var employeeData = await _employeeDAO.GetEmployees(employeeId);

            foreach (var employee in employeeData)
            {
                accountName = employee.AccountName.ToUpper();
            }

            if (opportunityFilterData != null && (!string.IsNullOrWhiteSpace(opportunityFilterData?.Location) || !string.IsNullOrWhiteSpace(opportunityFilterData?.PrimarySkills)
                || (opportunityFilterData?.MinExperienceInYears > 0 || opportunityFilterData?.MaxExperienceInYears > 0) || !string.IsNullOrWhiteSpace(opportunityFilterData?.Role) || !string.IsNullOrWhiteSpace(opportunityFilterData?.ProjectName) || !string.IsNullOrWhiteSpace(opportunityFilterData?.Country)) || accountName == UtilityConstant.WfmAccount)
            {
                skills = opportunityFilterData?.PrimarySkills;
                locationName = opportunityFilterData?.Location;
                minExperience = opportunityFilterData?.MinExperienceInYears ?? 0;
                maxExperience = opportunityFilterData?.MaxExperienceInYears ?? 0;
                designation = opportunityFilterData?.Role;
                isFilterApplied = true;
                country = opportunityFilterData?.Country == UtilityConstant.CountryUSA ? UtilityConstant.CountryUS : opportunityFilterData?.Country;
                projectName = opportunityFilterData?.ProjectName;
            }
            else
            {
                if (employeeData?.Count <= 0 || employeeData == null) return null;
                foreach (var empDetails in employeeData)
                {
                    skills = string.IsNullOrEmpty(empDetails.PrimarySkills) ? "" : empDetails.PrimarySkills;
                    if (!string.IsNullOrEmpty(empDetails.SecondarySkills))
                    {
                        skills += (string.IsNullOrEmpty(skills) ? "" : ", ") + empDetails.SecondarySkills;
                    }
                    locationName = empDetails.Location;
                    minExperience = (int)Math.Round((empDetails.EmidsExperience + empDetails.PastExperience) / totalMonths);
                    maxExperience = minExperience;
                    designation = empDetails.Designation;
                }
            }

            if (!String.IsNullOrEmpty(skills))
            {
                formattedSkill = skills.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                .Where(skill => !string.IsNullOrEmpty(skill.Trim()))
                                .Select(skill => skill.Trim())
                                .ToArray();
            }

            if (!String.IsNullOrEmpty(projectName))
            {
                formattedProjectNames = projectName.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                       .Where(projects => !string.IsNullOrEmpty(projects.Trim()))
                                       .Select(projects => projects.Trim())
                                       .ToArray();
            }

            if (!String.IsNullOrEmpty(designation))
            {
                formattedDesignation = designation.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                       .Where(designations => !string.IsNullOrEmpty(designations.Trim()))
                                       .Select(designations => designations.Trim())
                                       .ToArray();
            }

            if (!String.IsNullOrEmpty(locationName))
            {
                formattedLocation = locationName.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                       .Where(locationNames => !string.IsNullOrEmpty(locationNames.Trim()))
                                       .Select(locationNames => locationNames.Trim())
                                       .ToArray();
            }

            if (accountName != UtilityConstant.WfmAccount)
            {
                resourceRequestIdsEmployeeApplied = await _employeeDAO.ListOfResourceRequestIds(employeeId);
            }

            var resourceRequestList = await _resourceRequestDAO.GetEmployeeOpportunitiesOnFilter(country, formattedLocation, minExperience, maxExperience, formattedSkill, resourceRequestIdsEmployeeApplied, formattedDesignation, formattedProjectNames, employeeData.FirstOrDefault(), employeeId, isFilterApplied);

            if (resourceRequestList != null && resourceRequestList.Count > 0)
            {
                var rridList = resourceRequestList.Select(result => result?.RRId ?? 0).ToList();

                var applicantsCountForRR = await _resourceRequestDAO.GetAppliedCountForAllResourceRequests(rridList);

                resourceRequestWithApplicantsCounts = resourceRequestList
                    .Select(result => new ResourceRequestWithApplicantsCount
                    {
                        ResourceRequest = result,
                        EmployeeAppliedCount = applicantsCountForRR.ContainsKey(result.RRId.GetValueOrDefault()) ? applicantsCountForRR[result.RRId.GetValueOrDefault()] : 0
                    })
                    .ToList();
            }
            return resourceRequestWithApplicantsCounts;
        }

        public async Task<List<ResourceRequest>> GetActiveResourceRequestsForManager(ManagerEmployeeIdsModel managerEmployeeIdsModel)
        {
            var activeRrs = await _resourceRequestDAO.GetActiveResourceRequestsForManager(managerEmployeeIdsModel.ManagerId);

            if (!string.IsNullOrWhiteSpace(managerEmployeeIdsModel.EmployeeId))
            {
                var empAppliedRrIds = await _resourceRequestDAO.GetRRIdsForEmployee(managerEmployeeIdsModel.EmployeeId);
                return activeRrs.Except(activeRrs.Where(rr => empAppliedRrIds.Contains((int)rr.RRId))).OrderBy(rr => rr.RRNumber).ToList();
            }

            return activeRrs;
        }

        public async Task<List<ResourceRequest>> GetResourceRequestsSearchData(string searchElement, string employeeId)
        {
            var resourceSearchResultData = await _resourceRequestDAO.GetResourceRequestsSearchData(employeeId);

            string[] searchTerms = searchElement.Split(new string[] { "+" }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var term in searchTerms)
            {
                SearchResourceRequestsData(ref resourceSearchResultData, term.Trim().ToLower());
            }

            return resourceSearchResultData;
        }

        public List<ResourceRequest> SearchResourceRequestsData(ref List<ResourceRequest> rrDetails, string SearchTerm)
        {
            rrDetails = rrDetails
                .Where(resource =>
                (resource.ProjectName != null && resource.ProjectName.ToLower().Contains(SearchTerm)) ||
                (resource.RRNumber != null && resource.RRNumber.ToLower().Contains(SearchTerm)) ||
                (resource.Experience != null && resource.Experience.ToString().Contains(SearchTerm)) ||
                (resource.Designation != null && resource.Designation.ToLower().Contains(SearchTerm)) ||
                (resource.Location != null && resource.Location.ToLower().Contains(SearchTerm)) ||
                Utilities.SearchInCommaSeparatedValues(resource.PrimarySkill, SearchTerm) ||
                Utilities.SearchInCommaSeparatedValues(resource.SecondarySkill, SearchTerm)).ToList();
            return rrDetails;
        }

        public async Task<List<AppliedOpportunity>> GetApplicantsByRRId(int rrId)
        {
            var activeResoruceRequests = new List<ResourceRequest>() { new ResourceRequest() { RRId = rrId } };

            var employeeIdsForAppliedResourceRequests = await _employeeDAO.GetEmployeeRrIdForAppliedRrs(activeResoruceRequests);

            if (employeeIdsForAppliedResourceRequests == null || employeeIdsForAppliedResourceRequests.Count == 0)
                employeeIdsForAppliedResourceRequests = new List<EmployeeOpportunity>();

            var employeesIds = employeeIdsForAppliedResourceRequests.Select(result => result?.EmployeeId ?? "").ToList();

            var employeeProjectDetails = await _employeeDAO.GetEmployeeProjectDetails(employeesIds);
            return await _employeeDAO.GetEmployeeDetailsFromEmployeeIds(employeeIdsForAppliedResourceRequests, employeeProjectDetails);
        }
        /// <summary>
        /// GetOpportunityHistory for resource and Employee
        /// </summary>
        /// <param name="rrId">rrId</param>
        /// <param name="historyType">OpportunityHistoryType</param>
        /// <returns>List<GetOpportunityHistoryResponse></returns>
        public async Task<List<GetOpportunityHistoryResponse>> GetOpportunityHistory(  int rrId, OpportunityHistoryType historyType)
        {  
             
            return await _employeeDAO.GetOpportunityHistory(rrId, historyType);

        }

        public async Task<List<ActiveRrResponse>> GetActiveRRs(  string status)
        { 
         return await _employeeDAO.GetActiveRRs(status);
        }

        public async Task<LaunchPadResourceAnalysisResponses> GetViewLaunchPadResourceAnalysis()
        {
            return await _employeeDAO.GetViewLaunchPadResourceAnalysis();
        }
    }
}

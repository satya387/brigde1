export const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;
export const EMPLOYEE_IMG_URL_BASE = "https://arci.emids.com/Documents/Photos/";

export const JOBS_API = `${API_BASE_URL}/ResourceRequest/GetEmployeeOpportunities`;
export const GETRRS_API = `${API_BASE_URL}/ResourceRequest/GetResourceRequestDetails`;
export const VIEWLAUNCHPADRESOURCEANALYSIS = `${API_BASE_URL}/ResourceRequest/GetViewLaunchPadResourceAnalysis`;

export const RRS_API = `${API_BASE_URL}/ResourceRequest`;
export const EMPLOYEE_API = `${API_BASE_URL}/Employees`;
export const GETEMP_SEARCH_FILTER_API = `${API_BASE_URL}/Filter/GetEmployeeOpportunitySearchFilter`;
export const SAVEEMP_SEARCH_FILTER_API = `${API_BASE_URL}/Filter/SaveEmployeeOpportunityFilter`;
export const GET_PROJECT_NAME = `${API_BASE_URL}/Filter/GetProjectsDetailsOfActiveRRs`;
export const APPLYJOB_API = `${API_BASE_URL}/Employee/ApplyOpportunity`;
export const SELFAPPLYJOB_API = `${API_BASE_URL}/Employee/GetSelfAppliedOpportunities`;
export const EMP_PROFILE_API = `${API_BASE_URL}/Employee/GetEmployeeProfileDetails`;

export const MANAGER_RR_LIST_API = `${API_BASE_URL}/ResourceRequest/GetActiveResourceRequestsForManager`;
export const MANAGER_APPLIED_OPPORTUNITY_API = `${API_BASE_URL}/Employee/GetEmployeeAppliedOpportunitiesForManager`;
export const LAUNCHPAD_EMPLOYEE_API = `${API_BASE_URL}/Employee/GetLaunchpadEmployees`;
export const DISAPROVE_OPPORTUNITY_API = `${API_BASE_URL}/Employee/DisapproveAppliedOpportunityByManager`;
export const WITHDRAW_OPPORTUNITY_API = `${API_BASE_URL}/Employee/WithdrawAppliedOpportunity`;
export const APPROVE_OPPORTUNITY_API = `${API_BASE_URL}/Employee/ApproveAppliedOpportunityByManager`;

export const INITIATE_DISCUSSION_API = `${API_BASE_URL}/Employee/InitiateDiscussion`;
export const INITIATE_L2_DISCUSSION_API = `${API_BASE_URL}/Employee/InitiateL2Discussion`;
export const SEARCH_API = `${API_BASE_URL}/Search/GlobalSearch`;
export const AUTHENTICATION_API = `${API_BASE_URL}/Authentication/GetEmployeeAuthenticationDetails`;

export const DISAPPROVAL_REASON_API = `${API_BASE_URL}/Employee/GetDisapprovalReasons`;
export const UPDATEEMPLOYEEABOUT_API = `${API_BASE_URL}/Employee/UpdateEmployeeWriteUp`;
export const UPDATEEMPLOYEE_ROLE_API = `${API_BASE_URL}/Employee/UpdateRoleAndResponsibilityOfEmployee`;
export const UPSERTEMPLOYEE_PREVIOUS_ORG_API = `${API_BASE_URL}/Employee/UpsertPreviousOrgAssignments`;
export const GETSKILL = `${API_BASE_URL}/Shared/GetSkills`;
export const GETROLE = `${API_BASE_URL}/Shared/GetRoles`;
export const GETCOUNTRIESANDCITIES = `${API_BASE_URL}/Shared/GetCountriesWithCities`;
export const TRACK_ANALYTICS = `${API_BASE_URL}/Shared/TrackApplicationAnalytics`;
export const GET_APPLICANT_BY_RRID = `${API_BASE_URL}/ResourceRequest/GetApplicantsByRRId`;
export const GET_ACTIVE_RRS = `${API_BASE_URL}/ResourceRequest/GetActiveRRs`;
export const GETMANAGERRESOURCES = `${API_BASE_URL}/Manager/GetManagerResources`;
export const GET_RR_PROGRESS_REPORT = `${API_BASE_URL}/Reports/GetRRProgressReport`;
export const GET_RR_USAGE_REPORT = `${API_BASE_URL}/Reports/GetBridgeUsageReport`;
export const GET_RR_AGEING_REPORT = `${API_BASE_URL}/Reports/GetRRActivityAgeingReport`;
export const GET_TALENT_REJECTION_ANALYSIS = `${API_BASE_URL}/WFMHandler/GetDeclinedAndDroppedComments`;
export const GET_DROPPED_APPLICATIONS = `${API_BASE_URL}/WFMHandler/GetDroppedApplications`;

export const INVITE_GRAPHAPI = `https://graph.microsoft.com/v1.0/me/events`;
export const SEND_EMAIL = `https://graph.microsoft.com/v1.0/me/sendMail`;
export const GET_FUTUREAVAILABLERESOURCES_API = `${API_BASE_URL}/WFMHandler/GetFutureAvailableResources`;
export const GET_WFMTEAMLIST = `${API_BASE_URL}/WFMHandler/GetWFMTeamList`;
export const SAVE_RESOURCE_AVAILABILITY = `${API_BASE_URL}/WFMHandler/SaveResourceAvailability`;
export const GET_ALL_AVAILABLE_RESOURCES = `${API_BASE_URL}/WFMHandler/GetAllAvailableResources`;
export const MANAGER_UPDATE_RESOURCE_STATUS = `${API_BASE_URL}/Manager/UpdateResourceStatus`;
export const GET_ALLOCATION_REQUEST = `${API_BASE_URL}/WFMHandler/GetResourceAllocationDetails`;
export const APPROVE_ALLOCATION = `${API_BASE_URL}/WFMHandler/UpsertResourceAllocationDetails`;
export const SELF_SUMMARY = `${API_BASE_URL}/Manager/UpsertSelfSummary`;
export const EMPLOYEE_SUMMARY = `${API_BASE_URL}/Manager/GetEmployeeSummary`;
export const SEND_INITIATE_CHAT = `https://graph.microsoft.com/v1.0/chats`;
export const SEND_CHAT = `https://graph.microsoft.com/v1.0/chats/<chatInitiateId>/messages`;
export const GET_ALL_RELEASED_EMPLOYEE = `${API_BASE_URL}/WFMHandler/GetReleasedEmployee`;
export const GET_RRMATCHING_LAUNCHPAD_EMPLOYEES = `${API_BASE_URL}/Employee/GetRRMatchingLaunchPadEmployees`;
export const ADD_COMMENT_ON_RR = `${API_BASE_URL}/WFMHandler/SaveRRResourceComments `;
export const VIEW_COMMENT_OF_RR = `${API_BASE_URL}/WFMHandler/GetRRResourceComments `;
export const FETCH_DYNAMIC_REPORTS = `${API_BASE_URL}/Reports/GetDynamicReport`;
export const RR_HISTORY = `${API_BASE_URL}/ResourceRequest/GetOpportunityHistory`;
export const EMPLOYEE_HISTORY = `${API_BASE_URL}/Employee/GetTalentHistory`;

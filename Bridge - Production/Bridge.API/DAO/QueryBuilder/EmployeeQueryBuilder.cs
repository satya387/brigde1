using System.Text;

namespace Bridge.API.DAO.QueryBuilder
{
    public class EmployeeQueryBuilder
    {
        #region SP's and Views
        public const string PREVIOUSORGASSIGNMENTS_CRUD = "PreviousOrgAssignmentsCRUD";
        public const string GETEMPLOYEEDETAILS_FOR_WFM = "GetEmployeeDetails_For_WFM";
        public const string GETLAUNCHPADEMPLOYEEDETAILS_FOR_WFM = "GetLaunchpadEmployeeDetails_For_WFM";
        public const string GET_EMPLOYEE_ASSIGNMENTS = "GetEmployeeAssigments";
        public const string GET_ALL_EMPLOYEES_SKILL_MATRIX = "USP_GetEmployeeLevel_SkillMatrix_WFM";
        public const string SEND_MAIL = "msdb.dbo.sp_send_dbmail";
        public const string UPDATE_ROLE_RESPONSIBILITY_AND_Skill_EMPLOYEE = "Update_ResourceAssign_RoleAndResponsibility_Bridge";
        public const string UPDATE_EMPLOYEE_WRITEUP = "Update_Employee_WriteUp_Bridge";
        public const string UPSERT_EMPLOYEE_OPPORTUNITY = "Upsert_EmployeeOpportunity_Bridge";
        public const string APPROVE_APPLIED_OPPORTUNITY = "Approve_EmployeeOpportunity";
        public const string USP_INSERT_EMPLOYEEOPPORTUNITY_ACTIVE = "USP_INSERT_EMPLOYEEOPPORTUNITY_ACTIVE";
        public const string USP_UPDATE_EMPLOYEEOPPORTUNITY_ACTIVE = "USP_UPDATE_EMPLOYEEOPPORTUNITY_ACTIVE";
        public const string USP_UPDATE_EMPLOYEEOPPORTUNITY_WITHDRAW = "USP_UPDATE_EMPLOYEEOPPORTUNITY_WITHDRAW";
        public const string GET_EMPLOYEEID_BY_RRID = "USP_GetEmployeeIDByRrId";
        public const string GET_EMPLOYEE_PROJECT_DETAILS = "USP_GetEmployeProjectDetails";
        public const string GET_CHECKRESOURCE_STATUS = "USP_GET_RESOURCE_STATUS";
        public const string RESOURCE_REQUESTID_EMPLOYEE_ALREADY_APPLIED = "USP_GetRRIdsForAppliedAndEarMarked";
        public const string RR_HISTORY = "USP_GetRRHistoryLog";
        public const string USP_GET_EmployeeOpportunity_BY_RRIds = "USP_GET_EmployeeOpportunity_BY_RRIds";
        public const string USP_EMPLOYEEHISTORYLOG = "USP_GetEmployeeHistoryLog";
        public const string USP_ALL_ACTIVERR_BY_STATUS = "USP_All_ActiveRR_BY_Status";
        public const string GET_LAUNCHPAD_AND_FUTURE_EMPLOYEEDETAILS = "USP_GetLaunchpadAndFutureEmployeeDetails";
        public const string USP_LAUNCHPAD_RESOURCEANALYSISREPORT = "USP_LaunchPad_ResourceAnalysisReport";
        #endregion

        #region Insert or Update Queries
        public const string SAVE_MAILNOTIFICATION = "Insert into MailNotification ([from], [to], cc, bcc, subject, body, error, isactive, createdon, [status]) " +
            "values ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', 1, GETDATE(), '{7}')";

        #endregion

        #region Select Queries
        public const string APPLYOPPORTUNITY_EXIST = "select EO.Id, EOS.Status from EmployeeOpportunity(Nolock) EO inner join EmployeeOpportunityStatus(Nolock) EOS " +
            "on EO.StatusId = EOS.Id where EO.EmployeeId = '{0}' and EO.RrId = '{1}'";

        public const string APPLIEDOPPORTUNITIES_GET_RRIDS_AND_STATUS = "select RrId, StatusId, ScheduledDate,Comments from EmployeeOpportunity(Nolock) where EmployeeId = '{0}'";

        public const string APPLIEDOPPOTUNITIES_GETRRDETAILS = "select rr.YearsOfExp, EO.RRStatus, RS.Allocation as AvailableAllocationPercentage, rr.JobTitle, rr.Location, rr.WorkLocation,rr.MusttoHaveSkill, rr.RRNumber, rr.RLSTechnology, rr.Location, " +
            "rr.Id, rr.SecondarySkills, rr.StartDate, pm.ProjName, Case When rr.Location='US' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UC.CityName END) " +
            "When rr.Location='INDIA' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE IC.CityName END) " +
            "When rr.Location='UK' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UKC.CityName END) ELSE CMT.CityName END AS CityName FROM RR_ResourceRequests(Nolock) rr INNER JOIN ProjectMaster(Nolock) pm " +
            "ON rr.ProjectId = pm.ProjId INNER Join RR_RequestStatusMaster(Nolock) rrm on rr.StatusId = rrm.StatusId LEFT JOIN Tbl_INDIACitiesMaster(Nolock) IC ON IC.ID = rr.CityId LEFT JOIN Tbl_USCitiesMaster(Nolock) UC ON UC.ID = rr.CityId " +
            "LEFT JOIN Tbl_UKCitiesMaster(Nolock) UKC ON UKC.ID = rr.CityId LEFT JOIN tbl_CityMaster(Nolock) CMT ON CMT.ID = rr.CityId " +
            "LEFT JOIN EmployeeOpportunity(Nolock) EO ON rr.Id = EO.RrId LEFT JOIN ResourceAssign(Nolock) RS ON RS.EmpeMidsID = eo.EmployeeId AND RS.ReleaseDate >= GETDATE() AND ISDuplicate != 1 " +
            "WHERE rr.Id IN ({0}) AND Eo.EmployeeId IN ('{1}') AND rrm.RRStatus = 'Open' And rrm.IsActive = 1";


        public const string EMPLOYEESCOUNT_APPLIED_FOR_RESOURCEREQUEST = "Select COUNT(RrId) As AppliedResourceRequestIdCount From EmployeeOpportunity(Nolock) " +
            "Where RrId = {0}";

        public const string EMPLOYEE_OPPORTUNITY_SEARCH_CRITERIA = "Select PrimarySkills, Location, MinExperienceInYears, MaxExperienceInYears, Role, Country, ProjectName from EmployeeMyJobsSearchCriteria(Nolock) " +
            "where EmployeeId = '{0}'";


        public const string GET_MANAGERID_FROM_RRID = "select pma.EmpeMidsID as ProjectManagerId from RR_ResourceRequests(Nolock) rr inner join ProjectMaster(Nolock) " +
            "pm INNER JOIN ProjectmasterAccess PMA ON PMA.ProjID = Pm.ProjId AND PMA.RoleID = 1 on rr.ProjectId = pm.ProjId " +
            "where rr.Id = {0} AND (PMA.Enddate >= Getdate() OR Year(PMA.EndDate) = 1900)";

        public const string GET_DISAPPROVALREASONS = "Select DisapprovalReason From DisapprovalReasons With(Nolock)";
        public const string CHECK_FOR_EMPLYOEEROLE = "Select Top 1 1 From ProjectMaster(Nolock) p " +
                                                        "Inner Join ProjectmasterAccess(Nolock) pma On p.ProjID = pma.ProjId " +
                                                        "Inner Join ProjectMasterRoles(Nolock) pr On  pma.RoleID = pr.ID " +
                                                    "Where pma.EmpeMidsID = '{0}' And (Pma.EndDate >= GetDate() or Year(pma.EndDate) = 1900)";
        #endregion

        public static string BuildWithParameters(string query, List<object> parameters)
        {
            var sb = new StringBuilder();
            foreach (var parameter in parameters)
            {
                sb.AppendFormat(query, parameter);
            }
            return sb.ToString();
        }
    }
}

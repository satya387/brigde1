using Bridge.Infrastructure.Entities;
using System.Text;

namespace Bridge.API.DAO.QueryBuilder
{
    public static class ResourceRequestQueryBuilder
    {

        #region SP's and Views
        public const string APPLIED_COUNT_FOR_ALL_RESOURCEREQUEST = "USP_GetAppliedCountForRRIds";
        public const string USP_GET_ACTIVE_OR_ALLRESOURCE_REQUESTSFORMANAGERBY_MANAGERID = "USP_GetActiveResourceRequestsForManagerByManagerID";
        public const string GET_RESOURCEREQUEST_DETAILS_BYID = "USP_GetResourceRequestDetailsByID";
        public const string EARMARKED_RESOURCE_REQUESTID = "USP_GetEarMarkedRRId";
        #endregion

        #region Select Queries

        public const string RESOURCEREQUEST_GET_BY_ID = "Select Distinct r.Id, r.StartDate, pm.ProjName, r.YearsOfExp, pm.Allocation1, r.WorkLocation, r.MusttoHaveSkill, r.JobTitle, " +
            "r.Role, r.SecondarySkills, pma.EmpeMidsID as ProjectManagerId, r.ProjectOverview, r.RoleOverview, r.RolesAndResponsibilities, r.ClosureDate, r.RRNumber, r.RLSTechnology, r.Requester AS RequesterId, " +
            "r.ProjectDuration, r.CityId, Case When R.Location='US' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UC.CityName END) " +
            "When R.Location='INDIA' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE IC.CityName END) When R.Location='UK' " +
            "Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UKC.CityName END) ELSE CMT.CityName END AS CityName, r.Location from RR_ResourceRequests(Nolock) " +
            "r INNER Join ProjectMaster(Nolock) pm on r.ProjectId = pm.ProjId INNER JOIN ProjectmasterAccess PMA ON PMA.ProjID = Pm.ProjId AND PMA.RoleID = 1 " +
            "LEFT JOIN Tbl_INDIACitiesMaster(Nolock) IC ON IC.ID = r.CityId LEFT JOIN Tbl_USCitiesMaster(Nolock) UC ON UC.ID = r.CityId " +
            "LEFT JOIN Tbl_UKCitiesMaster(Nolock) UKC ON UKC.ID = r.CityId LEFT JOIN tbl_CityMaster(Nolock) CMT ON CMT.ID = r.CityId " +
            "Where r.Id = {0} AND (PMA.Enddate >= Getdate() OR Year(PMA.EndDate) = 1900)";



        public const string GET_ALL_ACTIVERESOURCEREQUEST = "Select r.Id, r.RRNumber, pm.ProjName, r.JobTitle, r.MusttoHaveSkill, r.SecondarySkills, pm.Allocation1, " +
            "r.StartDate, r.YearsOfExp, r.Location, r.Role, r.RLSTechnology, r.ProjectDuration, r.CityId, Case When R.Location='US' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UC.CityName END) " +
            "When R.Location='INDIA' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE IC.CityName END) " +
            "When R.Location='UK' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UKC.CityName END) ELSE CMT.CityName END AS CityName, RRC.RRComment " +
            "from RR_ResourceRequests(Nolock) r INNER Join ProjectMaster(Nolock) pm on r.ProjectId = pm.ProjId " +
            "INNER Join RR_RequestStatusMaster(Nolock) rrm on r.StatusId = rrm.StatusId LEFT JOIN Tbl_INDIACitiesMaster(Nolock) IC ON IC.ID = r.CityId LEFT JOIN Tbl_USCitiesMaster(Nolock) UC ON UC.ID = r.CityId " +
            "LEFT JOIN Tbl_UKCitiesMaster(Nolock) UKC ON UKC.ID = r.CityId LEFT JOIN tbl_CityMaster(Nolock) CMT ON CMT.ID = r.CityId " +
            "LEFT JOIN (SELECT  RRC1.RrId, RRC1.RRComment FROM RR_ResourceRequestsComments (NOLOCK) RRC1 INNER JOIN (SELECT RrId, MAX(WFMCreatedDate) AS MaxDate FROM RR_ResourceRequestsComments (NOLOCK) GROUP BY RrId) RRC2 ON RRC1.RrId = RRC2.RrId AND RRC1.WFMCreatedDate = RRC2.MaxDate) RRC ON r.Id = RRC.RrId Where rrm.RRStatus = 'Open' And rrm.IsActive = 1";

        public const string GET_RRIDS_FOR_EMPLOYEE = "SELECT RrId FROM EmployeeOpportunity(Nolock) EO  " +
                              "INNER JOIN EmployeeOpportunitystatus EOS on EO.StatusId = EOS.Id WHERE EmployeeId = '{0}' OR EOS.Status = 'Earmarked'";

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

        public static string ResourceRequestFilterQueryBuilder(List<object> parameters, string[] skills, string[] designations, string[] projectNames, string employeeId, bool isFilterApplied = false)
        {
            string query = GET_ALL_ACTIVERESOURCEREQUEST;
            if (!string.IsNullOrEmpty(Convert.ToString(parameters[0])))
            {
                var locations = (string[])parameters[0];
                query += " And (" + string.Join(" OR ", locations.Select(location =>
                        "IC.CityName = '" + location + "'")) + " OR " +
                        string.Join(" OR ", locations.Select(location =>
                        "UC.CityName = '" + location + "'")) + " OR " +
                        string.Join(" OR ", locations.Select(location =>
                        "UKC.CityName = '" + location + "'")) + " OR " +
                        string.Join(" OR ", locations.Select(location =>
                        "CMT.CityName = '" + location + "'")) + ")";
            }
            else if (!string.IsNullOrEmpty(Convert.ToString(parameters[3])))
            {
                query += " And r.Location = '" + parameters[3] + "'";
            }
            if (parameters[1] != null && (Convert.ToInt32(parameters[1]) > 0 || Convert.ToInt32(parameters[4]) > 0))
            {
                query += " And r.YearsOfExp >= " + parameters[1] + " And r.YearsOfExp <= " + parameters[4];
            }
            if (!string.IsNullOrEmpty(Convert.ToString(parameters[2])))
            {
                query += " AND (" + "r.Id NOT IN (" + parameters[2] + ") OR r.Requester = '" + employeeId + "')";
            }
            if (designations != null && designations?.Length > 0)
            {
                query += " AND (" + string.Join(" OR ", designations.Select(designation =>
                        "r.Role = '" + designation + "'")) + ")";
            }
            if (projectNames != null && projectNames?.Length > 0)
            {
                query += " AND (" + string.Join(" OR ", projectNames.Select(projectName =>
                        "pm.ProjName = '" + projectName + "'")) + ")";
            }

            if (skills != null && skills?.Length > 0)
            {
                if (isFilterApplied)
                {
                    query += " AND (" + string.Join(" OR ", skills.Select(skill =>
                        "r.RLSTechnology LIKE '%" + skill + "%'")) + ")";
                }
                else
                {
                    query += " AND (" + string.Join(" OR ", skills.Select(skill =>
                        "r.SecondarySkills LIKE '%" + skill + "%' OR r.RLSTechnology LIKE '%" + skill + "%'")) + ")";
                }
            }

            query += " ORDER BY r.RRNumber";
            return query;
        }

        public static string EarMarkedRRFilterQueryBuilder(List<object> parameters, string employeeId)
        {
            string query = GET_ALL_ACTIVERESOURCEREQUEST;

            if (!string.IsNullOrEmpty(Convert.ToString(parameters[0])))
            {
                query += " AND (" + "r.Id NOT IN (" + parameters[0] + ") OR r.Requester = '" + employeeId + "')";
            }

            query += " ORDER BY r.RRNumber";
            return query;
        }
    }
}

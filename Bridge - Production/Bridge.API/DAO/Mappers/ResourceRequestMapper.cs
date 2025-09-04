using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Utility;
using System.Data;

namespace Bridge.API.DAO.Mappers
{
    public static class ResourceRequestMapper
    {
        public static ResourceRequestDetails MapResourceRequestDetails(DataTable dataTable)
        {
            ResourceRequestDetails resourceRequestDetail = null;
            foreach (DataRow row in dataTable.Rows)
            {
                resourceRequestDetail = new ResourceRequestDetails()
                {
                    RRId = Utilities.CheckDBNullForInt(row, "Id"),
                    StartDate = Utilities.CheckDBNullForDate(row, "StartDate"),
                    AccountName = Utilities.CheckDBNullForString(row, "ProjName"),
                    MinimumExp = Utilities.CheckDBNullForInt(row, "YearsOfExp"),
                    Allocation = Utilities.CheckDBNullForInt(row, "Allocation1"),
                    WorkLocation = Utilities.CheckDBNullForString(row, "CityName"),
                    PrimarySkill = Utilities.CheckDBNullForString(row, "RLSTechnology"),
                    SecondarySkill = Utilities.CheckDBNullForString(row, "SecondarySkills"),
                    ManagerId = Utilities.CheckDBNullForString(row, "ProjectManagerId"),
                    About = Utilities.CheckDBNullForString(row, "ProjectOverview"),
                    JobSummary = Utilities.CheckDBNullForString(row, "RoleOverview"),
                    RolesandResponsibilities = Utilities.CheckDBNullForString(row, "RolesAndResponsibilities"),
                    OpenTill = Utilities.CheckDBNullForDate(row, "ProjectDuration"),
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    Role = Utilities.CheckDBNullForString(row, "Role"),
                    JobTitle = Utilities.CheckDBNullForString(row, "JobTitle"),
                    RRCountry = Utilities.CheckDBNullForString(row, "Location"),
                    RrRequesterId = Utilities.CheckDBNullForString(row, "RequesterId"),
                    RequesterName = Utilities.CheckDBNullForString(row, "RequesterName"),
                    RequesterMailId = Utilities.CheckDBNullForString(row, "RequesterMailID"),
                    ProjectManagerId = Utilities.CheckDBNullForString(row, "ProjectManagerId"),
                    ProjectManagerName = Utilities.CheckDBNullForString(row, "ProjectManagerName"),
                    ProjectManagerMailID = Utilities.CheckDBNullForString(row, "ProjectManagerMailID"),
                   
                };
            }
            return resourceRequestDetail;
        }

        public static List<ResourceRequest> MapActiveResourceRequestForManager(DataTable dataTable)
        {
            var activeResourceRequestsForManager = new List<ResourceRequest>();
            foreach (DataRow row in dataTable.Rows)
            {
                var resourceRequest = new ResourceRequest()
                {

                    RRId = Utilities.CheckDBNullForInt(row, "Id"),
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjName"),
                    JobTitle = Utilities.CheckDBNullForString(row, "JobTitle"),
                    PrimarySkill = Utilities.CheckDBNullForString(row, "RLSTechnology"),
                    SecondarySkill = Utilities.CheckDBNullForString(row, "SecondarySkills"),
                    Allocation = Utilities.CheckDBNullForInt(row, "Allocation1"),
                    StartDate = Utilities.CheckDBNullForDate(row, "StartDate"),
                    Experience = Utilities.CheckDBNullForInt(row, "YearsOfExp"),
                    Location = Utilities.CheckDBNullForString(row, "CityName"),
                    Designation = Utilities.CheckDBNullForString(row, "Role")

                };
                activeResourceRequestsForManager.Add(resourceRequest);
            }
            return activeResourceRequestsForManager;
        }
        public static List<ResourceRequest> MapEmployeeOpportunitiesOnFilterdata(DataTable dataTable, Employee employee)
        {
            var resourceRequestsOnEmployeeFilter = new List<ResourceRequest>();
            foreach (DataRow row in dataTable.Rows)
            {
                var resourceRequest = new ResourceRequest()
                {
                    RRId = Utilities.CheckDBNullForInt(row, "Id"),
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjName"),
                    JobTitle = Utilities.CheckDBNullForString(row, "JobTitle"),
                    PrimarySkill = Utilities.CheckDBNullForString(row, "RLSTechnology"),
                    SecondarySkill = Utilities.CheckDBNullForString(row, "SecondarySkills"),
                    Allocation = Utilities.CheckDBNullForInt(row, "Allocation1"),
                    StartDate = Utilities.CheckDBNullForDate(row, "StartDate"),
                    Experience = Utilities.CheckDBNullForInt(row, "YearsOfExp"),
                    Location = Utilities.CheckDBNullForString(row, "CityName"),
                    Designation = Utilities.CheckDBNullForString(row, "Role"),
                    RrComments = Utilities.CheckDBNullForString(row, "RRComment")
                };
                Utilities.GetMatchIndicator(resourceRequest, employee);
                resourceRequestsOnEmployeeFilter.Add(resourceRequest);
            }
            return resourceRequestsOnEmployeeFilter;
        }

        public static Dictionary<int, int> MapCountOfAppliedResourceRequests(DataTable dataExist)
        {
            var result = new Dictionary<int, int>();

            foreach (DataRow row in dataExist.Rows)
            {
                result.Add((int)row["RrId"], (int)row["AppliedResourceRequestIdCount"]);
            }
            return result;
        }

        public static List<int> MapRrIdsOfEmployee(DataTable rrIds)
        {
            var result = new List<int>();

            foreach (DataRow row in rrIds.Rows)
            {
                result.Add((int)row["RrId"]);
            }

            return result;
        }
    }
}

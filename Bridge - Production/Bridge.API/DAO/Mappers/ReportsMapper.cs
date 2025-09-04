using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Utility;
using System.Data;

namespace Bridge.API.DAO.Mappers
{
    public class ReportsMapper
    {
        public static List<BridgeUsageReport> MapBridgeUsageReport(DataTable dataTable)
        {
            var bridgeUsageReports = new List<BridgeUsageReport>();
            foreach (DataRow row in dataTable.Rows)
            {
                var bridgeUsageReport = new BridgeUsageReport()
                {
                    EmployeeId = Utilities.CheckDBNullForString(row, "Employee ID"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "Employee Name"),
                    WorkLocation = Utilities.CheckDBNullForString(row, "Work Location"),
                    Role = Utilities.CheckDBNullForString(row, "Role"),
                    NoOfTimesLoggedIn = Utilities.CheckDBNullForInt(row, "NoOfTimesLoggedIn"),
                    LastLogin = Utilities.CheckDBNullForDate(row, "LastLogin"),
                    ProfileUpdatedOn = Utilities.CheckDBNullForDate(row, "ProfileUpdatedOn"),
                    NoOfRRsOwned = Utilities.CheckDBNullForInt(row, "NoRRsOwned"),
                    ManagerRRsApplication = new RRsApplication()
                    {
                        Active = Utilities.CheckDBNullForInt(row, "Active Manager"),
                        Withdrawn = Utilities.CheckDBNullForInt(row, "Withdrawn Manager"),
                        Scheduled = Utilities.CheckDBNullForInt(row, "Scheduled Manager"),
                        Declined = Utilities.CheckDBNullForInt(row, "Declined Manager"),
                        AllocationRequested = Utilities.CheckDBNullForInt(row, "AllocationRequested Manager"),
                        Dropped = Utilities.CheckDBNullForInt(row, "Dropped Manager"),
                        Total = Utilities.CheckDBNullForInt(row,"Total Manager")
                    },
                    EmployeeRRsApplication = new RRsApplication()
                    {
                        Active = Utilities.CheckDBNullForInt(row, "Active Employee"),
                        Withdrawn = Utilities.CheckDBNullForInt(row, "Withdrawn Employee"),
                        Scheduled = Utilities.CheckDBNullForInt(row, "Scheduled Employee"),
                        Declined = Utilities.CheckDBNullForInt(row, "Declined Employee"),
                        AllocationRequested = Utilities.CheckDBNullForInt(row, "AllocationRequested Employee"),
                        Dropped = Utilities.CheckDBNullForInt(row, "Dropped Employee"),
                        Total = Utilities.CheckDBNullForInt(row, "Total Employee")
                    }
                };
                bridgeUsageReports.Add(bridgeUsageReport);
            }
            return bridgeUsageReports;
        }
        public static List<RRProgressReport> MapRRProgressReport(DataTable dataTable)
        {
            var rRProgressReports = new List<RRProgressReport>();
            foreach (DataRow row in dataTable.Rows)
            {
                var rRProgressReport = new RRProgressReport()
                {
                    RRNumber = Utilities.CheckDBNullForString(row, "RR Number"),
                    ProjectName = Utilities.CheckDBNullForString(row, "Project Name"),
                    RoleRequested = Utilities.CheckDBNullForString(row, "Role Requested"),
                    PrimarySkills = Utilities.CheckDBNullForString(row, "Primary Skills"),
                    WorkLocation = Utilities.CheckDBNullForString(row, "Work Location"),
                    Experience = Utilities.CheckDBNullForString(row, "Experience"),
                    PostedOn = Utilities.CheckDBNullForString(row, "Posted On"),
                    RRsApplication = new RRsApplication()
                    {
                        Active = Utilities.CheckDBNullForInt(row, "Active Employee"),
                        Withdrawn = Utilities.CheckDBNullForInt(row, "Withdrawn Employee"),
                        Scheduled = Utilities.CheckDBNullForInt(row, "Scheduled Employee"),
                        Declined = Utilities.CheckDBNullForInt(row, "Declined Employee"),
                        AllocationRequested = Utilities.CheckDBNullForInt(row, "AllocationRequested Employee"),
                        Dropped = Utilities.CheckDBNullForInt(row, "Dropped Employee"),
                        ReasonForReject = Utilities.CheckDBNullForString(row, "Reason For Reject"),
                        Total = Utilities.CheckDBNullForInt(row, "Total Employee")
                    }
                };
                rRProgressReports.Add(rRProgressReport);
            }
            return rRProgressReports;
        }

        public static List<RRAgeingReport> MapRRAgeingReport(DataTable dataTable)        
        {
            var rRProgressReports = new List<RRAgeingReport>();
            if (dataTable.Rows.Count > 0)
            {
                foreach (DataRow row in dataTable.Rows)
                {
                    var rRProgressReport = new RRAgeingReport()
                    {
                        RRId = Utilities.CheckDBNullForInt(row, "RR_Id"),
                        RRNumber = Utilities.CheckDBNullForString(row, "RR_Number"),
                        ProjectName = Utilities.CheckDBNullForString(row, "RR_ProjectName"),
                        RoleRequested = Utilities.CheckDBNullForString(row, "RR_RoleRequested"),
                        PostedOn = Utilities.CheckDBNullForString(row, "RR_PostedOn"),
                        Ageing = Utilities.CheckDBNullForInt(row, "RRAgeing"),
                    };
                    rRProgressReports.Add(rRProgressReport);
                }
            }
            return rRProgressReports;
        }
    }
}

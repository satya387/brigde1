using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Utility;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Text.Json;

namespace Bridge.API.DAO.Mappers
{
    public static class ManagerMapper
    {
        public static List<ManagerResources> MapManagerResources(DataTable managerResourcesList)
        {
            var managerResources = new List<ManagerResources>();
            foreach (DataRow row in managerResourcesList.Rows)
            {
                var resource = new ManagerResources()
                {
                    EmployeeName = Utilities.CheckDBNullForString(row, "EmployeeName"),
                    EmployeeId = Utilities.CheckDBNullForString(row, "EmpeMidsID"),
                    Role = Utilities.CheckDBNullForString(row, "Designation"),
                    ExperienceYears = (int?)Math.Round((decimal)(Utilities.CheckDBNullForInt(row, "Past Experience") + Utilities.CheckDBNullForInt(row, "eMids Experience")) / 12),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjectName"),
                    ExperienceInProject = (int?)Math.Round((decimal)Utilities.CheckDBNullForInt(row, "eMids Experience") / 12),
                    AllocatedOn = Utilities.CheckDBNullForDate(row, "AssignDate")?.ToString("MM/dd/yyyy"),
                    Status = Utilities.CheckDBNullForString(row, "Status"),
                    BillingStatus = Utilities.CheckDBNullForString(row, "BillingType"),

                    // TO DO Newly Added Property and Update from GetEmployeeSummary
                    CreatedBy = Utilities.CheckDBNullForString(row, "CreatedBy"),
                    ModifiedBy = Utilities.CheckDBNullForString(row, "ModifiedBy"),
                    WFMEmployeeId = Utilities.CheckDBNullForString(row, "WFMEmployeeId"),
                    ManagerApproveOrWithdrawDate = Utilities.CheckDBNullForDate(row, "ManagerApproveOrWithdrawDate")?.ToString("MM/dd/yyyy"),
                    ReleaseReason = Utilities.CheckDBNullForString(row, "ReleaseReason"),
                    InformedEmployee = Utilities.CheckDBNullForString(row, "InformedEmployee"),
                    WfmSuggestedDate = Utilities.CheckDBNullForDate(row, "WfmSuggestedDate")?.ToString("MM/dd/yyyy"),
                    ManagerId = Utilities.CheckDBNullForString(row, "ManagerId"),
                    Comments = Utilities.CheckDBNullForString(row, "Comments"),
                    WfmRejectComment = Utilities.CheckDBNullForString(row, "WfmRejectComment")

                };
                managerResources.Add(resource);
            }
            return managerResources;
        }

       public static EmployeeSummaryResponse GetEmployeeSummary(DataTable resources)
        {
            return new EmployeeSummaryResponse { EmployeeSummary =! string.IsNullOrEmpty( resources.Rows[0]["EmployeeSummary"]?.ToString())? JsonHelper.DeserializeAndFlatten( resources.Rows[0]["EmployeeSummary"].ToString()):new Dictionary<string, object>(),
                 ManagerSummary  = !string.IsNullOrEmpty(resources.Rows[0]["ManagerSummary"]?.ToString()) ? JsonHelper.DeserializeAndFlatten(resources.Rows[0]["ManagerSummary"].ToString()) : new Dictionary<string, object>(),
            };
        }
    }
}

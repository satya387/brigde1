using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Utility;
using System.Data;

namespace Bridge.API.DAO.Mappers
{
    public class FilterMapper
    {
        public static OpportunityFilter MapOpportunityFilter(DataTable filterDataTable)
        {
            if (filterDataTable == null || filterDataTable.Rows.Count == 0)
            {
                return null;
            }

            var opportunityFilter = new OpportunityFilter();
            foreach (DataRow row in filterDataTable.Rows)
            {
                opportunityFilter.Id = Utilities.CheckDBNullForInt(row, "Id").Value;
                opportunityFilter.EmployeeId = Utilities.CheckDBNullForString(row, "EmployeeId");
                opportunityFilter.MinExperienceInYears = Utilities.CheckDBNullForInt(row, "MinExperienceInYears");
                opportunityFilter.MaxExperienceInYears = Utilities.CheckDBNullForInt(row, "MaxExperienceInYears");
                opportunityFilter.PrimarySkills = Utilities.CheckDBNullForString(row, "PrimarySkills");
                opportunityFilter.Location = Utilities.CheckDBNullForString(row, "Location");
                opportunityFilter.Role = Utilities.CheckDBNullForString(row, "Role");
                opportunityFilter.Country = Utilities.CheckDBNullForString(row, "Country");
                opportunityFilter.ProjectName = Utilities.CheckDBNullForString(row, "ProjectName");
            }

            return opportunityFilter;
        }

        public static int MapOpportunityFilterId(DataTable filterDataTable)
        {
            return filterDataTable.Rows.Count > 0 ? filterDataTable.Rows[0]["Id"] != null ? Convert.ToInt32(filterDataTable.Rows[0]["Id"]) : 0 : 0;
        }

        public static List<ProjectDetails> MapProjectDetails(DataTable projDetails)
        {
            var projDetailsList = new List<ProjectDetails>();
            foreach (DataRow row in projDetails.Rows)
            {
                var projectDetail = new ProjectDetails()
                {
                    ProjectId = Utilities.CheckDBNullForInt(row, "ProjectId"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjectName"),
                    ProjectRRCount = Utilities.CheckDBNullForInt(row, "ProjectRRCount")
                };
                projDetailsList.Add(projectDetail);
            }
            return projDetailsList;
        }
    }
}

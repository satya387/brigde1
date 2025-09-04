using Bridge.API.DAO.Mappers;
using Bridge.API.DAO.QueryBuilder;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Interfaces;
using System.Data;

namespace Bridge.API.DAO
{
    public class FilterDAO : IFilterDAO
    {
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private static string connectionString;
        private readonly ILogger<FilterDAO> _logger;

        public FilterDAO(IConfiguration configuration, ISyncProvider syncProvider, ILogger<FilterDAO> logger)
        {
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
        }

        public async Task<OpportunityFilter> GetEmployeeOpportunitySearchFilter(string employeeId)
        {
            try
            {
                _logger.LogInformation("FilterDAO: GetEmployeeOpportunitySearchFilter");
                _logger.LogTrace("GetEmployeeOpportunitySearchFilter method started for EmployeeId: {EmployeeId}", employeeId);

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var parameters = new object[]
                {
                    employeeId
                };
                var filterDataTable = await _syncProvider.GetByQuery(connectionString, string.Format(FilterQueryBuilder.OpportunityFilter_Get, parameters));

                if (filterDataTable == null || filterDataTable.Rows.Count == 0)
                {
                    _logger.LogTrace("GetEmployeeOpportunitySearchFilter: No records found for the given EmployeeID: {EmployeeID}", employeeId);

                }

                _logger.LogTrace("GetEmployeeOpportunitySearchFilter method completed successfully for EmployeeId: {EmployeeId}", employeeId);

                return FilterMapper.MapOpportunityFilter(filterDataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeOpportunitySearchFilter for EmployeeId: {EmployeeId}", employeeId);
                throw;
            }
        }


        public async Task<int?> SaveEmployeeOpportunityFilter(OpportunityFilter opportunityFilter)
        {
            try
            {
                _logger.LogInformation("FilterDAO: SaveEmployeeOpportunityFilter");
                _logger.LogTrace("SaveEmployeeOpportunityFilter method started for EmployeeId: {EmployeeId}", opportunityFilter.EmployeeId);

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                if (opportunityFilter.Id == 0)
                {
                    _logger.LogInformation("SaveEmployeeOpportunityFilter: Saving a new opportunity filter.");
                    return await SaveNewOppotunityFilter(opportunityFilter);
                }
                else
                {
                    var parameters = new object[] { opportunityFilter.EmployeeId };

                    var filterDataTable = await _syncProvider.GetByQuery(connectionString, string.Format(FilterQueryBuilder.OpportunityFilter_Exist, parameters));

                    int id = FilterMapper.MapOpportunityFilterId(filterDataTable);

                    if (id == 0)
                    {
                        _logger.LogInformation("SaveEmployeeOpportunityFilter: Existing filter not found. Saving a new opportunity filter.");
                        return await SaveNewOppotunityFilter(opportunityFilter);
                    }
                    else
                    {
                        var updateParameters = new object[]
                        {
                            opportunityFilter.Id, opportunityFilter.MinExperienceInYears, opportunityFilter.Location,
                            opportunityFilter.PrimarySkills, opportunityFilter.Role, 1, DateTime.Now.ToString("MM-dd-yyyy hh:mm:ss"), opportunityFilter.Country, opportunityFilter.MaxExperienceInYears,
                            opportunityFilter.ProjectName
                        };

                        await _syncProvider.GetByQuery(connectionString, string.Format(FilterQueryBuilder.OpportunityFilter_Update, updateParameters));

                        _logger.LogInformation("SaveEmployeeOpportunityFilter: Updated existing opportunity filter with Id: {FilterId}", opportunityFilter.Id);

                        return StatusCodes.Status200OK;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in SaveEmployeeOpportunityFilter for EmployeeId: {EmployeeId}", opportunityFilter.EmployeeId);
                return StatusCodes.Status500InternalServerError;
            }
        }


        private async Task<int?> SaveNewOppotunityFilter(OpportunityFilter opportunityFilter)
        {
            try
            {
                _logger.LogInformation("FilterDAO: SaveNewOppotunityFilter");
                _logger.LogTrace("SaveNewOpportunityFilter method started for EmployeeId: {EmployeeId}", opportunityFilter.EmployeeId);

                var parameters = new object[]
                {
                    opportunityFilter.EmployeeId, opportunityFilter.MinExperienceInYears, opportunityFilter.PrimarySkills,
                    opportunityFilter.Location, opportunityFilter.Role, 1, DateTime.Now.ToString("MM-dd-yyyy hh:mm:ss"), opportunityFilter.Country, opportunityFilter.MaxExperienceInYears,
                    opportunityFilter.ProjectName
                };

                await _syncProvider.GetByQuery(connectionString, string.Format(FilterQueryBuilder.OpportunityFilter_Save, parameters));

                _logger.LogTrace("SaveNewOpportunityFilter method completed successfully for EmployeeId: {EmployeeId}", opportunityFilter.EmployeeId);

                return StatusCodes.Status200OK;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in SaveNewOpportunityFilter for EmployeeId: {EmployeeId}", opportunityFilter.EmployeeId);
                throw;
            }
        }

        public async Task<List<ProjectDetails>> GetProjectsDetailsOfActiveRRs()
        {
            _logger.LogInformation("FilterDAO: GetProjectsDetailsOfActiveRRs started.");
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var projectDetails = await _syncProvider.GetByStoredProcedure(connectionString, FilterQueryBuilder.GET_ACTIVE_RRS_PROJECT_DETAILS, new List<QueryParameters>());
                var projectDetailsList = FilterMapper.MapProjectDetails(projectDetails);
                _logger.LogInformation("FilterDAO: GetProjectsDetailsOfActiveRRs completed successfully.");

                return projectDetailsList;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred in GetProjectsDetailsOfActiveRRs: {ex}");
                throw;
            }
        }
    }
}

using Bridge.API.DAO.Mappers;
using Bridge.API.DAO.QueryBuilder;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Interfaces;
using System.Data;

namespace Bridge.API.DAO
{
    public class ResourceRequestDAO : IResourceRequestDAO
    {
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private static string connectionString;
        private readonly ILogger<ResourceRequestDAO> _logger;

        public ResourceRequestDAO(IConfiguration configuration, ISyncProvider syncProvider, ILogger<ResourceRequestDAO> logger)
        {
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
        }
        public async Task<ResourceRequestDetails> GetResourceRequestDetails(int resourceRequestId)
        {
            try
            {
                _logger.LogInformation("ResourceRequestDAO: GetResourceRequestDetails");
                _logger.LogInformation("GetResourceRequestDetails method started for ResourceRequestId: {ResourceRequestId}", resourceRequestId);
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@ResourceRequestId",
                        Value = resourceRequestId.ToString(),
                        ValueType = DbType.Int16,
                        ValueDirection = ParameterDirection.Input
                    }
                };

                var resourceRequestDetailsdataTable = await _syncProvider.GetByStoredProcedure(connectionString, ResourceRequestQueryBuilder.GET_RESOURCEREQUEST_DETAILS_BYID, sqlParameters);

                if (resourceRequestDetailsdataTable == null || resourceRequestDetailsdataTable.Rows.Count == 0)
                {
                    _logger.LogInformation("GetResourceRequestDetails: No records found for ResourceRequestId: {ResourceRequestId}", resourceRequestId);

                }
                _logger.LogInformation("GetResourceRequestDetails method completed successfully for ResourceRequestId: {ResourceRequestId}", resourceRequestId);
                return ResourceRequestMapper.MapResourceRequestDetails(resourceRequestDetailsdataTable);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetResourceRequestDetails for ResourceRequestId: {ResourceRequestId}", resourceRequestId);
                throw;

            }
        }
        public async Task<List<ResourceRequest>> GetActiveResourceRequestsForManager(string managerId)
        {
            try
            {
                _logger.LogInformation("ResourceRequestDAO: GetActiveResourceRequestsForManager");
                _logger.LogTrace("GetActiveResourceRequestsForManager method started for ManagerId: {ManagerId}", managerId);
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var parameters = new List<object>()
                {
                    managerId
                };
                var sqlParameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@managerid",
                        Value = managerId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                };

                var activeResourceRequestDetailsdataTable = await _syncProvider.GetByStoredProcedure(connectionString, ResourceRequestQueryBuilder.USP_GET_ACTIVE_OR_ALLRESOURCE_REQUESTSFORMANAGERBY_MANAGERID, sqlParameters);

                if (activeResourceRequestDetailsdataTable == null || activeResourceRequestDetailsdataTable.Rows.Count == 0)
                {
                    _logger.LogTrace("GetActiveResourceRequestsForManager: No records found for ManagerId: {ManagerId}", managerId);

                }
                _logger.LogTrace("GetActiveResourceRequestsForManager method completed successfully for ManagerId: {ManagerId}", managerId);

                return ResourceRequestMapper.MapActiveResourceRequestForManager(activeResourceRequestDetailsdataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetActiveResourceRequestsForManager for ManagerId: {ManagerId}", managerId);
                throw;
            }
        }

        public async Task<List<ResourceRequest>> GetEmployeeOpportunitiesOnFilter(string country, string[] formattedLocation, int minExperience, int maxExperience, string[] skills, List<int> resourceRequestIdsEmployeeApplied, string[] designations, string[] projectNames, Employee employee, string employeeId, bool isFilterApplied = false)
        {
            try
            {
                _logger.LogInformation("ResourceRequestDAO: GetEmployeeOpportunitiesOnFilter");
                _logger.LogInformation("GetEmployeeOpportunitiesOnFilter method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var parameters = new List<object>()
                {
                    formattedLocation,
                    minExperience,
                    string.Join(",", resourceRequestIdsEmployeeApplied),
                    country,
                    maxExperience
                };
                var employeeOpportunitiesOnFilterdataTable = await _syncProvider.GetByQuery(connectionString,
                   ResourceRequestQueryBuilder.ResourceRequestFilterQueryBuilder(parameters, skills, designations, projectNames, employeeId, isFilterApplied));

                if (employeeOpportunitiesOnFilterdataTable == null || employeeOpportunitiesOnFilterdataTable.Rows.Count == 0)
                {
                    _logger.LogInformation("GetEmployeeOpportunitiesOnFilter: No records found for the given parameters");

                }

                _logger.LogInformation("GetEmployeeOpportunitiesOnFilter method completed successfully");

                return ResourceRequestMapper.MapEmployeeOpportunitiesOnFilterdata(employeeOpportunitiesOnFilterdataTable, employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeOpportunitiesOnFilter");
                throw;
            }
        }
        public async Task<List<ResourceRequest>> GetResourceRequestsSearchData(string employeeId)
        {
            try
            {
                _logger.LogInformation("ResourceRequestDAO: GetResourceRequestsSearchData method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                List<int> earMarkedResourceRequestIds = await ListOfEarMarkedResourceRequestIds();

                var parameters = new List<object>()
                {
                    string.Join(",", earMarkedResourceRequestIds),
                };

                var resourceRequestDetailsdataTable = await _syncProvider.GetByQuery(connectionString,
                  ResourceRequestQueryBuilder.EarMarkedRRFilterQueryBuilder(parameters, employeeId));

                _logger.LogInformation("GetResourceRequestsSearchData method completed successfully");

                return ResourceRequestMapper.MapActiveResourceRequestForManager(resourceRequestDetailsdataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetResourceRequestsSearchData");
                throw;
            }
        }

        public async Task<Dictionary<int, int>> GetAppliedCountForAllResourceRequests(List<int> rridList)
        {
            try
            {
                _logger.LogInformation("ResourceRequestDAO: GetAppliedCountForAllResourceRequests method started for ResourceRequestId");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                string rridListAsString = string.Join(",", rridList);

                var sqlParameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@RrIdList",
                        Value = rridListAsString,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                };

                var countOfAppliedResourceRequestId = await _syncProvider.GetByStoredProcedure(connectionString, ResourceRequestQueryBuilder.APPLIED_COUNT_FOR_ALL_RESOURCEREQUEST, sqlParameters);

                _logger.LogInformation("GetAppliedCountForAllResourceRequests method completed successfully for ResourceRequestId");

                return ResourceRequestMapper.MapCountOfAppliedResourceRequests(countOfAppliedResourceRequestId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetAppliedCountForAllResourceRequests");
                throw;
            }
        }

        public async Task<List<int>> GetRRIdsForEmployee(string employeeId)
        {
            try
            {
                _logger.LogInformation("ResourceRequestDAO: GetRRIdsForEmployee");
                _logger.LogTrace("GetRRIdsForEmployee method started for EmployeeId: {EmployeeId}", employeeId);
                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);
                var parameters = new List<object>()
                {
                    employeeId
                };
                var getRRIdsForEmployee = await _syncProvider.GetByQuery(connectionString,
                    ResourceRequestQueryBuilder.BuildWithParameters(ResourceRequestQueryBuilder.GET_RRIDS_FOR_EMPLOYEE, parameters));

                if (getRRIdsForEmployee == null || getRRIdsForEmployee.Rows.Count == 0)
                {
                    _logger.LogTrace("GetRRIdsForEmployee: No records found for EmployeeId: {EmployeeId}", employeeId);

                }
                _logger.LogTrace("GetRRIdsForEmployee method completed successfully for EmployeeId: {EmployeeId}", employeeId);

                return ResourceRequestMapper.MapRrIdsOfEmployee(getRRIdsForEmployee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetRRIdsForEmployee for EmployeeId: {EmployeeId}", employeeId);
                throw;
            }
        }

        public async Task<List<int>> ListOfEarMarkedResourceRequestIds()
        {
            try
            {
                _logger.LogInformation("ResourceRequestDAO: ListOfEarMarkedResourceRequestIds");
                _logger.LogInformation("ListOfEarMarkedResourceRequestIds method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);

                var earMarkedResourceRequestIdsToFilter = await _syncProvider.GetByStoredProcedure(connectionString, ResourceRequestQueryBuilder.EARMARKED_RESOURCE_REQUESTID, new List<QueryParameters>());

                _logger.LogInformation("ListOfEarMarkedResourceRequestIds method completed successfully");
                return EmployeeMapper.MapListOfResourceRequestIdsToFilter(earMarkedResourceRequestIdsToFilter);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in ListOfEarMarkedResourceRequestIds");
                throw;
            }
        }
    }
}

using Bridge.API.DAO.Mappers;
using Bridge.API.DAO.QueryBuilder;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Interfaces;
using System.Data;
using System.Text.Json;

namespace Bridge.API.DAO
{
    public class ManagerDAO : IManagerDAO
    {
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private static string connectionString;
        private readonly ILogger<ManagerDAO> _logger;

        public ManagerDAO(IConfiguration configuration, ISyncProvider syncProvider, ILogger<ManagerDAO> logger)
        {
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
        }

        public async Task<List<ManagerResources>> GetManagerResources(string employeeId)
        {
            try
            {
                _logger.LogInformation("ManagerDAO : GetManagerResources");
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                _logger.LogInformation("Fetching manager resources for employee ID: {EmployeeId}", employeeId);

                var sqlParameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@EmpeMidsID",
                        Value = employeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                };

                var resources = await _syncProvider.GetByStoredProcedure(connectionString, ManagerQueryBuilder.GET_PROJECT_RESOURCES, sqlParameters);

                _logger.LogInformation("Retrieved {ResourceCount} resources for employee ID: {EmployeeId}", resources.Rows.Count, employeeId);

                var managerResources = ManagerMapper.MapManagerResources(resources);
                return managerResources;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching manager resources for employee ID: {EmployeeId}", employeeId);
                throw;
            }
        }

        public async Task<EmployeeSummaryResponse> GetEmployeeSummary(string employeeId)
        { 
            try
            {

                _logger.LogInformation("ManagerDAO : GetEmployeeSummary");
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                _logger.LogInformation("GetEmployeeSummary for employee ID: {EmployeeId}", employeeId);

                var parameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = employeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    } 
                };
                
                _logger.LogInformation($"GetEmployeeSummary resources for employee ID: {employeeId}   datetime: {DateTime.Now}");
                var results = await _syncProvider.GetByStoredProcedure(connectionString, ManagerQueryBuilder.USP_GETEMPLOYEE_SUMMARY, parameters);

                var managerResources = ManagerMapper.GetEmployeeSummary(results);
                return managerResources;
            }
            catch (Exception ex)
            {
                
                _logger.LogError($"GetEmployeeSummary resources for employee ID: {employeeId}  datetime: {DateTime.Now} and Error :{ex}"); 
                return null;
            }
        }

        public async Task<int?> UpsertSelfSummary(SelfSummary selfSummary)
        {
            try
            {
                _logger.LogInformation("ManagerDAO : UpsertSelfSummary");
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = selfSummary.EmployeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@ManagerID",
                        Value = selfSummary.ManagerID,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@ManagerSummary",
                        Value = selfSummary.ManagerSummary,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@EmployeeSummary",
                        Value = selfSummary.EmployeeSummary,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                };

                var result = await _syncProvider.UpsertByStoredProcedure(connectionString, WFMHandlerQueryBuilder.UPSERT_SELF_SUMMARY_DEATILS, sqlParameters);
                _logger.LogInformation("Self summary upsert operation succeeded for EmployeeId: {EmployeeId}", selfSummary.EmployeeId);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during self summary upsert operation for EmployeeId: {EmployeeId}", selfSummary.EmployeeId);
                throw;
            }
        }
    }
}

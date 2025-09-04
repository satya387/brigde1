using Bridge.API.DAO.Mappers;
using Bridge.API.DAO.QueryBuilder;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Data;
using Bridge.Infrastructure.Entities.Enum;

namespace Bridge.API.DAO
{
    public class SharedDAO : ISharedDAO
    {
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private static string connectionString;
        private readonly ILogger<SharedDAO> _logger;

        public SharedDAO(IConfiguration configuration, ISyncProvider syncProvider, ILogger<SharedDAO> logger)
        {
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
        }
        public async Task<List<Skills>> GetSkills()
        {
            try
            {
                _logger.LogInformation("SharedDAO : GetSkills method started");
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@Role",
                        Value = string.Empty,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@Location",
                        Value = string.Empty,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                };

                var listOfSkills = await _syncProvider.GetByStoredProcedure(connectionString, SharedQueryBuilder.GET_ALL_SKILLS, sqlParameters);

                if (listOfSkills == null || listOfSkills.Rows.Count == 0)
                {
                    _logger.LogWarning("SharedDAO: No records found for skills");
                }

                _logger.LogInformation("Skills retrieved successfully.");

                return SharedMapper.MapListOfSkills(listOfSkills);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving skills.");
                throw;
            }
        }

        public async Task<List<Roles>> GetRoles()
        {
            try
            {
                _logger.LogInformation("SharedDAO: GetRoles method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                var roles = await _syncProvider.GetByStoredProcedure(connectionString, SharedQueryBuilder.GET_ALL_ROLES, sqlParameters);

                if (roles == null || roles.Rows.Count == 0)
                {
                    _logger.LogWarning("SharedDAO: No roles found");
                }

                _logger.LogInformation("SharedDAO: GetRoles method completed successfully");
                return SharedMapper.MapListOfRoles(roles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SharedDAO: An error occurred in GetRoles method");
                throw;
            }
        }

        public async Task<List<Country>> GetCountries()
        {
            try
            {
                _logger.LogInformation("SharedDAO: GetCountries method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@module",
                        Value = "",
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                };
                var countries = await _syncProvider.GetByStoredProcedure(connectionString, SharedQueryBuilder.GET_ALL_COUNTRIES, sqlParameters);

                if (countries == null || countries.Rows.Count == 0)
                {
                    _logger.LogWarning("SharedDAO: No countries found");
                }

                _logger.LogInformation("SharedDAO: GetCountries method completed successfully");
                return SharedMapper.MapListOfCountries(countries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SharedDAO: An error occurred in GetCountries method");
                throw;
            }
        }

        public async Task<List<City>> GetCities()
        {
            try
            {
                _logger.LogInformation("SharedDAO: GetCities method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                var cities = await _syncProvider.GetByStoredProcedure(connectionString, SharedQueryBuilder.GET_ALL_CITIES, sqlParameters);

                if (cities == null || cities.Rows.Count == 0)
                {
                    _logger.LogWarning("SharedDAO: No cities found");
                }

                _logger.LogInformation("SharedDAO: GetCities method completed successfully");
                return SharedMapper.MapListOfCities(cities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SharedDAO: An error occurred in GetCities method");
                throw;
            }
        }

        public async Task LogEmployeeOpportunity(EmployeeOpportunity employeeOpportunity)
        {
            try
            {
                _logger.LogInformation("SharedDAO: LogEmployeeOpportunity method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>() {
                    new QueryParameters
                    {
                        ValueName = "@EmployeeOpportunityId",
                        Value = employeeOpportunity.Id.ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = employeeOpportunity.EmployeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@RrId",
                        Value = employeeOpportunity.RrId.ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@StatusId",
                        Value = ((int)EmployeeOpportunityStatus.AllocationRequested).ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@AdditionalComments",
                        Value = employeeOpportunity.AdditionalComments,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@AllocationPercentage",
                       Value = employeeOpportunity.AllocationPercentage.ToString(),
                       ValueType = DbType.Int32,
                       ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@AllocationStartDate",
                       Value = employeeOpportunity.AllocationStartDate.ToString(),
                       ValueType = DbType.DateTime,
                       ValueDirection = ParameterDirection.Input
                    }
                };

                await _syncProvider.UpsertByStoredProcedure(connectionString, SharedQueryBuilder.USP_INSERTEMPLOYEEOPPORTUNITYLOG, sqlParameters);

                _logger.LogInformation("SharedDAO: LogEmployeeOpportunity method completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SharedDAO: An error occurred in LogEmployeeOpportunity method");
                throw;
            }
        }

        public async Task TrackApplicationAnalytics(ApplicationTracker applicationTracker)
        {
            try
            {
                _logger.LogInformation("SharedDAO: TrackApplicationAnalytics method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>() {
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = applicationTracker.EmployeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@EmployeeName",
                        Value = applicationTracker.EmployeeName,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@IsProfileUpdated",
                        Value = applicationTracker.IsProfileUpdated.ToString(),
                        ValueType = DbType.Boolean,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@MachineName",
                       Value = applicationTracker.MachineName,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@MachineIP",
                       Value = applicationTracker.MachineIP,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@BrowserType",
                       Value = applicationTracker.BrowserType,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@City",
                        Value = applicationTracker.City,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@Country",
                        Value = applicationTracker.Country,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@Latitude",
                        Value = applicationTracker.Latitude,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@Longitude",
                        Value = applicationTracker.Longitude,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                };

                await _syncProvider.UpsertByStoredProcedure(connectionString, SharedQueryBuilder.USP_INSERTBRIDGEAPPANALYTICS, sqlParameters);

                _logger.LogInformation("SharedDAO: TrackApplicationAnalytics method completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SharedDAO: An error occurred in TrackApplicationAnalytics method");
                throw;
            }
        }
    }
}

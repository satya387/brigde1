using Bridge.API.DAO.Mappers;
using Bridge.API.DAO.QueryBuilder;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Interfaces;
using System.Data;
using System.Text.Json;

namespace Bridge.API.DAO
{
    public class WFMHandlerDAO : IWFMHandlerDAO
    {
        private readonly ILogger<WFMHandlerDAO> _logger;
        private readonly IConfiguration _configuration;
        private static string connectionString;
        private readonly ISyncProvider _syncProvider;


        public WFMHandlerDAO(ILogger<WFMHandlerDAO> logger, IConfiguration configuration, ISyncProvider syncProvider)
        {
            _logger = logger;
            _configuration = configuration;
            _syncProvider = syncProvider;
        }

        public async Task<List<WFMDetails>> GetWFMTeamList()
        {
            _logger.LogInformation("WFMHandlerDAO: GetWFMTeamList started.");
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                var wfmTeamMembers = await _syncProvider.GetByStoredProcedure(connectionString, WFMHandlerQueryBuilder.GET_WFM_EMPLOYEES, new List<QueryParameters>());
                var wfmTeamList = WFMHandlerMapper.MapWFMDetails(wfmTeamMembers);
                _logger.LogInformation("WFMHandlerDAO: GetWFMTeamList completed successfully.");
                return wfmTeamList;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred in GetWFMTeamList: {ex}");
                throw;
            }
        }
        /// <summary>
        /// Save/Update ResourceAvailability
        /// </summary>
        /// <param name="resourceAvailability">ResourceAvailability Model to save</param>
        /// <returns>0/1</returns>
        public async Task<int?> SaveResourceAvailability(ResourceAvailability resourceAvailability)
        {
            var procedurePayloadJson = "";
            try
            {
                _logger.LogInformation("SaveResourceAvailability: Saving resource availability started.");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                List<QueryParameters> sqlParameters = SqlParameterMapper(resourceAvailability);
                procedurePayloadJson = JsonSerializer.Serialize(sqlParameters);
                var result = await _syncProvider.UpsertByStoredProcedure(connectionString, WFMHandlerQueryBuilder.UPSERT_RESOURCE_AVAILABILITY, sqlParameters);

                _logger.LogInformation($"SaveResourceAvailability: Saving resource availability completed successfully. Procedure Payload: {procedurePayloadJson}");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveResourceAvailability: Error occurred while saving resource availability. Procedure Payload: {procedurePayloadJson} Exception: {ex}");
                throw;
            }
        }
        public async Task<int> SaveResourceRequestsComments(ResourceRequestsComments resourceRequestsComments)
        {
            var procedurePayloadJson = "";
            try
            {
                _logger.LogInformation("SaveResourceRequestsComments: Saving resource availability started.");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                List<QueryParameters> sqlParameters = SqlParameterMapper(resourceRequestsComments);
                procedurePayloadJson = JsonSerializer.Serialize(sqlParameters);
                var result = await _syncProvider.UpsertByStoredProcedure(connectionString, WFMHandlerQueryBuilder.UPSERT_RESOURCEREQUESTSCOMMENTS, sqlParameters);

                _logger.LogInformation($"SaveResourceRequestsComments: Saving resource availability completed successfully. Procedure Payload: {procedurePayloadJson}");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"SaveResourceRequestsComments: Error occurred while saving resource availability. Procedure Payload: {procedurePayloadJson} Exception: {ex}");
                throw;
            }


        }

        private List<QueryParameters> SqlParameterMapper(ResourceRequestsComments resourceRequestsComments)
        {
            var sqlParameters = new List<QueryParameters>();
            {
                sqlParameters.Add(
               new QueryParameters
               {
                   ValueName = "@RRID",
                   Value = resourceRequestsComments.RRID.ToString(),
                   ValueType = DbType.Int32,
                   ValueDirection = ParameterDirection.Input
               });


                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@RRComment",
                        Value = resourceRequestsComments.RRComment,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                    );

                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@WFMCreatedBy",
                        Value = resourceRequestsComments.WFMCreatedBy,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                    );
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@WFMCreatedDate",
                    Value = resourceRequestsComments.WFMCreatedDate.HasValue ? resourceRequestsComments.WFMCreatedDate.ToString() : null,
                    ValueType = DbType.DateTime,
                    ValueDirection = ParameterDirection.Input
                }
                );

            }

            return sqlParameters;

        }

        /// <summary>
        /// SqlParameterMapper
        /// </summary>
        /// <param name="resourceAvailability">ResourceAvailability is using to pass proc to update and Insert purpose</param>
        /// <returns>List of QueryParameters</returns>
        private static List<QueryParameters> SqlParameterMapper(ResourceAvailability resourceAvailability)
        {
            var sqlParameters = new List<QueryParameters>();
            {
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@EmployeeId",
                    Value = resourceAvailability.EmployeeId,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@AvailableStatus",
                    Value = resourceAvailability.AvailableStatus,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@EffectiveTill",
                    Value = resourceAvailability.EffectiveTill.HasValue ? resourceAvailability.EffectiveTill.ToString() : null,
                    ValueType = DbType.DateTime,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@WFMSpoc",
                        Value = resourceAvailability.WFMSpoc,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                    );

                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@CreatedBy",
                        Value = resourceAvailability.EmployeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                    );
                sqlParameters.Add(
                   new QueryParameters
                   {
                       ValueName = "@ModifiedBy",
                       Value = resourceAvailability.ModifiedBy,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                   }
                   );
                sqlParameters.Add(
                  new QueryParameters
                  {
                      ValueName = "@WFMEmployeeId",
                      Value = resourceAvailability.WFMEmployeeId,
                      ValueType = DbType.String,
                      ValueDirection = ParameterDirection.Input
                  }
                  );

                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@ManagerApproveOrWithdrawDate",
                    Value = resourceAvailability.ManagerApproveOrWithdrawDate.HasValue ? resourceAvailability.ManagerApproveOrWithdrawDate.ToString() : null,
                    ValueType = DbType.DateTime,
                    ValueDirection = ParameterDirection.Input
                }
                );
                sqlParameters.Add(
               new QueryParameters
               {
                   ValueName = "@ReleaseReason",
                   Value = resourceAvailability.ReleaseReason,
                   ValueType = DbType.String,
                   ValueDirection = ParameterDirection.Input
               }
               );

                sqlParameters.Add(
               new QueryParameters
               {
                   ValueName = "@InformedEmployee",
                   Value = resourceAvailability.InformedEmployee.ToString(),
                   ValueType = DbType.String,
                   ValueDirection = ParameterDirection.Input
               }
               );

                sqlParameters.Add(
               new QueryParameters
               {
                   ValueName = "@WfmSuggestedDate",
                   Value = resourceAvailability.WfmSuggestedDate.HasValue ? resourceAvailability.WfmSuggestedDate.ToString() : null,
                   ValueType = DbType.DateTime,
                   ValueDirection = ParameterDirection.Input
               });
                sqlParameters.Add(
            new QueryParameters
            {
                ValueName = "@ManagerId",
                Value = resourceAvailability.ManagerId?.ToString(),
                ValueType = DbType.String,
                ValueDirection = ParameterDirection.Input
            });
                sqlParameters.Add(
           new QueryParameters
           {
               ValueName = "@WfmRejectComment",
               Value = resourceAvailability.WfmRejectComment?.ToString(),
               ValueType = DbType.String,
               ValueDirection = ParameterDirection.Input
           });

                sqlParameters.Add(
         new QueryParameters
         {
             ValueName = "@Comments",
             Value = resourceAvailability.Comments,
             ValueType = DbType.String,
             ValueDirection = ParameterDirection.Input
         });
            }

            return sqlParameters;
        }

        public async Task<List<LaunchpadEmployee>> GetFutureAvailableResources()
        {
            try
            {
                _logger.LogInformation("GetFutureAvailableResources: Started retrieving future available resources.");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                var futureAvailableResource = await _syncProvider.GetByStoredProcedure(connectionString, WFMHandlerQueryBuilder.USP_GET_FUTUREAVAILABLERESOURCES, new List<QueryParameters>());

                _logger.LogInformation("GetFutureAvailableResources: Completed retrieving future available resources.");

                return WFMHandlerMapper.MapFutureAvailableResources(futureAvailableResource);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetFutureAvailableResources: Error occurred while retrieving future available resources. Exception: {ex}");
                throw;
            }
        }


        public async Task<List<LaunchpadEmployee>> GetAllAvailableResources(string employeeId = "-1", string loginName = "-1")
        {
            try
            {
                _logger.LogInformation("GetAllAvailableResources: Retrieving available resources started.");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = employeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@LoginName",
                        Value = loginName,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });

                var allAvailableResourcesList = await _syncProvider.GetByStoredProcedure(connectionString, WFMHandlerQueryBuilder.GET_ALL_AVAILABLE_RESOURCES, sqlParameters);

                _logger.LogInformation("GetAllAvailableResources: Retrieving available resources completed successfully.");

                return WFMHandlerMapper.MapAllAvailableResources(allAvailableResourcesList);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetAllAvailableResources: Error occurred while retrieving available resources. Exception: {ex}");
                throw;
            }
        }

        /// <summary>
        /// GetReleased Employee
        /// </summary>
        /// <returns>ReleasedEmployeeResponse</returns>
        public async Task<List<ReleasedEmployeeResponse>> GetReleasedEmployee()
        {
            try
            {
                _logger.LogInformation("GetReleasedEmployee: Retrieving available resources started.");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                var allAvailableResourcesList = await _syncProvider.GetByStoredProcedure(connectionString, WFMHandlerQueryBuilder.USP_GETRESOURCESBY_WFM, sqlParameters);

                _logger.LogInformation("GetReleasedEmployee: Retrieving available resources completed successfully.");

                return WFMHandlerMapper.MapReleasedEmployeeResponse(allAvailableResourcesList);
            }
            catch (Exception ex)
            {
                _logger.LogError($"GetReleasedEmployee: Error occurred while retrieving available resources. Exception: {ex}");
                throw;
            }
        }

        public async Task<List<ResourceAllocationDetails>> GetResourceAllocationDetails()
        {
            try
            {
                _logger.LogInformation("WFMHandlerDAO : GetResourceAllocationDetails method started");
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                var resourceDetails = await _syncProvider.GetByStoredProcedure(connectionString, WFMHandlerQueryBuilder.GET_RESOURCE_ALLOCATIONDETAILS, new List<QueryParameters>());

                if (resourceDetails?.Rows?.Count > 0)
                {
                    _logger.LogInformation("GetResourceAllocationDetails: {count} Resources allocation found", resourceDetails.Rows.Count);
                }
                else
                {
                    _logger.LogInformation("GetResourceAllocationDetails: Resources allocation not found");
                }

                var resourceDetailsList = WFMHandlerMapper.MapResourceAllocationDetails(resourceDetails);
                _logger.LogInformation("Resource allocation details retrieved successfully");

                return resourceDetailsList;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred in GetResourceAllocationDetails: {ex}");
                return await Task.FromResult(new List<ResourceAllocationDetails>());
            }
        }
        public async Task<List<ResourceRequestsComments>> GetResourceComments(int rrID)
        {
            _logger.LogInformation("WFMHandlerDAO: GetResourceComments started.");
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@RRID",
                        Value = rrID.ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    });

                var resourceRequestsComments = await _syncProvider.GetByStoredProcedure(connectionString, WFMHandlerQueryBuilder.USP_GET_RESOURCEREQUESTSCOMMENTS, sqlParameters);
                var resourceComments = WFMHandlerMapper.MapComments(resourceRequestsComments);
                _logger.LogInformation("WFMHandlerDAO: GetResourceComments completed successfully.");
                return resourceComments;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred in GetResourceComments: {ex}");
                throw;
            }
        }

        public async Task<List<CommentsDeatils>> GetDeclinedAndDroppedComments()
        {
            _logger.LogInformation("WFMHandlerDAO: GetDeclinedAndDroppedComments started.");
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var listOfComments = await _syncProvider.GetByStoredProcedure(connectionString, WFMHandlerQueryBuilder.USP_GET_DECLINED_AND_DROPPED_COMMENTS, new List<QueryParameters>());
                var listOfDeclinedAndDroppedComments = WFMHandlerMapper.MapDeclinedAndDroppedComments(listOfComments);
                _logger.LogInformation("WFMHandlerDAO: GetDeclinedAndDroppedComments completed successfully.");
                return listOfDeclinedAndDroppedComments;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred in GetDeclinedAndDroppedComments: {ex}");
                throw;
            }
        }
        public async Task<List<DroppedApplications>> GetDroppedApplications()
        {
            _logger.LogInformation("WFMHandlerDAO: GetDroppedApplications started.");
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var listOfDroppedApplications = await _syncProvider.GetByStoredProcedure(connectionString, WFMHandlerQueryBuilder.USP_GET_DROPPED_APPLICATIONS, new List<QueryParameters>());
                var listOfDroppedApplicationsData = WFMHandlerMapper.MapDroppedApplications(listOfDroppedApplications);
                _logger.LogInformation("WFMHandlerDAO: GetDroppedApplications completed successfully.");
                return listOfDroppedApplicationsData;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred in GetDroppedApplications: {ex}");
                throw;
            }
        }
    }
}
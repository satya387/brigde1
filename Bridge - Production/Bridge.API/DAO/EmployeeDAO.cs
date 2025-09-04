using Bridge.API.DAO.Mappers;
using Bridge.API.DAO.QueryBuilder;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using System.Data;
using System.Net;
using static Bridge.Infrastructure.Utility.Utilities;

namespace Bridge.API.DAO
{
    public class EmployeeDAO : IEmployeeDAO
    {

        // get the connection string app settings
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private static string connectionString;
        private bool enableEmailCommunication;
        private string carbonCopy;
        private readonly ILogger<EmployeeDAO> _logger;
        private readonly IResourceRequestDAO _resourceRequestDAO;
        private readonly IWFMHandlerDAO _wfmHandlerDAO;
        private readonly IUtilityDAO _utilityDAO;

        public EmployeeDAO(IConfiguration configuration, ISyncProvider syncProvider, ILogger<EmployeeDAO> logger, IResourceRequestDAO resourceRequestDAO, IWFMHandlerDAO wfmHandlerDAO, IUtilityDAO utilityDAO)
        {
            _resourceRequestDAO = resourceRequestDAO;
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
            _wfmHandlerDAO = wfmHandlerDAO;
            _utilityDAO = utilityDAO;
        }

        public async Task<List<Employee>> GetEmployees(string employeeId = "-1", string loginName = "-1")
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployees");
                _logger.LogTrace("GetEmployees method started. EmployeeId: {EmployeeId}, LoginName: {LoginName}", employeeId, loginName);

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

                var employeeDataTable = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.GETEMPLOYEEDETAILS_FOR_WFM, sqlParameters);

                if (employeeDataTable == null || employeeDataTable.Rows.Count == 0)
                {
                    _logger.LogTrace("GetEmployees: No records found for the given EmployeeID: {EmployeeID}, LoginName : {LoginName}", employeeId, loginName);

                }

                _logger.LogInformation("GetEmployees method completed successfully.");

                return EmployeeMapper.MapEmployees(employeeDataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployees. EmployeeId: {EmployeeId}, LoginName: {LoginName}", employeeId, loginName);
                throw;
            }
        }

        public async Task<List<Employee>> GetLaunchpadEmployeesFromSP(string employeeId = "-1", string loginName = "-1", bool isEarmarkedRequired = false)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO : GetLaunchpadEmployeesFromSP");
                _logger.LogTrace("GetLaunchpadEmployeesFromSP method started. EmployeeId: {EmployeeId}, LoginName: {LoginName}", employeeId, loginName);

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
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@IsEarmarkedRequired",
                        Value = isEarmarkedRequired.ToString(),
                        ValueType = DbType.Boolean,
                        ValueDirection = ParameterDirection.Input
                    });

                var employeeDataTable = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.GETLAUNCHPADEMPLOYEEDETAILS_FOR_WFM, sqlParameters);

                if (employeeDataTable == null || employeeDataTable.Rows.Count == 0)
                {
                    _logger.LogTrace("GetLaunchpadEmployeesFromSP: No records found for the given EmployeeID: {EmployeeID} or LoginName : {LoginName}", employeeId, loginName);

                }

                _logger.LogInformation("GetLaunchpadEmployeesFromSP method completed successfully.");

                return EmployeeMapper.MapEmployees(employeeDataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetLaunchpadEmployeesFromSP. EmployeeId: {EmployeeId}, LoginName: {LoginName}", employeeId, loginName);
                throw;
            }
        }

        public async Task<List<Employee>> GetLaunchpadAndFutureEmployeesFromSP()
        {
            try
            {
                _logger.LogInformation("EmployeeDAO : GetLaunchpadAndFutureEmployeesFromSP");
                _logger.LogTrace("GetLaunchpadAndFutureEmployeesFromSP method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();              

                var employeeDataTable = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.GET_LAUNCHPAD_AND_FUTURE_EMPLOYEEDETAILS, sqlParameters);

                if (employeeDataTable == null || employeeDataTable.Rows.Count == 0)
                {
                    _logger.LogTrace("GetLaunchpadAndFutureEmployeesFromSP: No records found");

                }

                _logger.LogInformation("GetLaunchpadAndFutureEmployeesFromSP method completed successfully.");

                return EmployeeMapper.MapEmployees(employeeDataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetLaunchpadAndFutureEmployeesFromSP.");
                throw;
            }
        }

        public async Task InsetIntoMailNotification(MailNotification mailNotification)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: InsetIntoMailNotification method started.");

                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);

                var parameters = new object[]
                {
                    mailNotification.From, mailNotification.To, mailNotification.Cc, mailNotification.Bcc,
                    mailNotification.Subject, mailNotification.Body, mailNotification.Error, mailNotification.Status
                };

                await _syncProvider.InsertOrUpdateByQuery(connectionString, string.Format(EmployeeQueryBuilder.SAVE_MAILNOTIFICATION, parameters));

                _logger.LogInformation("InsetIntoMailNotification method completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in InsetIntoMailNotification.");
                throw;
            }
        }

        public async Task<int> SendEmailNotificationForAppliedOpportunity(ApplyOpportunityRequest applyOpportunityRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: SendEmailNotificationForAppliedOpportunity method started.");

                var employees = await GetEmployees(applyOpportunityRequest.EmployeeId);

                var employeeInfo = employees.Select(x => new { x.EmailId, x.EmployeeName }).FirstOrDefault();

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                carbonCopy = _configuration.GetValue<string>("carbonCopy") ?? string.Empty;

                var parameters = new object[]
                 {
                    applyOpportunityRequest.ResourceRequestId
                 };

                var managerIdDataTable = await _syncProvider.GetByQuery(connectionString, string.Format(EmployeeQueryBuilder.GET_MANAGERID_FROM_RRID, parameters));
                var managerId = EmployeeMapper.MapManagerId(managerIdDataTable);
                var manager = await GetEmployees(managerId);
                var managerInfo = manager.Select(x => new { x.EmailId, x.EmployeeName }).FirstOrDefault();

                string rrViewLink = _configuration["ResourceRequestViewLink"];
                string rrViewLinkWithRrId = string.Format(rrViewLink, applyOpportunityRequest.ResourceRequestId);
                string employeeMailBody = $"Dear {employeeInfo?.EmployeeName},<br /><br />" +
                                          $"Your application against <a href=\"{rrViewLinkWithRrId}\">{applyOpportunityRequest.ResourceRequestNumber}</a> has been received. The response from the concerned manager will be communicated to you. The status of your application can be tracked under Bridge -&gt; My Applied Opportunities.<br /><br />" +
                                          "Thanking You,<br />" +
                                          "WFM Team";
                string managerMailBody = $"Dear {managerInfo?.EmployeeName},<br /><br />" +
                                         $"{employeeInfo.EmployeeName} has applied to <a href=\"{rrViewLinkWithRrId}\">{applyOpportunityRequest.ResourceRequestNumber}</a>. Kindly evaluate and respond to the application on Bridge -&gt; Review Applications.<br /><br />" +
                                         "Thanking You,<br />" +
                                         "WFM Team";

                await SendMail(employeeInfo.EmailId, carbonCopy, null, $"BRIDGE: Application for opportunity {applyOpportunityRequest.ResourceRequestNumber}", employeeMailBody);

                await SendMail(managerInfo?.EmailId, carbonCopy, null, $"BRIDGE: Application for opportunity {applyOpportunityRequest.ResourceRequestNumber}", managerMailBody);

                _logger.LogInformation("SendEmailNotificationForAppliedOpportunity method completed successfully.");
                return StatusCodes.Status200OK;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in SendEmailNotificationForAppliedOpportunity.");
                throw;
            }
        }

        public async Task SendMail(string to, string cc, string bcc, string subject, string body, bool sendCalendarInvite = false, DateTime? DiscussionStartTime = null, int DiscussionDuration = 0, string OptionalAttendees = null, string location = null)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: SendMail method started.");

                enableEmailCommunication = _configuration.GetValue<bool>("EnableEmailCommunication");

                if (enableEmailCommunication)
                {
                    var isDevEnvironment = _configuration.GetValue<bool>("IsDevEnvironment");
                    var toAddressForGmailCommunication = _configuration.GetValue<string>("ToAddressForGmailCommunication");

                    if (isDevEnvironment)
                    {
                        to = toAddressForGmailCommunication;
                        cc = "";
                        bcc = "";

                        MailCredential mailCredential = new MailCredential()
                        {
                            FromUserName = _configuration["EmailCredential:From"],
                            Host = _configuration["EmailCredential:Host"],
                            Password = _configuration["EmailCredential:Password"],
                        };

                        var employeeSendMailRequest = EmployeeMapper.MapMailRequest(to, cc, bcc, subject, body, mailCredential, sendCalendarInvite, DiscussionStartTime, DiscussionDuration, OptionalAttendees, location);

                        HttpResponseMessage emaployeeMailResponse = MailService.SendMail(employeeSendMailRequest);
                        if (emaployeeMailResponse.StatusCode == HttpStatusCode.OK)
                        {
                            _logger.LogTrace("Email to EmployeeMailID {EmployeeMailID} has Succesfully sent", to);
                        }
                        else
                        {
                            _logger.LogTrace("Email to EmployeeMailID {EmployeeMailID} has not Succesfully sent", to);
                        }
                        MailNotification mailNotification = EmployeeMapper.MapMailNotificationRequest(employeeSendMailRequest, emaployeeMailResponse);
                        await InsetIntoMailNotification(mailNotification);
                    }
                    else
                    {
                        connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                        var sqlParameters = new List<QueryParameters>();

                        sqlParameters.Add(new QueryParameters
                        {
                            ValueName = "@recipients",
                            Value = to,
                            ValueType = DbType.String,
                            ValueDirection = ParameterDirection.Input
                        });
                        sqlParameters.Add(new QueryParameters
                        {
                            ValueName = "@copy_recipients",
                            Value = cc,
                            ValueType = DbType.String,
                            ValueDirection = ParameterDirection.Input
                        });
                        sqlParameters.Add(new QueryParameters
                        {
                            ValueName = "@blind_copy_recipients",
                            Value = bcc,
                            ValueType = DbType.String,
                            ValueDirection = ParameterDirection.Input
                        });

                        sqlParameters.Add(new QueryParameters
                        {
                            ValueName = "@subject",
                            Value = subject,
                            ValueType = DbType.String,
                            ValueDirection = ParameterDirection.Input
                        });
                        sqlParameters.Add(new QueryParameters
                        {
                            ValueName = "@body",
                            Value = body,
                            ValueType = DbType.String,
                            ValueDirection = ParameterDirection.Input
                        });
                        sqlParameters.Add(new QueryParameters
                        {
                            ValueName = "@body_format ",
                            Value = "HTML",
                            ValueType = DbType.String,
                            ValueDirection = ParameterDirection.Input
                        });
                        await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.SEND_MAIL, sqlParameters);
                    }
                }

                _logger.LogInformation("SendMail method completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in SendMail.");
                throw;
            }
        }

        public async Task<int?> ApplyOpportunity(ApplyOpportunityRequest applyOpportunityRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: ApplyOpportunity method started.");

                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);

                var parameters = new object[]
                 {
                    applyOpportunityRequest.EmployeeId, applyOpportunityRequest.ResourceRequestId
                 };

                var dataExist = await _syncProvider.GetByQuery(connectionString, string.Format(EmployeeQueryBuilder.APPLYOPPORTUNITY_EXIST, parameters));

                var opportunityIdStatus = EmployeeMapper.MapAppliedOpportunityId(dataExist);

                if (opportunityIdStatus.id != 0 && opportunityIdStatus.status == EmployeeOpportunityStatus.Active.ToString())
                {
                    _logger.LogInformation("Opportunity already applied and is in Active status. Returning StatusCodes.Status409Conflict.");
                    return StatusCodes.Status409Conflict;
                }

                if (opportunityIdStatus.id != 0 && opportunityIdStatus.status == EmployeeOpportunityStatus.Scheduled.ToString())
                {
                    _logger.LogInformation("Opportunity already applied and is in Scheduled status. Returning StatusCodes.Status208AlreadyReported.");
                    return StatusCodes.Status208AlreadyReported;
                }

                int rowsAffected = 0;

                if (opportunityIdStatus.id == 0)
                {
                    var insertParameters = new List<QueryParameters>() {
                        new QueryParameters
                        {
                            ValueName = "@EMPLOYEEID",
                            Value = applyOpportunityRequest.EmployeeId.ToString(),
                            ValueType = DbType.String,
                            ValueDirection = ParameterDirection.Input
                        },
                        new QueryParameters
                        {
                            ValueName = "@RRID",
                            Value = applyOpportunityRequest.ResourceRequestId.ToString(),
                            ValueType = DbType.Int32,
                            ValueDirection = ParameterDirection.Input
                        },
                        new QueryParameters
                        {
                            ValueName = "@STATUSID",
                            Value = ((int)EmployeeOpportunityStatus.Active).ToString(),
                            ValueType = DbType.Int32,
                            ValueDirection = ParameterDirection.Input
                        },
                        new QueryParameters
                        {
                            ValueName = "@CREATEDBY",
                            Value = applyOpportunityRequest.CreatedBy,
                            ValueType = DbType.String,
                            ValueDirection = ParameterDirection.Input
                        }
                    };

                    rowsAffected = await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.USP_INSERT_EMPLOYEEOPPORTUNITY_ACTIVE, insertParameters);
                }
                else
                {
                    var updateParameters = new List<QueryParameters>() {
                        new QueryParameters
                        {
                            ValueName = "@ID",
                            Value = opportunityIdStatus.id.ToString(),
                            ValueType = DbType.Int32,
                            ValueDirection = ParameterDirection.Input
                        },
                        new QueryParameters
                        {
                            ValueName = "@STATUSID",
                            Value = ((int)EmployeeOpportunityStatus.Active).ToString(),
                            ValueType = DbType.Int32,
                            ValueDirection = ParameterDirection.Input
                        },
                    };

                    rowsAffected = await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.USP_UPDATE_EMPLOYEEOPPORTUNITY_ACTIVE, updateParameters);
                }

                if (rowsAffected > 0)
                {
                    _logger.LogInformation("ApplyOpportunity method completed successfully. Returning StatusCodes.Status200OK.");
                    return StatusCodes.Status200OK;
                }
                else
                {
                    _logger.LogInformation("ApplyOpportunity method failed. Returning StatusCodes.Status500InternalServerError.");
                    return StatusCodes.Status500InternalServerError;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in ApplyOpportunity.");
                return StatusCodes.Status500InternalServerError;
            }
        }

        public async Task<List<AppliedOpportunity>> GetSelfAppliedOpportunities(List<EmployeeOpportunity> selfAppliedRrs, string employeeId )
        {
            try
            {
                _logger.LogInformation("GetSelfAppliedOpportunities method started.");

                var arcConnectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                var rrDetailsDataTable = await _syncProvider.GetByQuery(arcConnectionString, string.Format(EmployeeQueryBuilder.APPLIEDOPPOTUNITIES_GETRRDETAILS, string.Join(",", selfAppliedRrs.Select(x => x.RrId).ToList()), employeeId));

                if (rrDetailsDataTable == null || rrDetailsDataTable.Rows.Count == 0)
                {
                    _logger.LogInformation("GetSelfAppliedOpportunities: No records found");

                }

                _logger.LogInformation("GetSelfAppliedOpportunities method completed successfully.");

                return EmployeeMapper.MapAppliedOpportunities(rrDetailsDataTable, selfAppliedRrs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetSelfAppliedOpportunities.");
                throw;
            }
        }

        public async Task<List<EmployeeOpportunity>> GetAppliedOpportunitiesRrIdsAndStatus(string employeeId)
        {
            try
            {
                _logger.LogInformation("GetAppliedOpportunitiesRrIdsAndStatus method started.");

                var marketplaceConnectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);

                var employeeResourceRequests = await _syncProvider.GetByQuery(marketplaceConnectionString, string.Format(EmployeeQueryBuilder.APPLIEDOPPORTUNITIES_GET_RRIDS_AND_STATUS, employeeId));

                if (employeeResourceRequests == null || employeeResourceRequests.Rows.Count == 0)
                {
                    _logger.LogInformation("GetAppliedOpportunitiesRrIdsAndStatus: No records found");

                }

                _logger.LogInformation("GetAppliedOpportunitiesRrIdsAndStatus method completed successfully.");

                return EmployeeMapper.MapAppliedRrIds(employeeResourceRequests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetAppliedOpportunitiesRrIdsAndStatus.");
                throw;
            }
        }

        public async Task<List<LaunchpadEmployee>> GetLaunchpadEmployees()
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetLaunchpadEmployees method started.");

                var employees = await GetLaunchpadEmployeesFromSP();

                if (employees == null || employees.Count == 0)
                {
                    _logger.LogInformation("No records found in launchpad employees list.");
                    return null;
                }

                _logger.LogInformation("GetLaunchpadEmployees method completed successfully.");

                return EmployeeMapper.MapLaunchpadEmployees(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetLaunchpadEmployees.");
                throw;
            }
        }

        public async Task<List<EmployeeOpportunity>> GetEmployeeRrIdForAppliedRrs(List<ResourceRequest> resourceRequests)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployeeRrIdForAppliedRrs method started.");

                var marketplaceConnectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);
                var resourceRequestIds = resourceRequests.Select(x => x.RRId).ToList();

                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@RRID",
                        Value = string.Join(",", resourceRequestIds),
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }); 

                var employeeRrIds = await _syncProvider.GetByStoredProcedure(marketplaceConnectionString, EmployeeQueryBuilder.USP_GET_EmployeeOpportunity_BY_RRIds, sqlParameters);

      
                if (employeeRrIds == null || employeeRrIds.Rows.Count == 0)
                {
                    _logger.LogInformation("GetEmployeeRrIdForAppliedRrs: No records found");
                }

                _logger.LogInformation("GetEmployeeRrIdForAppliedRrs method completed successfully.");

                return EmployeeMapper.MapEmployeeRrIds(employeeRrIds);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeRrIdForAppliedRrs.");
                throw;
            }
        }

        public async Task<List<AppliedOpportunity>> GetEmployeeDetailsFromEmployeeIds(List<EmployeeOpportunity> employeeRrIds, List<EmployeeProject> employeeProjectDetails)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployeeDetailsFromEmployeeIds method started.");

                var employees = await GetLaunchpadAndFutureEmployeesFromSP();

                var filteredEmployees = employees.Where(e => e.Status == "Available" || e.Status == "Earmarked" || e.Status == "Released").ToList();


                var filteredEmpRRids = new List<EmployeeOpportunity>();

                foreach (var employeeRrId in employeeRrIds)
                {
                    if (!filteredEmpRRids.Any(a => a.EmployeeId == employeeRrId.EmployeeId && a.Status == "Earmarked"))
                    {
                        filteredEmpRRids.Add(employeeRrId);
                    }

                }

                if (employees == null || employees.Count == 0)
                {
                    _logger.LogWarning("No Records found in GetEmployeeDetailsFromEmployeeIds.");
                    return null;
                }

                _logger.LogInformation("GetEmployeeDetailsFromEmployeeIds method completed successfully.");
                int resourceRequestId = employeeRrIds.FirstOrDefault()?.RrId ?? 0;
                var resourceRequestDetails = await _resourceRequestDAO.GetResourceRequestDetails(resourceRequestId);
                return EmployeeMapper.MapEmployeeFromEmployeeIds(filteredEmployees, filteredEmpRRids, resourceRequestDetails, employeeProjectDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeDetailsFromEmployeeIds.");
                throw;
            }
        }

        public List<ApplicationReviewResponse> GetEmployeeAppliedOpportunitiesForManager(List<ResourceRequest> resourceRequests, List<AppliedOpportunity> employeeDetailsWithRrId)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployeeAppliedOpportunitiesForManager method started.");

                var mappedOpportunities = EmployeeMapper.MapEmployeeWithResourceRequests(resourceRequests, employeeDetailsWithRrId);

                if (mappedOpportunities == null || mappedOpportunities.Count == 0)
                {
                    _logger.LogInformation("GetEmployeeAppliedOpportunitiesForManager: No records found");

                }

                _logger.LogInformation("GetEmployeeAppliedOpportunitiesForManager method completed successfully.");

                return mappedOpportunities;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeAppliedOpportunitiesForManager.");
                throw;
            }
        }

        public async Task<int> GetAppliedEmployeesCountForResourceRequest(int resourceRequestId)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetAppliedEmployeesCountForResourceRequest method started for ResourceRequestId: {ResourceRequestId}", resourceRequestId);

                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);
                var parameters = new List<object>()
                {
                    resourceRequestId
                };
                var countOfAppliedResourceRequestId = await _syncProvider.GetByQuery(connectionString,
                   EmployeeQueryBuilder.BuildWithParameters(EmployeeQueryBuilder.EMPLOYEESCOUNT_APPLIED_FOR_RESOURCEREQUEST, parameters));

                _logger.LogInformation("GetAppliedEmployeesCountForResourceRequest method completed successfully for ResourceRequestId: {ResourceRequestId}", resourceRequestId);
                return EmployeeMapper.MapCountOfAppliedResourceRequest(countOfAppliedResourceRequestId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetAppliedEmployeesCountForResourceRequest for ResourceRequestId: {ResourceRequestId}", resourceRequestId);
                throw;
            }
        }

        public async Task<OpportunityFilter> EmployeeOpportunitySearchCriteria(string employeeId)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: EmployeeOpportunitySearchCriteria");
                _logger.LogTrace("EmployeeOpportunitySearchCriteria method started for EmployeeId: {EmployeeId}", employeeId);

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var parameters = new List<object>()
                {
                    employeeId
                };
                var employeeOpportunitySearchCriteriaData = await _syncProvider.GetByQuery(connectionString,
                   EmployeeQueryBuilder.BuildWithParameters(EmployeeQueryBuilder.EMPLOYEE_OPPORTUNITY_SEARCH_CRITERIA, parameters));

                if (employeeOpportunitySearchCriteriaData == null || employeeOpportunitySearchCriteriaData.Rows.Count == 0)
                {
                    _logger.LogTrace("EmployeeOpportunitySearchCriteria: No records found for EmployeeID: {EmployeeID}", employeeId);

                }
                _logger.LogTrace("EmployeeOpportunitySearchCriteria method completed successfully for EmployeeId: {EmployeeId}", employeeId);
                return EmployeeMapper.MapEmployeeOpportunitySearchCriteriaData(employeeOpportunitySearchCriteriaData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in EmployeeOpportunitySearchCriteria for EmployeeId: {EmployeeId}", employeeId);
                throw;
            }
        }

        public async Task<List<int>> ListOfResourceRequestIds(string employeeID)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: ListOfResourceRequestIds");
                _logger.LogTrace("ListOfResourceRequestIds method started for EmployeeID: {EmployeeID}", employeeID);

                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);

                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = employeeID,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });

                var ListOfResourceRequestIdsToFilter = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.RESOURCE_REQUESTID_EMPLOYEE_ALREADY_APPLIED, sqlParameters);

                _logger.LogTrace("ListOfResourceRequestIds method completed successfully for EmployeeID: {EmployeeID}", employeeID);
                return EmployeeMapper.MapListOfResourceRequestIdsToFilter(ListOfResourceRequestIdsToFilter);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in ListOfResourceRequestIds for EmployeeID: {EmployeeID}", employeeID);
                throw;
            }
        }

        public async Task<int?> WithdrawAppliedOpportunity(WithdrawOpportunityRequest withdrawOpportunityRequest, bool isDisapprovedByManager)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO:WithdrawAppliedOpportunity");
                _logger.LogTrace("WithdrawAppliedOpportunity method started for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);

                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);

                var parameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@EMPLOYEEID",
                        Value = withdrawOpportunityRequest.EmployeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@RRID",
                        Value = withdrawOpportunityRequest.ResourceRequestId.ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@DISAPPROVEDBY",
                        Value = withdrawOpportunityRequest.DisapprovedBy,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@COMMENTS",
                       Value = withdrawOpportunityRequest.ReasonForDisapprove,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@STATUSID",
                        Value = (isDisapprovedByManager && withdrawOpportunityRequest.IsMeetingHappened ? (int)EmployeeOpportunityStatus.Dropped : isDisapprovedByManager ?
                        (int)EmployeeOpportunityStatus.Declined : (int)EmployeeOpportunityStatus.Withdrawn).ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@ADDITIONALCOMMENTS",
                       Value = withdrawOpportunityRequest.AdditionalComments,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                    }
                };

                int rowsAffected = await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.USP_UPDATE_EMPLOYEEOPPORTUNITY_WITHDRAW, parameters);

                if (rowsAffected > 0)
                {
                    if (isDisapprovedByManager)
                    {
                        await SendDisapproveOpportunityMail(withdrawOpportunityRequest);
                        _logger.LogTrace("DisapproveOpportunityMail sent for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                    }
                    else
                    {
                        await SendWithdrawnOpportunityMail(withdrawOpportunityRequest);
                        _logger.LogTrace("WithdrawnOpportunityMail sent for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                    }
                    _logger.LogTrace("WithdrawAppliedOpportunity method completed successfully for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                    return StatusCodes.Status200OK;
                }
                else
                {
                    _logger.LogWarning("WithdrawAppliedOpportunity method found no rows affected for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                    return StatusCodes.Status404NotFound;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in WithdrawAppliedOpportunity for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                return StatusCodes.Status500InternalServerError;
            }
        }

        public async Task<int?> ApproveAppliedOpportunity(EmployeeOpportunity employeeOpportunity)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO:ApproveAppliedOpportunity");
                _logger.LogTrace("ApproveAppliedOpportunity method started for EmployeeID: {EmployeeID}, ResourceRequestID: {RrId}", employeeOpportunity.EmployeeId, employeeOpportunity.RrId);

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>
                {
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
                        Value = employeeOpportunity.Status == UtilityConstant.AllocationRequested ? ((int)EmployeeOpportunityStatus.AllocationRequested).ToString() : employeeOpportunity.Status == UtilityConstant.Earmarked ? ((int)EmployeeOpportunityStatus.Earmarked).ToString() : "",
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
                    },
                    new QueryParameters
                    {
                       ValueName = "@WfmAllocationPercentage",
                       Value = employeeOpportunity.WfmAllocationPercentage.HasValue? employeeOpportunity.WfmAllocationPercentage.ToString() : null,
                       ValueType = DbType.Int32,
                       ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@WfmAllocationStartDate",
                       Value = employeeOpportunity.WfmAllocationStartDate.HasValue ? employeeOpportunity.WfmAllocationStartDate.ToString() : null,
                       ValueType = DbType.DateTime,
                       ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@RequesterID",
                       Value = employeeOpportunity.RequesterID.ToString(),
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                    },
                     new QueryParameters
                    {
                       ValueName = "@IsRampUpProject",
                       Value = employeeOpportunity.IsRampUpProject.ToString(),
                       ValueType = DbType.Boolean,
                       ValueDirection = ParameterDirection.Input
                    }
                };
                
                int rowsAffected = await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.APPROVE_APPLIED_OPPORTUNITY, sqlParameters);
                if (rowsAffected > 0)
                {
                    _logger.LogTrace("ApproveAppliedOpportunity method completed successfully for EmployeeID: {EmployeeID}, ResourceRequestID: {RrId}", employeeOpportunity.EmployeeId, employeeOpportunity.RrId);
                    return StatusCodes.Status200OK;
                }
                else
                {
                    _logger.LogWarning("ApproveAppliedOpportunity method found no rows affected for EmployeeID: {EmployeeID}, ResourceRequestID: {RrId}", employeeOpportunity.EmployeeId, employeeOpportunity.RrId);
                    return StatusCodes.Status404NotFound;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in ApproveAppliedOpportunity for EmployeeID: {EmployeeID}, ResourceRequestID: {RrId}", employeeOpportunity.EmployeeId, employeeOpportunity.RrId);
                return StatusCodes.Status500InternalServerError;
            }
        }

        private async Task SendWithdrawnOpportunityMail(WithdrawOpportunityRequest withdrawOpportunityRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: SendWithdrawnOpportunityMail");
                _logger.LogTrace("SendWithdrawnOpportunityMail method started for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);

                var employee = await GetEmployees(withdrawOpportunityRequest.EmployeeId);
                var employeeInfo = employee.Select(x => new { x.EmailId, x.EmployeeName }).FirstOrDefault();
                carbonCopy = _configuration.GetValue<string>("carbonCopy") ?? string.Empty;

                var parameters = new object[]
                {
                    withdrawOpportunityRequest.ResourceRequestId
                };
                var managerIdDataTable = await _syncProvider.GetByQuery(connectionString, string.Format(EmployeeQueryBuilder.GET_MANAGERID_FROM_RRID, parameters));
                var managerId = EmployeeMapper.MapManagerId(managerIdDataTable);
                var manager = await GetEmployees(managerId);
                var managerInfo = manager.Select(x => new { x.EmailId, x.EmployeeName }).FirstOrDefault();

                string rrViewLink = _configuration["ResourceRequestViewLink"];
                string rrViewLinkWithRrId = string.Format(rrViewLink, withdrawOpportunityRequest.ResourceRequestId);

                string employeeMailBody = $"Dear {employeeInfo?.EmployeeName},<br /><br />" +
                                          $"You have withdrawn your application against <a href =\"{rrViewLinkWithRrId}\">{withdrawOpportunityRequest.ResourceRequestNumber}</a>. Should you wish to reapply for the same position, you can do so on Bridge -> My Applied Opportunities.<br /><br />" +
                                          "Thanking You,<br />" +
                                          "WFM Team";

                string managerMailBody = $"Dear {managerInfo?.EmployeeName},<br /><br />" +
                                         $"{employeeInfo?.EmployeeName} has rescinded their application against <a href =\"{rrViewLinkWithRrId}\">{withdrawOpportunityRequest.ResourceRequestNumber}</a>. This is an informational email and no action is needed at your end.<br /><br />" +
                                         "Thanking You,<br />" +
                                         "WFM Team";

                await SendMail(employeeInfo?.EmailId, carbonCopy, null, $"BRIDGE: Application withdrawn for opportunity {withdrawOpportunityRequest.ResourceRequestNumber}", employeeMailBody);

                await SendMail(managerInfo?.EmailId, carbonCopy, null, $"BRIDGE: Application withdrawn for opportunity {withdrawOpportunityRequest.ResourceRequestNumber}", managerMailBody);

                _logger.LogTrace("SendWithdrawnOpportunityMail method completed successfully for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in SendWithdrawnOpportunityMail for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                throw;
            }
        }

        private async Task SendDisapproveOpportunityMail(WithdrawOpportunityRequest withdrawOpportunityRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO : SendDisapproveOpportunityMail");
                _logger.LogTrace("SendDisapproveOpportunityMail method started for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);

                var employee = await GetEmployees(withdrawOpportunityRequest.EmployeeId);
                var employeeInfo = employee.Select(x => new { x.EmailId, x.EmployeeName }).FirstOrDefault();
                carbonCopy = _configuration.GetValue<string>("carbonCopy") ?? string.Empty;

                var parameters = new object[]
                {
                    withdrawOpportunityRequest.ResourceRequestId
                };
                var managerIdDataTable = await _syncProvider.GetByQuery(connectionString, string.Format(EmployeeQueryBuilder.GET_MANAGERID_FROM_RRID, parameters));
                var managerId = EmployeeMapper.MapManagerId(managerIdDataTable);
                var manager = await GetEmployees(managerId);
                var managerInfo = manager.Select(x => new { x.EmailId, x.EmployeeName }).FirstOrDefault();

                string rrViewLink = _configuration["ResourceRequestViewLink"];
                string rrViewLinkWithRrId = string.Format(rrViewLink, withdrawOpportunityRequest.ResourceRequestId);

                string employeeMailBody = $"Dear {employeeInfo?.EmployeeName},<br /><br />" +
                                          $"Your application against <a href =\"{rrViewLinkWithRrId}\">{withdrawOpportunityRequest.ResourceRequestNumber}</a> has been regretfully declined by the concerned manager on account of {withdrawOpportunityRequest.ReasonForDisapprove}. Should you wish " +
                                          $"to reapply for the same position post corrective measures, you can do so on Bridge -> My Applied Opportunities.<br /><br />" +
                                          "Thanking You,<br />" +
                                          "WFM Team";

                string managerMailBody = $"Dear {managerInfo?.EmployeeName},<br /><br />" +
                                         $"You have declined the application of {employeeInfo?.EmployeeName} for <a href =\"{rrViewLinkWithRrId}\">{withdrawOpportunityRequest.ResourceRequestNumber}</a>. Should you wish to reconsider the application, you can do so on Bridge -> Review Applications.<br /><br />" +
                                         "Thanking You,<br />" +
                                         "WFM Team";

                await SendMail(employeeInfo?.EmailId, carbonCopy, null, $"BRIDGE: Application declined for opportunity {withdrawOpportunityRequest.ResourceRequestNumber}", employeeMailBody);

                await SendMail(managerInfo?.EmailId, carbonCopy, null, $"BRIDGE: Application declined for opportunity {withdrawOpportunityRequest.ResourceRequestNumber}", managerMailBody);

                _logger.LogTrace("SendDisapproveOpportunityMail method completed successfully for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in SendDisapproveOpportunityMail for EmployeeID: {EmployeeID}, ResourceRequestID: {ResourceRequestID}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                throw;
            }
        }

        public async Task<List<EmployeeSkillMatrix>> GetAllEmployeesSkillMatrix(string employeeId = "-1")
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetAllEmployeesSkillMatrix");
                _logger.LogTrace("GetAllEmployeesSkillMatrix method started for EmployeeID: {EmployeeID}", employeeId);

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

                var employeesSkillMatrix = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.GET_ALL_EMPLOYEES_SKILL_MATRIX, sqlParameters);

                if (employeesSkillMatrix == null || employeesSkillMatrix.Rows.Count == 0)
                {
                    _logger.LogTrace("GetAllEmployeesSkillMatrix: No Skill records found for the given EmployeeID: {EmployeeID}", employeeId);

                }

                _logger.LogTrace("GetAllEmployeesSkillMatrix method completed successfully for EmployeeID: {EmployeeID}", employeeId);

                return EmployeeMapper.MapEmployeeSkillMatrix(employeesSkillMatrix);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetAllEmployeesSkillMatrix for EmployeeID: {EmployeeID}", employeeId);
                throw;
            }
        }

        public async Task<EmployeeSkillMatrix> GetEmployeeSpecificSkillMatrix(string employeeId)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployeeSpecificSkillMatrix");
                _logger.LogTrace("GetEmployeeSpecificSkillMatrix method started for EmployeeID: {EmployeeID}", employeeId);

                var employeeSkillMatrices = await GetAllEmployeesSkillMatrix(employeeId);

                _logger.LogTrace("GetEmployeeSpecificSkillMatrix method completed successfully for EmployeeID: {EmployeeID}", employeeId);

                return EmployeeMapper.MapEmployeeSpecificSkillMatrix(employeeSkillMatrices, employeeId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeSpecificSkillMatrix for EmployeeID: {EmployeeID}", employeeId);
                throw;
            }
        }

        public async Task<List<EmployeeProject>> GetEmidsProjects(string employeeId, string searchText)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmidsProjects");
                _logger.LogTrace("GetEmidsProjects method started for EmployeeID: {EmployeeID}, SearchText: {SearchText}", employeeId, searchText);

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EmpEmidsID",
                        Value = employeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@SearchText",
                        Value = searchText,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });

                var employeeEmidsProjects = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.GET_EMPLOYEE_ASSIGNMENTS, sqlParameters);

                _logger.LogTrace("GetEmidsProjects method completed successfully for EmployeeID: {EmployeeID}, SearchText: {SearchText}", employeeId, searchText);

                return EmployeeMapper.MapEmidsProjects(employeeEmidsProjects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmidsProjects for EmployeeID: {EmployeeID}, SearchText: {SearchText}", employeeId, searchText);
                throw;
            }
        }

        public async Task<Employee> GetEmployeeSpecificDetails(string employeeId)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployeeSpecificDetails");
                _logger.LogTrace("GetEmployeeSpecificDetails method started for EmployeeID: {EmployeeID}", employeeId);

                var employee = await GetEmployees(employeeId);

                if (employee == null)
                {
                    _logger.LogTrace("Records not found for EmployeeID: {EmployeeID}", employeeId);
                    return null;
                }

                _logger.LogTrace("GetEmployeeSpecificDetails method completed successfully for EmployeeID: {EmployeeID}", employeeId);

                return employee.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeSpecificDetails for EmployeeID: {EmployeeID}", employeeId);
                throw;
            }
        }

        public async Task<Employee> GetEmployeeProfileDetails(Employee employeeDetail, List<EmployeeProject> emidsProjects, EmployeeSkillMatrix employeeSkillMatrix, List<EmployeeAssignment> previousOrgAssignments)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployeeProfileDetails");
                _logger.LogTrace("GetEmployeeProfileDetails method started for Employee: {EmployeeID}", employeeDetail.EmidsUniqueId);
                return EmployeeMapper.MapEmployeeProfile(employeeDetail, emidsProjects, employeeSkillMatrix, previousOrgAssignments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeProfileDetails for Employee: {EmployeeID}", employeeDetail.EmidsUniqueId);
                throw;
            }
        }

        public async Task<int?> InitiateDiscussion(InitiateDiscussionRequest initiateDiscussionRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: InitiateDiscussion");
                _logger.LogTrace("InitiateDiscussion method started for Employee: {EmployeeID} and RRID: {RRID}", initiateDiscussionRequest.EmployeeId, initiateDiscussionRequest.RrId);

                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);

                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = initiateDiscussionRequest.EmployeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@RrId",
                        Value = initiateDiscussionRequest.RrId.ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    });
                sqlParameters.Add(
                   new QueryParameters
                   {
                       ValueName = "@Status",
                       Value = !string.IsNullOrEmpty(initiateDiscussionRequest.Status) ? Enum.Parse(typeof(EmployeeOpportunityStatus), initiateDiscussionRequest.Status).ToString() 
                                : EmployeeOpportunityStatus.Active.ToString(),
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                   });
                sqlParameters.Add(
                   new QueryParameters
                   {
                       ValueName = "@Comments",
                       Value = null,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                   });
                sqlParameters.Add(
                   new QueryParameters
                   {
                       ValueName = "@ScheduledDate",
                       Value = initiateDiscussionRequest.DiscussionStartTime.ToString("yyyy-MM-dd HH:mm:ss.fff"),
                       ValueType = DbType.DateTime,
                       ValueDirection = ParameterDirection.Input
                   });
                var empOpportunityDataTable = await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.UPSERT_EMPLOYEE_OPPORTUNITY, sqlParameters);

                if (empOpportunityDataTable > 0)
                {
                    SendInitiateDiscussionMail(initiateDiscussionRequest);
                    _logger.LogTrace("InitiateDiscussion method completed successfully for Employee: {EmployeeID} and RRID: {RRID}", initiateDiscussionRequest.EmployeeId, initiateDiscussionRequest.RrId);
                    return StatusCodes.Status200OK;
                }
                else
                {
                    _logger.LogTrace("InitiateDiscussion method did not update any rows for Employee: {EmployeeID} and RRID: {RRID}", initiateDiscussionRequest.EmployeeId, initiateDiscussionRequest.RrId);
                    return StatusCodes.Status404NotFound;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in InitiateDiscussion for Employee: {EmployeeID} and RRID: {RRID}", initiateDiscussionRequest.EmployeeId, initiateDiscussionRequest.RrId);
                return StatusCodes.Status500InternalServerError;
            }
        }

        private async void SendInitiateDiscussionMail(InitiateDiscussionRequest initiateDiscussionRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: SendInitiateDiscussionMail");
                carbonCopy = _configuration.GetValue<string>("carbonCopy") ?? string.Empty;
                var employee = await GetEmployees(initiateDiscussionRequest.EmployeeId);
                var employeeInfo = employee.Select(x => new { x.EmailId, x.EmployeeName }).FirstOrDefault();

                var manager = await GetEmployees(initiateDiscussionRequest.ManagerEmployeeId);
                var managerInfo = manager.Select(x => new { x.EmailId, x.EmployeeName }).FirstOrDefault();

                string rrViewLink = _configuration["ResourceRequestViewLink"];
                string rrViewLinkWithRrId = string.Format(rrViewLink, initiateDiscussionRequest.RrId);

                string employeeMailBody = $"Dear {employeeInfo?.EmployeeName},<br /><br />" +
                                          $"Your connect with {managerInfo?.EmployeeName} for <a href=\"{rrViewLinkWithRrId}\">{initiateDiscussionRequest.ResourceRequestNumber}</a> has been scheduled. It will reflect in your Outlook Calendar shortly.<br /><br />" +
                                          "Thanking You,<br />" +
                                          "WFM Team";

                string managerMailBody = $"Dear {managerInfo?.EmployeeName},<br /><br />" +
                                         $"Your connect with {employeeInfo?.EmployeeName} for <a href=\" {rrViewLinkWithRrId} \"> {initiateDiscussionRequest.ResourceRequestNumber} </a> has been scheduled. It will reflect in your Outlook Calendar shortly.<br /><br />" +
                                         "Thanking You,<br />" +
                                         "WFM Team";

                _logger.LogInformation("Sending email for discussion scheduling...");

                await SendMail(initiateDiscussionRequest.EmployeeMailId, carbonCopy, null, $"BRIDGE: Discussion scheduled for opportunity {initiateDiscussionRequest.ResourceRequestNumber}", employeeMailBody);

                await SendMail(initiateDiscussionRequest.ManagerEmployeeMailId, carbonCopy, null, $"BRIDGE: Discussion scheduled for opportunity {initiateDiscussionRequest.ResourceRequestNumber}", managerMailBody);

                //Note : Sending invite handled in UI
                //await SendMail(initiateDiscussionRequest.EmployeeMailId, initiateDiscussionRequest.ManagerEmployeeMailId + ";" + initiateDiscussionRequest.ManagerEmployeeMailId, null, "Discussion", "Intiating a discussion", true, initiateDiscussionRequest.DiscussionStartTime, initiateDiscussionRequest.DiscussionDuration, initiateDiscussionRequest.OptionalAttendees, initiateDiscussionRequest.Location);
                _logger.LogInformation("Email sent successfully for discussion scheduling");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while sending the discussion scheduling email.");
            }
        }

        public async Task<List<LaunchpadEmployee>> GetEmployeesSearchData()
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployeesSearchData");
                var employeeList = await GetLaunchpadEmployeesFromSP();

                if (employeeList == null || employeeList.Count == 0)
                {
                    _logger.LogInformation("Records not found in GetEmployeesSearchData.");
                    return null;
                }

                _logger.LogInformation("GetEmployeesSearchData completed successfully.");
                return EmployeeMapper.MapLaunchpadEmployees(employeeList).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetEmployeesSearchData: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        public async Task<List<DisapprovalReasons>> GetDisapprovalReasons()
        {
            try
            {
                _logger.LogInformation("EmployeeDAO : GetDisapprovalReasons started");
                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);
                var disapprovalReasons = await _syncProvider.GetByQuery(connectionString, EmployeeQueryBuilder.GET_DISAPPROVALREASONS);
                _logger.LogInformation("Disapproval reasons retrieved successfully.");

                return EmployeeMapper.MapDisapprovalReasons(disapprovalReasons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving disapproval reasons.");
                throw;
            }
        }

        public async Task<EmployeeAuthenticationDetails> GetEmployeeAuthenticationDetails(string userMailId)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO : GetEmployeeAuthenticationDetails");
                _logger.LogTrace("GetEmployeeAuthenticationDetails started for userMailId: {UserMailId}", userMailId);

                int maxAppliedOpportunityNumber = Convert.ToInt32(_utilityDAO.GetConfigValue(UtilityConstant.MAX_APPLIEDOPPORTUNITY_NUMBER));

                Role role = new Role();
                bool isFutureReleaseEmployee = false;

                string[] userDetail = userMailId.Split('@');
                string userName = userDetail[0];

                var employeeAuthDetails = await GetEmployees("-1", userName);

                if (employeeAuthDetails == null || employeeAuthDetails.Count == 0)
                {
                    _logger.LogWarning("GetEmployeeAuthenticationDetails : Authentication details not found for userMailId: {UserMailId}", userMailId);
                    return null;
                }

                foreach (var res in employeeAuthDetails)
                {
                    role = await GetRoleOfEmployee(res.EmidsUniqueId, res.AccountName.ToUpper());
                    isFutureReleaseEmployee = await CheckISFutureReleaseEmployee(res.EmidsUniqueId);
                }

                if (employeeAuthDetails == null || employeeAuthDetails.Count == 0)
                {
                    _logger.LogWarning("GetEmployeeAuthenticationDetails : Authentication details found for userMailId: {UserMailId}", userMailId);
                    return null;
                }

                _logger.LogTrace("GetEmployeeAuthenticationDetails: Fetching the details successfully for userMailId: {UserMailId}", userMailId);

                return EmployeeMapper.MapEmployeeAuthenticationDetails(employeeAuthDetails, role, isFutureReleaseEmployee, maxAppliedOpportunityNumber);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetEmployeeAuthenticationDetails : An error occurred in GetEmployeeAuthenticationDetails for userMailId: {UserMailId}", userMailId);
                throw;
            }
        }

        public async Task<bool> CheckISFutureReleaseEmployee(string employeeId)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: CheckISFutureReleaseEmployee method started");
                var futureAvailableResource = await _wfmHandlerDAO.GetFutureAvailableResources();
                return futureAvailableResource.Any(r => r.EmployeeId == employeeId);

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Role> GetRoleOfEmployee(string employeeId, string accountName)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetRoleOfEmployee method started");
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var parameters = new object[]
                {
                    employeeId
                };

                var employeeData = await _syncProvider.GetByQuery(connectionString, string.Format(EmployeeQueryBuilder.CHECK_FOR_EMPLYOEEROLE, parameters));
                _logger.LogTrace("Role retrieved successfully for employee with ID: {EmployeeId}", employeeId);
                return EmployeeMapper.MapEmployeeRole(employeeData, accountName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetRoleOfEmployee: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        public async Task<List<EmployeeAssignment>> GetPreviousOrgAssignments(string employeeId, string stmtType)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetPreviousOrgAssignments");
                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);
                var sqlParameters = new List<QueryParameters>
                {
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = employeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@StatementType",
                        Value = stmtType,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    }
                };

                var employeeDataTable = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.PREVIOUSORGASSIGNMENTS_CRUD, sqlParameters);

                _logger.LogTrace("Successfully retrieved previous org assignments for employee with ID: {EmployeeId}", employeeId);

                return EmployeeMapper.MapPreviousOrgAssignments(employeeDataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetPreviousOrgAssignments: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        public async Task<int> UpsertPreviousOrgAssignments(EmployeeAssignment previousOrgAssignment)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO : UpsertPreviousOrgAssignments method started");
                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                var stmtTyeParam = new QueryParameters
                {
                    ValueName = "@StatementType",
                    Value = "",
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input,
                };

                if (previousOrgAssignment.Id != null && previousOrgAssignment.Id > 0 && string.IsNullOrEmpty(previousOrgAssignment.EmidsUniqueId))
                {
                    sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@Id",
                        Value = previousOrgAssignment.Id.ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input,
                    });
                    stmtTyeParam.Value = "Delete";
                }
                else
                {
                    sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = previousOrgAssignment.EmidsUniqueId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });
                    sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@KeyResponsibilities",
                        Value = previousOrgAssignment.KeyResponsibilities,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });
                    sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@ProjectName",
                        Value = previousOrgAssignment.ProjectName,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });
                    sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@Technologies",
                        Value = previousOrgAssignment.Technologies,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });
                    sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@ProjectRole",
                        Value = previousOrgAssignment.ProjectRole,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });
                    sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@StartDate",
                        Value = previousOrgAssignment.StartDate.ToString(),
                        ValueType = DbType.DateTime,
                        ValueDirection = ParameterDirection.Input
                    });
                    sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EndDate",
                        Value = previousOrgAssignment.EndDate.ToString(),
                        ValueType = DbType.DateTime,
                        ValueDirection = ParameterDirection.Input
                    });
                    stmtTyeParam.Value = "Insert";

                    if (previousOrgAssignment.Id != null && previousOrgAssignment.Id > 0)
                    {
                        sqlParameters.Add(
                        new QueryParameters
                        {
                            ValueName = "@Id",
                            Value = previousOrgAssignment.Id.ToString(),
                            ValueType = DbType.Int32,
                            ValueDirection = ParameterDirection.Input,
                        });
                        stmtTyeParam.Value = "Update";
                    }
                }
                sqlParameters.Add(stmtTyeParam);
                _logger.LogInformation("UpsertPreviousOrgAssignments sucessfully completed");
                return await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.PREVIOUSORGASSIGNMENTS_CRUD, sqlParameters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpsertPreviousOrgAssignments: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        public async Task<int> UpsertEmployeeOpportunity(EmployeeOpportunity employeeOpportunity)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO : UpsertEmployeeOpportunity method started");
                connectionString = _configuration.GetConnectionString(UtilityConstant.BridgeConnectionStringName);
                var sqlParameters = new List<QueryParameters>
                {
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
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@StatusId",
                        Value = employeeOpportunity.StatusId.ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@Comments",
                        Value = employeeOpportunity.Comments,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                       ValueName = "@ScheduledDate",
                       Value = null,
                       ValueType = DbType.DateTime,
                       ValueDirection = ParameterDirection.Input
                    }

                };

                _logger.LogInformation("UpsertEmployeeOpportunity sucessfully completed");
                return await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.UPSERT_EMPLOYEE_OPPORTUNITY, sqlParameters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpsertEmployeeOpportunity: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        public async Task<int?> UpdateEmployeeWriteUp(UpdateEmployeeWriteUp updateEmployeeWriteUp)
        {
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                   new QueryParameters
                   {
                       ValueName = "@EmployeeId",
                       Value = updateEmployeeWriteUp.EmployeeId,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                   });
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@EmployeeWriteup",
                    Value = updateEmployeeWriteUp.EmployeeWriteup,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                return await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.UPDATE_EMPLOYEE_WRITEUP, sqlParameters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateEmployeeWriteUp: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        public async Task<int?> UpdateRoleAndResponsibilityOfEmployee(EmployeeAssignment updateRoleAndResponsibilityOfEmployee)
        {
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                   new QueryParameters
                   {
                       ValueName = "@EmployeeId",
                       Value = updateRoleAndResponsibilityOfEmployee.EmidsUniqueId,
                       ValueType = DbType.String,
                       ValueDirection = ParameterDirection.Input
                   });
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@ProjectId",
                    Value = updateRoleAndResponsibilityOfEmployee.ProjectId.ToString(),
                    ValueType = DbType.Int32,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@ProjectRole",
                    Value = updateRoleAndResponsibilityOfEmployee.ProjectRole,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@ProjectKeyResponsibilities",
                    Value = updateRoleAndResponsibilityOfEmployee.KeyResponsibilities,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(
                new QueryParameters
                {
                    ValueName = "@ProjectSkills",
                    Value = updateRoleAndResponsibilityOfEmployee.Technologies,
                    ValueType = DbType.String,
                    ValueDirection = ParameterDirection.Input
                });
                sqlParameters.Add(
               new QueryParameters
               {
                   ValueName = "@ResAssignId",
                   Value = updateRoleAndResponsibilityOfEmployee.ResourceAssignId.Value.ToString(),
                   ValueType = DbType.Int32,
                   ValueDirection = ParameterDirection.Input
               });
                _logger.LogInformation("Successfully updated role and responsibility for employee {EmployeeId}", updateRoleAndResponsibilityOfEmployee.EmidsUniqueId);
                return await _syncProvider.UpsertByStoredProcedure(connectionString, EmployeeQueryBuilder.UPDATE_ROLE_RESPONSIBILITY_AND_Skill_EMPLOYEE, sqlParameters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateRoleAndResponsibilityOfEmployee: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        public async Task<List<Employee>> GetRRMatchingLaunchPadEmployees(ResourceRequest resourceRequest)
        {
            var launchPadEmployees = await GetLaunchpadEmployeesFromSP();
            var matchingEmployees = new List<Employee>();
            foreach (var employee in launchPadEmployees)
            {
                if (Utilities.GetMatchIndicator(resourceRequest, employee))
                    matchingEmployees.Add(employee);
            }

            var employeeIDsAppliedForRrID = await GetEmployeeIDByRrId(resourceRequest.RRId);

            matchingEmployees = matchingEmployees
            .Where(employee => !employeeIDsAppliedForRrID.Contains(employee.EmidsUniqueId))
            .OrderBy(m => m.Designation)
            .ThenBy(m => m.EmidsExperience + m.PastExperience)
            .ThenBy(m => m.BusinessLocation)
            .ToList();

            return matchingEmployees;
        }


        public async Task<List<string>> GetEmployeeIDByRrId(int? resourceRequestId)
        {
            try
            {
                _logger.LogInformation("EmployeeDAO: GetEmployeeIDByRrId method started for ResourceRequestId: {ResourceRequestId}", resourceRequestId);

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@RrId",
                        Value = resourceRequestId.ToString(),
                        ValueType = DbType.Int32,
                        ValueDirection = ParameterDirection.Input
                    });


                var employeeIdsByRrId = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.GET_EMPLOYEEID_BY_RRID, sqlParameters);

                _logger.LogInformation("GetEmployeeIDByRrId method completed successfully for ResourceRequestId: {ResourceRequestId}", resourceRequestId);
                return EmployeeMapper.MapEmployeeIdsByRrId(employeeIdsByRrId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetAppliedEmployeesCountForResourceRequest for ResourceRequestId: {ResourceRequestId}", resourceRequestId);
                throw;
            }
        }


        public async Task<List<EmployeeProject>> GetEmployeeProjectDetails(List<string> employeeIDList)
        {
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                string employeeIDsAsString = string.Join(",", employeeIDList.Select(id => $"'{id}'"));

                _logger.LogInformation("EmployeeDAO: GetEmployeeProjectDetails method started for EmployeeIDs: {EmployeeIDs}", employeeIDsAsString);

                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EmployeeIdList",
                        Value = employeeIDsAsString,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });

                var employeesProjectDetails = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.GET_EMPLOYEE_PROJECT_DETAILS, sqlParameters);

                _logger.LogInformation("Retrieved employee project details successfully for employee IDs: {EmployeeIDs}", employeeIDsAsString);

                return EmployeeMapper.MapEmployeesProjectDetails(employeesProjectDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching employee project details for employee IDs: {EmployeeIDs}", employeeIDList);
                throw;
            }
        }

        public async Task<List<ResourceAvailabilityStatus>> CheckResourceStatus(string employeeId)
        {
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                _logger.LogInformation("EmployeeDAO: CheckResourceStatus method started for EmployeeID: {EmployeeID}", employeeId);

                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = employeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });

                var resourcStatus = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.GET_CHECKRESOURCE_STATUS, sqlParameters);

                _logger.LogInformation("Retrieved employee project details successfully for employee IDs: {EmployeeID}", employeeId);

                  return EmployeeMapper.MapResourceStatus(resourcStatus);
                 

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching employee project details for employee IDs: {EmployeeID}", employeeId);
                throw;
            }
        }

        public async Task<List<GetOpportunityHistoryResponse>> GetOpportunityHistory(int rrId, OpportunityHistoryType historyType)
        {
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                   var sqlParameters = new List<QueryParameters>();
                            sqlParameters.Add(
                                new QueryParameters
                                {
                                    ValueName = "@RrId",
                                    Value = rrId.ToString(),
                                    ValueType = DbType.Int64,
                                    ValueDirection = ParameterDirection.Input
                                });

                var histories = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.RR_HISTORY, sqlParameters);

                _logger.LogInformation("Retrieved employee project details successfully for employee IDs: {EmployeeIDs}", rrId);

                return EmployeeMapper.MapHistory(histories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching employee project details for employee IDs: {EmployeeIDs}", rrId);
                throw;
            }
        }

        public async Task<List<GetTalentHistoryResponse>> GetTalentHistory(string employeeId)
        {
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                _logger.LogInformation("EmployeeDAO: GetTalentHistory method started for EmployeeID: {EmployeeID}", employeeId);

                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@EmployeeId",
                        Value = employeeId,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });

                var talentHistory = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.USP_EMPLOYEEHISTORYLOG, sqlParameters);

                _logger.LogInformation("Retrieved employee GetTalentHistory successfully for employee IDs: {EmployeeID}", employeeId);

                return EmployeeMapper.MapTalentHistory(talentHistory);


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching GetTalentHistory details for employee IDs: {EmployeeID}", employeeId);
                throw;
            }


        }

       public async Task<List<ActiveRrResponse>> GetActiveRRs(string status)
        {
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                _logger.LogInformation("EmployeeDAO: GetActiveRRs method started for EmployeeID: {EmployeeID}", status);

                var sqlParameters = new List<QueryParameters>();
                sqlParameters.Add(
                    new QueryParameters
                    {
                        ValueName = "@status",
                        Value = status,
                        ValueType = DbType.String,
                        ValueDirection = ParameterDirection.Input
                    });

                var rrs = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.USP_ALL_ACTIVERR_BY_STATUS, sqlParameters);

                _logger.LogInformation("Retrieved employee GetActiveRRs successfully for employee IDs: {status}", status);

                return EmployeeMapper.MapActiveRR(rrs);


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching GetActiveRRs details for employee IDs: {status}", status);
                throw;
            }


        }

        public async Task<LaunchPadResourceAnalysisResponses> GetViewLaunchPadResourceAnalysis()
        {
            try
            {
                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                _logger.LogInformation("EmployeeDAO: GetViewLaunchPadResourceAnalysis method started");

                var sqlParameters = new List<QueryParameters>();
                 

                var rrs = await _syncProvider.GetByStoredProcedure(connectionString, EmployeeQueryBuilder.USP_LAUNCHPAD_RESOURCEANALYSISREPORT, sqlParameters);

                _logger.LogInformation("Retrieved employee GetViewLaunchPadResourceAnalysis successfully");

                return EmployeeMapper.MapLaunchPadResourceAnalysisResponses(rrs);


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching GetViewLaunchPadResourceAnalysis details");
                throw;
            }


        }

      
    }
}

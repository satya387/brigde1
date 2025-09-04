using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using System.Data;
using System.Net;

namespace Bridge.Background.Worker
{
    public sealed class RRAlertSvc
    {
        private readonly ILogger<RRAlertWorker> _logger;
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private string connectionString;
        private bool enableEmailCommunication;
        private string carbonCopy;
        private readonly Utility _utility;

        public RRAlertSvc(ILogger<RRAlertWorker> logger, IConfiguration configuration, ISyncProvider syncProvider, Utility utility)
        {
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
            _utility = utility;
        }

        public async Task ProcessRRAlert()
        {
            _logger.LogInformation("Process RR Alert has been started: {DateTime}", DateTime.Now);

            #region Fetching list of launchpad employees

            List<Employee> launchpadEmployeesLists =  await GetLaunchpadEmployees();

            _logger.LogInformation("Fetched total launchpad employees: {total}, DateTime : {DateTime}", launchpadEmployeesLists.Count, DateTime.Now);

            #endregion

            #region Fetching list of active resource request

            var listOfActiveRR = GetActiveResourceRequests();

            _logger.LogInformation("Total {total} active resource request are found, DateTime: {DateTime}", listOfActiveRR.Count, DateTime.Now);

            #endregion

            #region Added a logic to filter out the matching RRs for the employee

            var empDetailsForMatchingRRs = GetMatchingResourceRequestsForEmployees(launchpadEmployeesLists, listOfActiveRR);
            
            #endregion

            #region Send out the email alert

            if (empDetailsForMatchingRRs.Count > 0)
            {
                _logger.LogInformation("Fetched all the matching resource requests based on the employee data, Total : {total} is been captured, DateTime : {DateTime}", empDetailsForMatchingRRs.Count, DateTime.Now);
                await SendEmailNotificationForResourceRequestOpportunity(empDetailsForMatchingRRs);
            }
            else
            {
                _logger.LogInformation("No Matching resource requests were found for all the launchpad employees, DateTime : {DateTime}", DateTime.Now);
            }

            #endregion
        }

        /// <summary>
        /// Featching all the launchpad employees
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns>List of Employees</returns>
        private async Task<List<Employee>> GetLaunchpadEmployees(string employeeId = "-1", string loginName = "-1")
        {
            var launchpadEmployeeList = new List<Employee>();

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

            var employeeDataTable = await _syncProvider.GetByStoredProcedure(connectionString, "GetLaunchpadEmployeeDetails_For_WFM", sqlParameters);

            foreach (DataRow row in employeeDataTable.Rows)
            {
                var employee = new Employee()
                {
                    EmidsUniqueId = Utilities.CheckDBNullForString(row, "Employee ID"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "Employee Name"),
                    EmailId = Utilities.CheckDBNullForString(row, "EmpMailId"),
                    Designation = Utilities.CheckDBNullForString(row, "Designation"),
                    Role = Utilities.CheckDBNullForString(row, "EmployeeRole"),
                    PrimarySkills = Utilities.CheckDBNullForString(row, "PrimarySkill"),
                    ReportingManagerName = Utilities.CheckDBNullForString(row, "Reporting Manger Emp ID"),
                    SecondarySkills = Utilities.CheckDBNullForString(row, "SecondarySkill"),
                    AccountName = Utilities.CheckDBNullForString(row, "Account Name"),
                    BusinessLocation = Utilities.CheckDBNullForString(row, "Business Location"),
                    EmidsExperience = Convert.ToDouble(Utilities.CheckDBNullForInt(row, "eMids Experience")),
                    PastExperience = Convert.ToDouble(Utilities.CheckDBNullForInt(row, "Past Experience"))
                };
                launchpadEmployeeList.Add(employee);
            }
            return launchpadEmployeeList;
        }

        /// <summary>
        /// Fetching all the active resource requests
        /// </summary>
        /// <returns>ResourceRequest</returns>
        private List<ResourceRequest> GetActiveResourceRequests()
        {
            var activeresourceRequestList = new List<ResourceRequest>();

            connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
            var activeResourceRequest = _syncProvider.GetByQuery(connectionString, "Select r.Id, r.RRNumber, pm.ProjName, r.JobTitle, r.MusttoHaveSkill, r.SecondarySkills,  pm.Allocation1, r.StartDate, r.YearsOfExp, r.Location, r.Role, r.RLSTechnology FROM RR_ResourceRequests r " +
                                                                    "Join ProjectMaster pm On r.ProjectId = pm.ProjId " +
                                                                    "Join RR_RequestStatusMaster rrm On r.StatusId = rrm.StatusId " +
                                                                    "Where rrm.RRStatus = 'Open' And rrm.IsActive = 1 ");

            foreach (DataRow row in activeResourceRequest.Result.Rows)
            {
                var resource = new ResourceRequest()
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
                    Location = Utilities.CheckDBNullForString(row, "Location"),
                    Designation = Utilities.CheckDBNullForString(row, "Role")
                };
                activeresourceRequestList.Add(resource);
            }
            return activeresourceRequestList;
        }

        /// <summary>
        /// Fetching all the employee details for resource requests which are created
        /// </summary>
        /// <param name="launchpadEmployeesLists"></param>
        /// <param name="listOfActiveRR"></param>
        /// <returns>OppurtunityMailAlert</returns>
        private List<OppurtunityMailAlert> GetMatchingResourceRequestsForEmployees(List<Employee> launchpadEmployeesLists, List<ResourceRequest> listOfActiveRR)
        {
            List<string> skillList = new List<string>();
            string skills = null;
            string locationName = null;
            int totalExperience = 0;
            string designation = null;
            const int totalMonths = 12;

            var empListsToSendMail = new List<OppurtunityMailAlert>();

            foreach (Employee empDetails in launchpadEmployeesLists)
            {
                skills = string.IsNullOrEmpty(empDetails.PrimarySkills) ? "" : empDetails.PrimarySkills;
                if (!string.IsNullOrEmpty(empDetails.SecondarySkills))
                {
                    skills += (string.IsNullOrEmpty(skills) ? "" : ", ") + empDetails.SecondarySkills;
                }
                locationName = empDetails.BusinessLocation;
                totalExperience = Convert.ToInt32(Math.Round((empDetails.EmidsExperience + empDetails.PastExperience) / totalMonths));
                designation = empDetails.Designation;

                if (!String.IsNullOrEmpty(skills))
                {
                    skillList = skills.Split(',').Select(skill => skill.Trim().ToLower()).ToList();
                }

                var filteredEmployeesWithMatchingRRs = listOfActiveRR.Where(x => x.Location.ToLower() == locationName.ToLower() && x.Experience == totalExperience && (skillList.Contains(x.SecondarySkill?.ToLower()) || skillList.Contains(x.PrimarySkill?.ToLower())) && x.Designation.ToLower() == designation.ToLower())
                        .Select(x => new OppurtunityMailAlert
                        {
                            EmployeeID = empDetails.EmidsUniqueId,
                            EmployeeName = empDetails.EmployeeName,
                            EmployeeEmail = empDetails.EmailId,
                            RRNumber = x.RRNumber,
                            RRId = x.RRId
                        });
                if (filteredEmployeesWithMatchingRRs.Any())
                {
                    empListsToSendMail.AddRange(filteredEmployeesWithMatchingRRs);

                    foreach (var item in filteredEmployeesWithMatchingRRs)
                    {
                        _logger.LogInformation("Found Matching Resource Requests {RRNumber} for Employee: {employeeId},  DateTime : {DateTime} ", item.RRNumber, item.EmployeeID, DateTime.Now);
                    }
                }
            }
            return empListsToSendMail.ToList();
        }

        /// <summary>
        /// Sending email notification to employees for the resource request 
        /// </summary>
        /// <param name="empDetailsForMatchingRRs"></param>
        /// <returns></returns>
        public async Task SendEmailNotificationForResourceRequestOpportunity(List<OppurtunityMailAlert> empDetailsForMatchingRRs)
        {
            enableEmailCommunication = _configuration.GetValue<bool>("EnableEmailCommunication");
            var employeeListsnotifiedForRRs = await GetEmployessAlreadyNotifiedForRR();
            carbonCopy = _configuration.GetValue<string>("carbonCopy") ?? string.Empty;

            foreach (OppurtunityMailAlert alert in empDetailsForMatchingRRs)
            {
                var filterEmployeeNotifiedForRRs = employeeListsnotifiedForRRs.Where(x => x.EmployeeID.Contains(alert.EmployeeID) &&  x.RRNumber.Contains(alert.RRNumber));

                if (!filterEmployeeNotifiedForRRs.Any())
                {
                    string rrViewLink = _configuration["ResourceRequestViewLink"];
                    string rrViewLinkWithRrId = string.Format(rrViewLink, alert.RRId);
                    string employeeMailBody = $"Dear {alert.EmployeeName},<br /><br />" +
                                              $"<a href=\"{rrViewLinkWithRrId}\">{alert.RRNumber}</a> aligns with your skillset. Please log on to Bridge for more details on the position.<br /><br />" +
                                              "Thanking You,<br />" +
                                              "WFM Team";

                    if (enableEmailCommunication)
                    {
                        _logger.LogInformation("Email to employee {EmployeeID} has Succesfully triggered for RRumber {RRNumber}, On : {DateTime} ", alert.EmployeeID, alert.RRNumber, DateTime.Now);
                        await _utility.SendMail(alert.EmployeeEmail, carbonCopy, null, "BRIDGE: Matching RR Number " + alert.RRNumber + " Found", employeeMailBody, alert.EmployeeID, alert.RRNumber);
                    }
                }
                else
                {
                    _logger.LogInformation("Email to employee {EmployeeID} has already sent for RRumber {RRNumber}, On : {DateTime} ", alert.EmployeeID, alert.RRNumber, DateTime.Now);
                }
            }
        }

        /// <summary>
        /// Fetching the employees who has already notified for the resource request
        /// </summary>
        /// <returns>List of MailNotification</returns>
        public async Task<List<MailNotification>> GetEmployessAlreadyNotifiedForRR()
        {
            connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
            var employessAlreadyNotifiedForRRs = await _syncProvider.GetByQuery(connectionString, "Select EmployeeID, RRNumber, Status From MailNotification(Nolock) Where EmployeeID Is Not Null And  RRNumber Is Not Null");
            var listOfEmployessAlreadyNotifiedForRRs = new List<MailNotification>();

            foreach (DataRow row in employessAlreadyNotifiedForRRs.Rows)
            {
                var employessNotifiedForRRs = new MailNotification()
                {
                    EmployeeID = row["EmployeeID"] != null ? row["EmployeeID"].ToString() : String.Empty,
                    RRNumber = row["RRNumber"] != null ? row["RRNumber"].ToString() : String.Empty,
                    Status = row["Status"] != null ? row["Status"].ToString() : String.Empty
                };
                listOfEmployessAlreadyNotifiedForRRs.Add(employessNotifiedForRRs);
            }
            return listOfEmployessAlreadyNotifiedForRRs;
        }
    }
}

using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Utility;
using System.Data;
using System.Net;

namespace Bridge.API.DAO.Mappers
{
    public static class EmployeeMapper
    {
        public static List<Employee> MapEmployees(DataTable dataTable)
        {
            var employees = new List<Employee>();
            foreach (DataRow row in dataTable.Rows)
            {
                var employee = new Employee()
                {
                    EmidsUniqueId = row["Employee ID"] != null ? row["Employee ID"].ToString() : String.Empty,
                    EmployeeName = row["Employee Name"] != null ? row["Employee Name"].ToString() : String.Empty,
                    EmailId = row["EmpMailId"] != null ? row["EmpMailId"].ToString() : String.Empty,
                    Designation = row["Designation"] != null ? row["Designation"].ToString() : String.Empty,
                    Role = row["EmployeeRole"] != null ? row["EmployeeRole"].ToString() : String.Empty,
                    PrimarySkills = row["PrimarySkill"] != null ? row["PrimarySkill"].ToString() : String.Empty,
                    ReportingManagerName = row["Reporting Manager Name"] != null ? row["Reporting Manager Name"].ToString() : String.Empty,
                    SecondarySkills = row["SecondarySkill"] != null ? row["SecondarySkill"].ToString() : String.Empty,
                    AccountName = row["Account Name"] != null ? row["Account Name"].ToString() : String.Empty,
                    BusinessLocation = row["Business Location"] != null ? row["Business Location"].ToString() : String.Empty,
                    EmidsExperience = row["eMids Experience"] != null ? Convert.ToDouble(row["eMids Experience"]) : 0,
                    PastExperience = row["Past Experience"] != null ? Convert.ToDouble(row["Past Experience"]) : 0,
                    About = row["EmployeeWriteup"] != null ? Convert.ToString(row["EmployeeWriteup"]) : string.Empty,
                    CurrentManagerId = row["Reporting Manger Emp ID"] != null ? row["Reporting Manger Emp ID"].ToString() : String.Empty,
                    CurrentProject = row["Project Name"] != null ? row["Project Name"].ToString() : String.Empty,
                    PhoneNumber = row["Telephone Mobile"] != null ? row["Telephone Mobile"].ToString() : String.Empty,
                    Location = row["Business City"] != null ? row["Business City"].ToString() : String.Empty,
                    WorkingLocation = row["WorkingCity"] != null ? row["WorkingCity"].ToString() : String.Empty,
                    IsLaunchpadEmployee = CheckDBNullForString(row, "Account Name").ToLower().Contains("launchpad") ? 1 : 0,
                    TotalExperience = (double)Math.Round((decimal)(Utilities.CheckDBNullForInt(row, "Past Experience") + Utilities.CheckDBNullForInt(row, "eMids Experience")) / 12),
                    Status = CheckDBNullForString(row, "AvailableStatus"),
                    AplliedOpportunityCount = CheckDBNullForInt(row, "AplliedOpportunityCount"),
                    EmployeeUserName = CheckDBNullForString(row, "EmpAdSUserAcct"),
                    AvailableAllocationPercentage = CheckDBNullForInt(row, "AvailableAllocationPercentage"),
                    Aging = CheckDBNullForInt(row, "Aging"),
                    Studio = CheckDBNullForString(row, "Studio")
                };
                employees.Add(employee);
            }

            return employees;
        }

        public static List<AppliedOpportunity> MapAppliedOpportunities(DataTable dataTable, List<EmployeeOpportunity> selfAppliedRrs)
        {
            var AppliedOpportunities = new List<AppliedOpportunity>();
            foreach (DataRow row in dataTable.Rows)
            {
                var appliedOpportunity = new AppliedOpportunity()
                {
                    RequiredExperience = CheckDBNullForInt(row, "YearsOfExp"),
                    JobTitle = CheckDBNullForString(row, "JobTitle"),
                    Location = CheckDBNullForString(row, "CityName"),
                    WorkLocation = CheckDBNullForString(row, "WorkLocation"),
                    PrimarySkill = CheckDBNullForString(row, "RLSTechnology"),
                    RRNumber = CheckDBNullForString(row, "RRNumber"),
                    RRId = CheckDBNullForInt(row, "Id"),
                    SecondarySkill = CheckDBNullForString(row, "SecondarySkills"),
                    ProjectStartDate = CheckDBNullForDate(row, "StartDate"),
                    Project = CheckDBNullForString(row, "ProjName"),
                    RRCountry = CheckDBNullForString(row, "Location"),
                    AvailableAllocationPercentage = CheckDBNullForInt(row, "AvailableAllocationPercentage"),
                    RRStatus = CheckDBNullForString(row, "RRStatus")
                };
                AppliedOpportunities.Add(appliedOpportunity);
            }

            return (from o in AppliedOpportunities
                    join s in selfAppliedRrs on o.RRId equals s.RrId
                    select new AppliedOpportunity
                    {
                        RequiredExperience = o.RequiredExperience,
                        JobTitle = o.JobTitle,
                        Location = o.Location,
                        WorkLocation = o.WorkLocation,
                        PrimarySkill = o.PrimarySkill,
                        RRNumber = o.RRNumber,
                        RRId = o.RRId,
                        SecondarySkill = o.SecondarySkill,
                        ProjectStartDate = o.ProjectStartDate,
                        Project = o.Project,
                        Status = (o.RRStatus.ToLower() == "true" && s.StatusId != 7) ? "Closed" : ((EmployeeOpportunityStatus)s.StatusId).ToString(),
                        ScheduledDate = s.ScheduledDate,
                        RRCountry = o.RRCountry,
                        Comments = s.Comments,
                        AvailableAllocationPercentage = o.AvailableAllocationPercentage,
                        RRStatus = o.RRStatus
                    }).ToList();
        }

        public static List<EmployeeAssignment> MapPreviousOrgAssignments(DataTable dataTable)
        {
            var previousOrgAssignments = new List<EmployeeAssignment>();
            foreach (DataRow row in dataTable.Rows)
            {
                var previousOrgAssignment = new EmployeeAssignment()
                {
                    EmidsUniqueId = Utilities.CheckDBNullForString(row, "EmployeeId"),
                    EndDate = Utilities.CheckDBNullForDate(row, "EndDate"),
                    KeyResponsibilities = Utilities.CheckDBNullForString(row, "KeyResponsibilities"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjectName"),
                    Technologies = Utilities.CheckDBNullForString(row, "Technologies"),
                    ProjectRole = Utilities.CheckDBNullForString(row, "ProjectRole"),
                    StartDate = Utilities.CheckDBNullForDate(row, "StartDate"),
                    Id = Utilities.CheckDBNullForInt(row, "Id"),
                };
                previousOrgAssignments.Add(previousOrgAssignment);
            }
            return previousOrgAssignments;
        }


        private static string CheckDBNullForString(DataRow row, string value)
        {
            return row[value] != null && row[value] is not DBNull ? row[value].ToString() : String.Empty;
        }
        private static int? CheckDBNullForInt(DataRow row, string value)
        {
            return row[value] != null && row[value] is not DBNull ? Convert.ToInt32(row[value].ToString()) : null;
        }
        private static DateTime? CheckDBNullForDate(DataRow row, string value)
        {
            return row[value] != null && row[value] is not DBNull ? Convert.ToDateTime(row[value].ToString()) : null;
        }

        public static (int id, string status) MapAppliedOpportunityId(DataTable dataExist)
        {
            if (dataExist.Rows.Count > 0)
            {
                int id = dataExist.Rows[0]["Id"] != null ? Convert.ToInt32(dataExist.Rows[0]["Id"]) : 0;
                string status = dataExist.Rows[0]["Status"] != null ? Convert.ToString(dataExist.Rows[0]["Status"]) : null;

                return (id, status);
            }
            return (0, null);
        }

        public static List<EmployeeOpportunity> MapAppliedRrIds(DataTable employeeResourceRequests)
        {
            var selfAppliedRrs = new List<EmployeeOpportunity>();

            foreach (DataRow resourceRequest in employeeResourceRequests.Rows)
            {
                selfAppliedRrs.Add(new EmployeeOpportunity()
                {
                    RrId = Utilities.CheckDBNullForInt(resourceRequest, "RrId").Value,
                    ScheduledDate = Utilities.CheckDBNullForDate(resourceRequest, "ScheduledDate"),
                    StatusId = Utilities.CheckDBNullForInt(resourceRequest, "StatusId").Value,
                    Comments = CheckDBNullForString(resourceRequest, "Comments"),
                });
            }
            return selfAppliedRrs;
        }

        public static List<LaunchpadEmployee> MapLaunchpadEmployees(List<Employee> employees)
        {
            return employees.Select(e => new LaunchpadEmployee()
            {
                EmployeeId = e.EmidsUniqueId,
                EmployeeEmailId = e.EmailId,
                Designation = e.Designation,
                EmployeeName = e.EmployeeName,
                EmployeeRole = e.Role,
                PrimarySkills = e.PrimarySkills,
                ReportingManagerName = e.ReportingManagerName,
                SecondarySkills = e.SecondarySkills,
                ProjectName = e.CurrentProject,
                BusinessLocation = e.BusinessLocation,
                WorkingLocation = e.WorkingLocation,
                Experience = Math.Round((e.EmidsExperience + e.PastExperience) / 12),
                AvailableAllocationPercentage = e.AvailableAllocationPercentage,
                Aging = e.Aging,
                Studio = e.Studio
            }).ToList();
        }

        public static List<EmployeeOpportunity> MapEmployeeRrIds(DataTable dataTable)
        {
            var employeeRrIds = new List<EmployeeOpportunity>();
            foreach (DataRow employeeRow in dataTable.Rows)
            {
                employeeRrIds.Add(
                    new EmployeeOpportunity
                    {
                        Comments = Utilities.CheckDBNullForString(employeeRow, "Comments"),
                        EmployeeId = Utilities.CheckDBNullForString(employeeRow, "EmployeeId"),
                        RrId = Utilities.CheckDBNullForInt(employeeRow, "RrId").Value,
                        CreatedOn = Utilities.CheckDBNullForDate(employeeRow, "CreatedOn").Value,
                        StatusId = Utilities.CheckDBNullForInt(employeeRow, "StatusId").Value,
                        ScheduledDate = Utilities.CheckDBNullForDate(employeeRow, "ScheduledDate"),
                        Status = Utilities.CheckDBNullForString(employeeRow, "Status"),
                        AdditionalComments = Utilities.CheckDBNullForString(employeeRow, "AdditionalComments"),
                    });
            }
            return employeeRrIds;
        }

        public static List<AppliedOpportunity> MapEmployeeFromEmployeeIds(List<Employee> employees, List<EmployeeOpportunity> employeerRIds, ResourceRequestDetails resourceRequestDetails, List<EmployeeProject> employeeProjectDetails)
        {
            var resourceRequest = MapResourceRequest(resourceRequestDetails);
            return (from e in employees
                    join empRr in employeerRIds on e.EmidsUniqueId.ToLower().Trim() equals empRr.EmployeeId.ToLower().Trim()
                    join empProject in employeeProjectDetails on e.EmidsUniqueId.ToLower().Trim() equals empProject.EmployeeId.ToLower().Trim()
                    select new AppliedOpportunity()
                    {
                        EmployeeEmailId = e.EmailId,
                        EmployeeName = e.EmployeeName,
                        EmployeeUniqueId = e.EmidsUniqueId,
                        RRId = Convert.ToInt32(empRr.RrId),
                        EmployeePrimarySkill = e.PrimarySkills,
                        SecondarySkill = e.SecondarySkills,
                        EmployeeExperience = (Math.Floor((e.EmidsExperience + e.PastExperience) / 12)).ToString() + "Y " + ((e.EmidsExperience + e.PastExperience) % 12).ToString() + "M ",
                        JobAppliedOn = empRr.CreatedOn,
                        Status = empRr.Status,
                        EmployeeRole = e.Role,
                        EmployeeCurrentProject = e.CurrentProject,
                        ScheduledDate = empRr.ScheduledDate,
                        EmidsExperience = e.EmidsExperience,
                        PastExperience = e.PastExperience,
                        Location = e.Location,
                        EmployeeDesignation = e.Designation,
                        EmployeePreviousProject = empProject.ProjectName,
                        Comments = empRr.Comments,
                        MatchCriteria = Utilities.GetMatchIndicator(resourceRequest, e) ? resourceRequest.MatchCriteria : null,
                        MatchPercentage = Utilities.GetMatchIndicator(resourceRequest, e) ? resourceRequest.MatchPercentage : 0,
                        AdditionalComments = empRr.AdditionalComments,
                        AvailableAllocationPercentage = e.AvailableAllocationPercentage,
                    }).ToList();
        }

        public static ResourceRequest MapResourceRequest(ResourceRequestDetails resourceRequestDetails)
        {
            if (resourceRequestDetails == null) return null;

            return new ResourceRequest
            {
                Experience = resourceRequestDetails.MinimumExp,
                PrimarySkill = resourceRequestDetails.PrimarySkill,
                SecondarySkill = resourceRequestDetails.SecondarySkill,
                Designation = resourceRequestDetails.Role,
                Location = resourceRequestDetails.WorkLocation

            };
        }

        public static List<ApplicationReviewResponse> MapEmployeeWithResourceRequests(List<ResourceRequest> resourceRequests, List<AppliedOpportunity> employeeDetailsWithRrId)
        {
            var applicationReviewResponses = new List<ApplicationReviewResponse>();
            foreach (var resourceRequest in resourceRequests)
            {
                var employeeApplications = employeeDetailsWithRrId.Where(w => w.RRId == resourceRequest.RRId).ToList();
                var applicationReviewResponse = new ApplicationReviewResponse()
                {
                    RRId = resourceRequest.RRId,
                    RRNumber = resourceRequest.RRNumber,
                    JobTitle = resourceRequest.JobTitle,
                    Location = resourceRequest.Location,
                    PrimarySkill = resourceRequest.PrimarySkill,
                    SecondarySkill = resourceRequest.SecondarySkill,
                    Project = resourceRequest.ProjectName,
                    ProjectStartDate = resourceRequest.StartDate,
                    RequiredExperience = resourceRequest.Experience,
                    WorkLocation = resourceRequest.Location,

                    EmployeeApplications = employeeApplications.Select(s => new EmployeeApplication()
                    {
                        EmployeeEmailId = s.EmployeeEmailId,
                        EmployeeName = s.EmployeeName,
                        EmployeeExperience = s.EmployeeExperience,
                        EmployeeUniqueId = s.EmployeeUniqueId,
                        JobAppliedOn = s.JobAppliedOn,
                        PrimarySkill = s.EmployeePrimarySkill,
                        SecondarySkill = s.EmployeeSecondarySkill,
                        Status = s.Status,
                        EmployeeRole = s.EmployeeRole,
                        EmployeeCurrentProject = s.EmployeeCurrentProject,
                        ScheduledDate = s.ScheduledDate,
                        EmployeeDesignation = s.EmployeeDesignation,
                        EmployeePreviousProject = s.EmployeePreviousProject,
                        Comments = s.Comments,
                        MatchCriteria = Utilities.GetMatchIndicator(resourceRequest, MapEmployeeApplicationToEmployee(s)) ? resourceRequest.MatchCriteria : null,
                        MatchPercentage = Utilities.GetMatchIndicator(resourceRequest, MapEmployeeApplicationToEmployee(s)) ? resourceRequest.MatchPercentage : 0,
                        AvailableAllocationPercentage = s.AvailableAllocationPercentage
                    }).ToList(),
                    ApplicantsCount = employeeApplications.Count()
                };
                applicationReviewResponses.Add(applicationReviewResponse);
            }
            return applicationReviewResponses;
        }

        private static Employee MapEmployeeApplicationToEmployee(AppliedOpportunity s)
        {
            if (s == null) return null;
            var emp = new Employee();
            emp.EmidsExperience = s.EmidsExperience;
            emp.PastExperience = s.PastExperience;
            emp.PrimarySkills = s.EmployeePrimarySkill;
            emp.SecondarySkills = s.EmployeeSecondarySkill;
            emp.Designation = s.EmployeeRole;
            emp.Location = s.Location;
            return emp;
        }

        public static int MapCountOfAppliedResourceRequest(DataTable dataExist)
        {
            return dataExist.Rows.Count > 0 ? dataExist.Rows[0]["AppliedResourceRequestIdCount"] != null ? Convert.ToInt32(dataExist.Rows[0]["AppliedResourceRequestIdCount"]) : 0 : 0;
        }

        public static OpportunityFilter MapEmployeeOpportunitySearchCriteriaData(DataTable dataTable)
        {
            OpportunityFilter opportunityFilterData = null;
            foreach (DataRow row in dataTable.Rows)
            {
                opportunityFilterData = new OpportunityFilter()
                {
                    PrimarySkills = Utilities.CheckDBNullForString(row, "PrimarySkills"),
                    Location = Utilities.CheckDBNullForString(row, "Location"),
                    MinExperienceInYears = Utilities.CheckDBNullForInt(row, "MinExperienceInYears"),
                    MaxExperienceInYears = Utilities.CheckDBNullForInt(row, "MaxExperienceInYears"),
                    Role = Utilities.CheckDBNullForString(row, "Role"),
                    Country = Utilities.CheckDBNullForString(row, "Country"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjectName")
                };
            }
            return opportunityFilterData;
        }
        public static List<int> MapListOfResourceRequestIdsToFilter(DataTable dataTable)
        {
            var resourceRequestIds = new List<int>();

            foreach (DataRow resourceRequest in dataTable.Rows)
            {
                resourceRequestIds.Add(Convert.ToInt32(resourceRequest["ResourceRequestId"]));
            }
            return resourceRequestIds;
        }

        public static string MapManagerId(DataTable dataExist)
        {
            return dataExist.Rows.Count > 0 ? dataExist.Rows[0]["projectManagerId"] != null ? Convert.ToString(dataExist.Rows[0]["projectManagerId"]) : string.Empty : string.Empty;
        }

        public static string MapEmailIdFromList(List<Employee> employees, string employeeId)
        {
            return employees.Where(x => x.EmidsUniqueId.ToLower().Trim() == employeeId.ToLower().Trim()).Select(x => x.EmailId).FirstOrDefault();
        }

        public static SendMailRequest MapMailRequest(string to, string cc, string bcc, string subject, string body, MailCredential mailCredential, bool sendCalendarInvite = false, DateTime? discussionStartTime = null, int discussionDuration = 0, string optionalAttendees = null, string location = null)
        {
            return new SendMailRequest
            {
                To = to,
                Cc = cc,
                Bcc = bcc,
                Subject = subject,
                Body = body,
                MailCredential = mailCredential,
                SendCalendarInvite = sendCalendarInvite,
                IsBodyHtml = true,
                DiscussionStartTime = discussionStartTime.HasValue ? discussionStartTime.Value : DateTime.Now,
                Duration = discussionDuration,
                Location = location
            };
        }

        public static SendMailRequest MapCalendarMailRequest(InitiateDiscussionRequest initiateDiscussionRequest, string subject, string body, MailCredential mailCredential)
        {
            return new SendMailRequest
            {
                To = initiateDiscussionRequest.EmployeeMailId,
                Cc = initiateDiscussionRequest.ManagerEmployeeMailId + ";" + initiateDiscussionRequest.OptionalAttendees,
                Bcc = null,
                Subject = subject,
                Body = body,
                Location = initiateDiscussionRequest.Location,
                DiscussionStartTime = initiateDiscussionRequest.DiscussionStartTime,
                Duration = initiateDiscussionRequest.DiscussionDuration,
                MailCredential = mailCredential
            };
        }

        public static MailNotification MapMailNotificationRequest(SendMailRequest sendMailRequest, HttpResponseMessage responseMessage)
        {
            return new MailNotification()
            {
                To = sendMailRequest.To,
                Cc = sendMailRequest.Cc,
                Bcc = sendMailRequest.Bcc,
                Body = sendMailRequest.Body,
                Error = responseMessage.Content?.ReadAsStringAsync().Result,
                From = sendMailRequest.MailCredential.FromUserName,
                Subject = sendMailRequest.Subject,
                Status = responseMessage.StatusCode == HttpStatusCode.OK ? Status.Success.ToString() : Status.Error.ToString()
            };
        }
        public static Employee MapEmployeeFromList(List<Employee> employees, string employeeId)
        {
            return employees.FirstOrDefault(x => x.EmidsUniqueId == employeeId);
        }

        public static List<EmployeeProject> MapEmidsProjects(DataTable employeeEmidsProjects)
        {
            var emidsProjects = new List<EmployeeProject>();
            foreach (DataRow row in employeeEmidsProjects.Rows)
            {
                var projectDetail = new EmployeeProject()
                {
                    ProjectId = Utilities.CheckDBNullForInt(row, "ProjID"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjName"),
                    EmployeeId = Utilities.CheckDBNullForString(row, "EmpeMidsID"),
                    Allocation = Convert.ToDecimal(Utilities.CheckDBNullForInt(row, "Allocation")),
                    AssignDate = Utilities.CheckDBNullForDate(row, "AssignDate"),
                    ReleaseDate = Utilities.CheckDBNullForDate(row, "ReleaseDate"),
                    ProjectRole = Utilities.CheckDBNullForString(row, "ProjectRole"),
                    ProjectKeyResponsibilities = Utilities.CheckDBNullForString(row, "ProjectKeyResponsibilities"),
                    ProjectSkills = Utilities.CheckDBNullForString(row, "ProjectSkills"),
                    ResourceAssignId = Utilities.CheckDBNullForInt(row, "ResAssignId")
                };
                emidsProjects.Add(projectDetail);
            }

            return emidsProjects;
        }

        public static List<EmployeeSkillMatrix> MapEmployeeSkillMatrix(DataTable employeeSkillMatrixList)
        {
            var skillMatrix = new List<EmployeeSkillMatrix>();
            foreach (DataRow row in employeeSkillMatrixList.Rows)
            {
                var employeeSkillMatrix = new EmployeeSkillMatrix()
                {
                    EmployeeId = row["EmpemidsId"] != null ? row["EmpemidsId"].ToString() : null,
                    Proficiency = row["Proficiency"] != null ? row["Proficiency"].ToString() : null,
                    COE = row["COE"] != null ? row["COE"].ToString() : null,
                    BeginnerSkills = row["Skills 1 - Beginner"] != null ? row["Skills 1 - Beginner"].ToString() : null,
                    IntermediateSkills = row["Skills 2 - Intermediate"] != null ? row["Skills 2 - Intermediate"].ToString() : null,
                    AdvancedSkills = row["Skills 3 - Advanced"] != null ? row["Skills 3 - Advanced"].ToString() : null,
                    ExpertSkills = row["Skills 4 - Expert"] != null ? row["Skills 4 - Expert"].ToString() : null,
                    PrimarySkills = row["PrimarySkill"] != null ? row["PrimarySkill"].ToString() : null,
                    SecondarySkills = row["SecondarySkill"] != null ? row["SecondarySkill"].ToString() : null,
                    Certifications = row["Certifications"] != null ? row["Certifications"].ToString() : null
                };
                skillMatrix.Add(employeeSkillMatrix);
            }

            return skillMatrix;
        }

        public static EmployeeSkillMatrix MapEmployeeSpecificSkillMatrix(List<EmployeeSkillMatrix> employeeSkillMatrices, string employeeId)
        {
            return employeeSkillMatrices.FirstOrDefault(x => x.EmployeeId.ToLower().Trim() == employeeId.ToLower().Trim());
        }

        public static Employee MapEmployeeProfile(Employee employeeDetail, List<EmployeeProject> emidsProjects, EmployeeSkillMatrix employeeSkillMatrix, List<EmployeeAssignment> previousOrgAssignments)
        {
            employeeDetail.EmployeeProjects = emidsProjects;
            employeeDetail.SkillMatrix = employeeSkillMatrix;
            employeeDetail.PreviousOrgAssignments = previousOrgAssignments;

            return employeeDetail;
        }

        public static List<DisapprovalReasons> MapDisapprovalReasons(DataTable disapprovalReasons)
        {
            var disapprovalReasonList = new List<DisapprovalReasons>();
            foreach (DataRow row in disapprovalReasons.Rows)
            {
                var disapprovalReason = new DisapprovalReasons()
                {
                    DisapprovalReason = row["DisapprovalReason"] != DBNull.Value ? row["DisapprovalReason"].ToString() : null
                };
                disapprovalReasonList.Add(disapprovalReason);
            }
            return disapprovalReasonList;
        }

        public static EmployeeAuthenticationDetails MapEmployeeAuthenticationDetails(List<Employee> employeeAuthDetails, Role employeeRole, bool isFutureReleaseEmployee, int maxAppliedOpportunityNumber)
        {
            return employeeAuthDetails.Select(e => new EmployeeAuthenticationDetails()
            {
                EmployeeId = e.EmidsUniqueId,
                EmployeeEmailId = e.EmailId,
                Role = Convert.ToString(employeeRole),
                IsLaunchpadEmployee = e.IsLaunchpadEmployee,
                EmployeeCountry = e.BusinessLocation,
                IsFutureReleaseEmployee = isFutureReleaseEmployee,
                EmployeeStatus = e.Status,
                ExceedMaxLimitForApplyOpportunity = e.AplliedOpportunityCount >= maxAppliedOpportunityNumber ? true : false,
                EmployeeUserName = e.EmployeeUserName,
                EmployeeName = e.EmployeeName
            }).FirstOrDefault();
        }

        public static Role MapEmployeeRole(DataTable employeeData, string accountName)
        {
            const string WfmAccount = UtilityConstant.WfmAccount;
            if (accountName == WfmAccount)
            {
                return Role.WFM;
            }
            else if (employeeData.Rows.Count > 0)
            {
                return Role.Manager;
            }
            else
            {
                return Role.Employee;
            }
        }

        public static List<string> MapEmployeeIdsByRrId(DataTable employeeIdsByRrId)
        {
            var employeeIds = new List<string>();

            foreach (DataRow resourceRequest in employeeIdsByRrId.Rows)
            {
                employeeIds.Add((string)(resourceRequest["EmployeeID"]));
            }
            return employeeIds;
        }

        public static List<EmployeeProject> MapEmployeesProjectDetails(DataTable employeesProjectDeatils)
        {
            var employeesProject = new List<EmployeeProject>();
            foreach (DataRow row in employeesProjectDeatils.Rows)
            {
                var employeeProject = new EmployeeProject()
                {
                    EmployeeId = Utilities.CheckDBNullForString(row, "EmpeMidsID"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjName"),
                };
                employeesProject.Add(employeeProject);
            }
            return employeesProject;
        }

        public static List<ResourceAvailabilityStatus> MapResourceStatus(DataTable resourcStatus)
        {
            return resourcStatus.AsEnumerable()?.Select(x => new ResourceAvailabilityStatus
            {
                Id = x.Field<int>("Id"),
                AvailableStatus = x.Field<string>("AvailableStatus"),
                ErrorMessage = ErrorMessage(x.Field<string>("AvailableStatus"))
            })?.ToList();
        }

        public static string ErrorMessage(string availableStatus)
        {
            return (availableStatus?.ToLower()) switch
            {
                "pip" => UtilityConstant.PIP,
                "customer interview" => UtilityConstant.CUSTOMERINTERVIEW,
                "maternity leave" => UtilityConstant.MATERNITYLEAVE,
                "unavailable pool" => UtilityConstant.UNAVAILABLEPOOL,
                "earmarked" => UtilityConstant.EARMARKED_Message,
                "resigned" => UtilityConstant.RESIGNED,
                _ => availableStatus,
            };
        }

        public static List<GetOpportunityHistoryResponse> MapHistory(DataTable histories)
        {
            var employees = new List<GetOpportunityHistoryResponse>();
            foreach (DataRow row in histories.Rows)
            {
                var employee = new GetOpportunityHistoryResponse()
                {
                    ActionPerformedDate = Utilities.CheckDBNullForString(row, "ActionPerformedDate"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "EmployeeName"),
                    ManagerName = Utilities.CheckDBNullForString(row, "ManagerName"),
                    WFMName = Utilities.CheckDBNullForString(row, "WFMName"),
                    ActualMessage = Utilities.CheckDBNullForString(row, "ActualMessage"),
                    AdditionalComments = Utilities.CheckDBNullForString(row, "AdditionalComments"),
                    Comments = Utilities.CheckDBNullForString(row, "Comments"),
                };
                employees.Add(employee);
            }
            return employees;
        }

        public static List<GetTalentHistoryResponse> MapTalentHistory(DataTable talentHistory)
        {

            var employees = new List<GetTalentHistoryResponse>();
            foreach (DataRow row in talentHistory.Rows)
            {
                var talent = new GetTalentHistoryResponse()
                {
                    ActionPerformedDate = Utilities.CheckDBNullForString(row, "ActionPerformedDate"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "EmployeeName"),
                    ManagerName = Utilities.CheckDBNullForString(row, "ManagerName"),
                    WFMName = Utilities.CheckDBNullForString(row, "WFMName"),
                    ActualMessage = Utilities.CheckDBNullForString(row, "ActualMessage"),
                    AdditionalComments = Utilities.CheckDBNullForString(row, "AdditionalComments"),
                    Comments = Utilities.CheckDBNullForString(row, "Comments"),
                };
                employees.Add(talent);
            }
            return employees;
        }

        /// <summary>
        /// MapActiveRR
        /// </summary>
        /// <param name="rrs"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public static List<ActiveRrResponse> MapActiveRR(DataTable rrs)
        {
            var employees = new List<ActiveRrResponse>();
            foreach (DataRow row in rrs.Rows)
            {
                var talent = new ActiveRrResponse()
                {
                    EmployeeName = Utilities.CheckDBNullForString(row, "EmployeeName"),
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjName"),
                    Skills = Utilities.CheckDBNullForString(row, "Skills"),
                    Location = Utilities.CheckDBNullForString(row, "Location"),
                    Experience = Utilities.CheckDBNullForString(row, "Experience"),
                    Appliedon = Utilities.CheckDBNullForString(row, "AppliedOn"),
                    ScheduleDate = Utilities.CheckDBNullForString(row, "ScheduledDate"),
                    RRAging = Utilities.CheckDBNullForInt(row, "RRAgeing"),
                    EmployeeId = Utilities.CheckDBNullForString(row, "EmployeeId"),
                    RrId = Utilities.CheckDBNullForInt(row, "RrId"),
                    EmployeeAgeing = Utilities.CheckDBNullForInt(row, "EmployeeAgeing"),
                    Comments = Utilities.CheckDBNullForString(row, "Comments"),
                    AdditionalComments = Utilities.CheckDBNullForString(row, "AdditionalComments"),
                    Status = Utilities.CheckDBNullForString(row, "Status")
                };
                employees.Add(talent);
            }
            return employees;

        }

        public static List<LaunchPadResourceAnalysisResponse> MapLaunchPadResourceAnalysisResponse(DataTable analysisDatatable, string columnsName, out int CountFina)
        {
            var count = 0;
            CountFina = +count;
            var LaunchPadResourceAnalysisResponses = new List<LaunchPadResourceAnalysisResponse>();
            var distnictPrimary = analysisDatatable.AsEnumerable().Where(x => x.Field<string>(columnsName) != null).Select(x => x.Field<string>(columnsName)).AsEnumerable().Distinct();
            foreach (var row in distnictPrimary)
            {
                var launchPadResourceAnalysisResponse = new LaunchPadResourceAnalysisResponse();
                count = analysisDatatable.AsEnumerable().Count(x => x.Field<string>(columnsName) == row) + count;
                CountFina = +count;
                launchPadResourceAnalysisResponse.SkillsResponses = new List<SkillsResponse>
                {
                    new SkillsResponse {
                               SkillCount=analysisDatatable.AsEnumerable().Count(x => x.Field<string>(columnsName) == row),
                               Skills=row,
                               SkillWiseListofEmployee=analysisDatatable.AsEnumerable().Where(x=> x.Field<string>(columnsName)==row).Select(x => new AnalysisResponse
                     {
                                  PrimarySkills=x.Field<string>("PrimarySkill"),
                                   SecondarySkills=x.Field<string>("SecondarySkills"),
                                   Experience=x.Field<int>("YearsOfExp"),
                                   Location=x.Field<string>("Location"),
                                   EmpRole=x.Field<string>("Role"),
                                   EmployeeName = x.Field<string>("EmployeeName"),
                                   EmployeeId = x.Field<string>("EmployeeID"),
                                   Designation = x.Field<string>("Designation"),
                                   ManagerID=x.Field<string>("ManagerID"),

                        }).ToList()

                } };

                LaunchPadResourceAnalysisResponses.Add(launchPadResourceAnalysisResponse);
            }
            return LaunchPadResourceAnalysisResponses;
        }

        private static List<LaunchPadResourceAnalysisResponse> MapLaunchPadResourceAnalysisExpResponse(DataTable analysisDatatable, string columnsName, out int CountFina)
        {
            var count = 0;
            CountFina = +count;
            var LaunchPadResourceAnalysisResponses = new List<LaunchPadResourceAnalysisResponse>();
            var distnictPrimary = analysisDatatable.AsEnumerable().Where(x => x.Field<int>(columnsName) != null).Select(x => x.Field<int>(columnsName)).AsEnumerable().Distinct();
            foreach (var row in distnictPrimary)
            {
                var launchPadResourceAnalysisResponse = new LaunchPadResourceAnalysisResponse();
                count = analysisDatatable.AsEnumerable().Count(x => x.Field<int>(columnsName) == row) + count;
                CountFina = +count;
                launchPadResourceAnalysisResponse.SkillsResponses = new List<SkillsResponse>
                {
                    new SkillsResponse {
                               SkillCount=count,
                               Skills=row.ToString(),
                               SkillWiseListofEmployee=analysisDatatable.AsEnumerable().Where(x=> x.Field<int>(columnsName)==row).Select(x => new AnalysisResponse
                         {
                                       PrimarySkills=x.Field<string>("PrimarySkill"),
                                       SecondarySkills=x.Field<string>("SecondarySkills"),
                                       Experience=x.Field<int>("YearsOfExp"),
                                       Location=x.Field<string>("Location"),
                                       EmpRole=x.Field<string>("Role"),
                                       EmployeeName = x.Field<string>("EmployeeName"),
                                       EmployeeId = x.Field<string>("EmployeeID"),
                                       Designation = x.Field<string>("Designation"),
                                       ManagerID=x.Field<string>("ManagerID"),


                        }).ToList()

                } };

                LaunchPadResourceAnalysisResponses.Add(launchPadResourceAnalysisResponse);
            }
            return LaunchPadResourceAnalysisResponses;
        }

        internal static LaunchPadResourceAnalysisResponses MapLaunchPadResourceAnalysisResponses(DataTable rrs)
        {
            var res = new LaunchPadResourceAnalysisResponses();
            int skillCount;
            var priResult = MapLaunchPadResourceAnalysisResponse(rrs, "PrimarySkill", out skillCount);
            res.PrimarySkillCount = skillCount;
            res.PrimarySkillsWiseResponsess = priResult;

            var ScenSkillResult = MapLaunchPadResourceAnalysisResponse(rrs, "SecondarySkills", out skillCount);
            res.ScendarySkillCount = skillCount;
            res.SecWiseResponsess = ScenSkillResult;


            var RoleResult = MapLaunchPadResourceAnalysisResponse(rrs, "Role", out skillCount);
            res.RoleCount = skillCount;
            res.RoleWiseResponsess = RoleResult;

            var ExperienceResult = MapLaunchPadResourceAnalysisExpResponse(rrs, "YearsOfExp", out skillCount);
            res.ExperienceCount = skillCount;
            res.ExperienceResponsess = ExperienceResult;

            var LocationResult = MapLaunchPadResourceAnalysisResponse(rrs, "Location", out skillCount);
            res.LocationwiseCount = skillCount;
            res.LocationResponsess = RoleResult;

            return res;
        }
    }


}

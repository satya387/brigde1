using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Utility;
using System.Data;

namespace Bridge.API.DAO.Mappers
{
    public static class WFMHandlerMapper
    {
        public static List<WFMDetails> MapWFMDetails(DataTable wfmDetails)
        {
            var wfmTeamList = new List<WFMDetails>();
            foreach (DataRow row in wfmDetails.Rows)
            {
                var wfmTeamMember = new WFMDetails()
                {
                    EmployeeID = Utilities.CheckDBNullForString(row, "EmpeMidsID"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "CommonName"),
                    EmailId = Utilities.CheckDBNullForString(row, "EmpMailID")
                };
                wfmTeamList.Add(wfmTeamMember);
            }
            return wfmTeamList;
        }

        public static List<LaunchpadEmployee> MapFutureAvailableResources(DataTable futureAvailableresource)
        {
            var allFutureAvailablResources = new List<LaunchpadEmployee>();
            foreach (DataRow row in futureAvailableresource.Rows)
            {
                var resource = new LaunchpadEmployee()
                {
                    EmployeeId = Utilities.CheckDBNullForString(row, "EmpeMidsID"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "EmployeeName"),
                    Designation = Utilities.CheckDBNullForString(row, "Designation"),
                    PrimarySkills = Utilities.CheckDBNullForString(row, "PrimarySkill"),
                    SecondarySkills = Utilities.CheckDBNullForString(row, "SecondarySkill"),
                    BusinessLocation = Utilities.CheckDBNullForString(row, "Business Location"),
                    Experience = (double)Math.Round((decimal)(Utilities.CheckDBNullForInt(row, "Past Experience") + Utilities.CheckDBNullForInt(row, "eMids Experience")) / 12),
                    WorkingLocation = Utilities.CheckDBNullForString(row, "WorkingCity"),
                    OnLaunchPadFrom = Utilities.CheckDBNullForDate(row, "AssignDate")?.ToString("dd/MM/yyyy"),
                    WfmSpoc = Utilities.CheckDBNullForString(row, "WFMSpoc"),
                    Availability = Utilities.CheckDBNullForString(row, "AvailableStatus"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjectName"),
                    ReportingManagerName = Utilities.CheckDBNullForString(row, "ManagerName"),
                    EmployeeEmailId = Utilities.CheckDBNullForString(row, "EmpEmailID"),
                    EmployeeRole = Utilities.CheckDBNullForString(row, "Designation"),
                    AvailableOn = Utilities.CheckDBNullForDate(row, "ReleaseDate")?.ToString("dd/MM/yyyy"),
                    ReleaseStatus = Utilities.CheckDBNullForString(row, "ReleaseStatus"),
                    EmidsExperience = (double)Math.Round((decimal)Utilities.CheckDBNullForInt(row, "eMids Experience")/ 12)
                };
                allFutureAvailablResources.Add(resource);
            }
            return allFutureAvailablResources;
        }

        public static List<LaunchpadEmployee> MapAllAvailableResources(DataTable allAvailableResourcesList)
        {
            var allAvailableResource = new List<LaunchpadEmployee>();
            foreach (DataRow row in allAvailableResourcesList.Rows)
            {
                var resource = new LaunchpadEmployee()
                {
                    EmployeeId = Utilities.CheckDBNullForString(row, "Employee ID"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "Employee Name"),
                    Designation = Utilities.CheckDBNullForString(row, "Designation"),
                    PrimarySkills = Utilities.CheckDBNullForString(row, "PrimarySkill"),
                    SecondarySkills = Utilities.CheckDBNullForString(row, "SecondarySkill"),
                    BusinessLocation = Utilities.CheckDBNullForString(row, "Business Location"),
                    Experience = (double)Math.Round((decimal)(Utilities.CheckDBNullForInt(row, "Past Experience") + Utilities.CheckDBNullForInt(row, "eMids Experience")) / 12),
                    WorkingLocation = Utilities.CheckDBNullForString(row, "WorkingCity"),
                    OnLaunchPadFrom = Utilities.CheckDBNullForDate(row, "AssignDate")?.ToString("dd/MM/yyyy"),
                    Aging = Utilities.CheckDBNullForInt(row, "Aging"),
                    WfmSpoc = Utilities.CheckDBNullForString(row, "WFMSpoc"),
                    Availability = Utilities.CheckDBNullForString(row, "AvailableStatus"),
                    EffectiveTill = Utilities.CheckDBNullForDate(row, "EffectiveTill")?.ToString("dd/MM/yyyy"),
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    RRId = Utilities.CheckDBNullForInt(row, "RRId"),
                    AvailableAllocationPercentage = Utilities.CheckDBNullForInt(row, "AvailableAllocationPercentage"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjectName"),
                    ProfileCompleteness = Utilities.CheckDBNullForInt(row, "TotalProfileCompletenessPercentage")
                };
                allAvailableResource.Add(resource);
            }
            return allAvailableResource;
        }

        public static List<ReleasedEmployeeResponse> MapReleasedEmployeeResponse(DataTable dtReleasedEmployeeResponses)
        {
            var releasedEmployeeResponses = new List<ReleasedEmployeeResponse>();
            foreach (DataRow row in dtReleasedEmployeeResponses.Rows)
            {
                var resource = new ReleasedEmployeeResponse()
                {
                    EmployeeId = Utilities.CheckDBNullForString(row, "Employee ID"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "Employee Name"),
                    EmployeeEmailId = Utilities.CheckDBNullForString(row, "EmpMailId"),
                    Designation = Utilities.CheckDBNullForString(row, "Designation"),
                    ReportingManagerName = Utilities.CheckDBNullForString(row, "Reporting Manager Name"),
                    PrimarySkills = Utilities.CheckDBNullForString(row, "PrimarySkill"),
                    SecondarySkills = Utilities.CheckDBNullForString(row, "SecondarySkill"),
                    BusinessLocation = Utilities.CheckDBNullForString(row, "Business Location"),
                    EmployeeRole = Utilities.CheckDBNullForString(row, "EmployeeRole"),
                    ProjectName = Utilities.CheckDBNullForString(row, "PrimaryProject"),
                    Experience = (double)Math.Round((decimal)(Utilities.CheckDBNullForInt(row, "Past Experience") + Utilities.CheckDBNullForInt(row, "eMids Experience")) / 12),
                    WorkingLocation = Utilities.CheckDBNullForString(row, "WorkingCity"),
                    WfmSpoc = Utilities.CheckDBNullForString(row, "WFMSpoc"),
                    ReleaseRequestOn = Utilities.CheckDBNullForDate(row, "CreatedOn"),
                    PlannedReleaseDate = Utilities.CheckDBNullForDate(row, "ManagerApproveOrWithdrawDate"),
                    ReleaseReason = Utilities.CheckDBNullForString(row, "ReleaseReason"),
                    Status = Utilities.CheckDBNullForString(row, "AvailableStatus"),
                    TalentInformed = Utilities.CheckDBNullForBool(row, "InformedEmployee"),
                    RRRequesterId = Utilities.CheckDBNullForString(row, "Reporting Manger Emp ID"),
                    WfmRejectComment = Utilities.CheckDBNullForString(row, "WfmRejectComment"),
                    Comments = Utilities.CheckDBNullForString(row, "Comments")
                };
                releasedEmployeeResponses.Add(resource);
            }
            return releasedEmployeeResponses;
        }

        public static List<ResourceAllocationDetails> MapResourceAllocationDetails(DataTable resourceDetails)
        {
            var resourceDetailsList = new List<ResourceAllocationDetails>();
            foreach (DataRow row in resourceDetails.Rows)
            {
                var resource = new ResourceAllocationDetails()
                {
                    EmployeeId = Utilities.CheckDBNullForString(row, "EmployeeId"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "EmployeeName"),
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjectName"),
                    Location = Utilities.CheckDBNullForString(row, "Location"),
                    PrimarySkill = Utilities.CheckDBNullForString(row, "MusttoHaveSkill"),
                    SecondarySkill = Utilities.CheckDBNullForString(row, "SecondarySkills"),
                    AllocationPercentage = Utilities.CheckDBNullForInt(row, "AllocationPercentage"),
                    AllocationStartDate = Utilities.CheckDBNullForDate(row, "AllocationStartDate"),
                    RequesterName = Utilities.CheckDBNullForString(row, "RequesterName"),
                    WFMSpoc = Utilities.CheckDBNullForString(row, "WFMSpoc"),
                    WfmAllocationStartDate = Utilities.CheckDBNullForDate(row, "WfmAllocationStartDate"),
                    WfmAllocationPercentage = Utilities.CheckDBNullForInt(row, "WfmAllocationPercentage"),
                    CityName = Utilities.CheckDBNullForString(row, "CityName"),
                    AdditionalComments = Utilities.CheckDBNullForString(row, "AdditionalComments"),
                    RequesterID = Utilities.CheckDBNullForString(row, "RequesterID"),
                    RrId = Utilities.CheckDBNullForInt(row, "RrId"),
                    RRCreatedDate = Utilities.CheckDBNullForDate(row, "RRCreatedDate")?.ToString("MM/dd/yyyy"),
                    AvailableAllocationPercentage = Utilities.CheckDBNullForInt(row, "AvailableAllocationPercentage")
                };
                resourceDetailsList.Add(resource);
            }
            return resourceDetailsList;
        }

        public static List<ResourceRequestsComments> MapComments(DataTable resourceRequestsComments)
        {
            var resourceComments = new List<ResourceRequestsComments>();
            if (resourceRequestsComments?.Rows?.Count == 0)
            {
                return resourceComments;
            }
            foreach (DataRow row in resourceRequestsComments.Rows)
            {
                var comment = new ResourceRequestsComments()
                {
                    WFMCreatedDate = Utilities.CheckDBNullForDate(row, "WFMCreatedDate"),
                    WFMCreatedBy = Utilities.CheckDBNullForString(row, "WFMCreatedBy"),
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    RRComment = Utilities.CheckDBNullForString(row, "RRComment"),
                    RRID = Utilities.CheckDBNullForInt(row, "RRID"),

                };
                resourceComments.Add(comment);
            }
            return resourceComments;
        }

        public static List<CommentsDeatils> MapDeclinedAndDroppedComments(DataTable declinedAndDroppedComments)
        {
            var listOfDeclinedAndDroppedComments = new List<CommentsDeatils>();
            if (declinedAndDroppedComments?.Rows?.Count == 0)
            {
                return listOfDeclinedAndDroppedComments;
            }
            foreach (DataRow row in declinedAndDroppedComments.Rows)
            {
                var comment = new CommentsDeatils()
                {
                    Comments = Utilities.CheckDBNullForString(row, "Comments"),
                    CommentsCount = Utilities.CheckDBNullForInt(row, "CommentsCount"),

                };
                listOfDeclinedAndDroppedComments.Add(comment);
            }
            return listOfDeclinedAndDroppedComments;
        }

        public static List<DroppedApplications> MapDroppedApplications(DataTable droppedApplications)
        {
            var listOfDroppedApplications = new List<DroppedApplications>();
            foreach (DataRow row in droppedApplications.Rows)
            {
                var DroppedApplicant = new DroppedApplications()
                {
                    RRNumber = Utilities.CheckDBNullForString(row, "RRNumber"),
                    RrId = Utilities.CheckDBNullForInt(row, "RrId"),
                    EmployeeName = Utilities.CheckDBNullForString(row, "EmployeeName"),
                    EmployeeId = Utilities.CheckDBNullForString(row, "EmployeeId"),
                    ProjectName = Utilities.CheckDBNullForString(row, "ProjectName"),
                    RRAging = Utilities.CheckDBNullForInt(row, "RRAging"),
                    RRSkills = Utilities.CheckDBNullForString(row, "RRSkills"),
                    Location = Utilities.CheckDBNullForString(row, "Location"),
                    CityName = Utilities.CheckDBNullForString(row, "CityName"),
                    Experience = Utilities.CheckDBNullForInt(row, "YearsOfExperience"),
                    AppliedOn = Utilities.CheckDBNullForDate(row, "AppliedOn"),
                    DroppedReason = Utilities.CheckDBNullForString(row, "Comments"),
                    AdditionalComments = Utilities.CheckDBNullForString(row, "AdditionalComments"),
                    Status = Utilities.CheckDBNullForString(row, "Status")
                };
                listOfDroppedApplications.Add(DroppedApplicant);
            }
            return listOfDroppedApplications;
        }
    }
}
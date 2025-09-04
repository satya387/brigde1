using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class ApplicationReviewResponse
    {
        public string RRNumber { get; set; }
        public string Project { get; set; }
        public string JobTitle { get; set; }
        public string PrimarySkill { get; set; }
        public string SecondarySkill { get; set; }
        public int? RequiredExperience { get; set; }
        public string Location { get; set; }
        public string WorkLocation { get; set; }
        public DateTime? ProjectStartDate { get; set; }
        public int? RRId { get; set; }
        public List<EmployeeApplication> EmployeeApplications { get; set; }
        public int ApplicantsCount { get; set; }
    }

    public class EmployeeApplication
    {
        public DateTime? JobAppliedOn { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeUniqueId { get; set; }
        public string EmployeeEmailId { get; set; }
        public string Status { get; set; }
        public string PrimarySkill { get; set; }
        public string SecondarySkill { get; set; }
        public string EmployeeExperience { get; set; }
        public string EmployeeRole { get; set; }
        public string EmployeeCurrentProject { get; set; }
        public DateTime? ScheduledDate { get; set; }
         public int MatchPercentage { get; set; }
        public string MatchCriteria { get; set; }
        public string EmployeeDesignation { get; set; }
        public string EmployeePreviousProject { get; set; }
        public string Comments { get; set; }
        public int? AvailableAllocationPercentage { get; set; }
    }
}

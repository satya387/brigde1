using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class AppliedOpportunity
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
        public DateTime? JobAppliedOn { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeUniqueId { get; set; }
        public string EmployeeEmailId { get; set; }
        public string Status { get; set; }
        public string EmployeePrimarySkill { get; set; }
        public string EmployeeSecondarySkill { get; set; }
        public string EmployeeExperience { get; set; }
        public string EmployeeRole { get; set; }
        public string EmployeeCurrentProject { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public string RRCountry { get; set; }
        public string EmployeeDesignation { get; set; }
        public string EmployeePreviousProject { get; set; }
        public string Comments { get; set; }
        public int? AvailableAllocationPercentage { get; set; }

        #region This priority is used to Review Application page - Matching Idicator        
        public double EmidsExperience { get; set; }
        public double PastExperience { get; set; }

        public string MatchCriteria { get; set; }
        public int MatchPercentage { get; set; }
        public string AdditionalComments { get; set; }
        public string RRStatus { get; set; }

        #endregion

    }
}

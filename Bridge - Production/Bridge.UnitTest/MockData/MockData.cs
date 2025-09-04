using Bridge.Infrastructure.Entities;
using System.Data;

namespace Bridge.UnitTest.MockData
{
    /// <summary>
    /// Mock Data
    /// </summary>
    public class MockData
    {
        public static List<GetOpportunityHistoryResponse> GetOpportunityHistory { get; set; } = new List<GetOpportunityHistoryResponse>()
        {
        new GetOpportunityHistoryResponse{
            ActionPerformedDate=DateTime.Now.ToString(),
            ActualMessage="applied for XXX",
            ManagerName="Mdhu",
            AdditionalComments="ad comments",
            Comments="comment",
            EmployeeName="Maneesh Deepankar",
            WFMName="AMY"
        }
        };

        public static List<GetTalentHistoryResponse> GetTalentHistoryResponse { get; set; } = new List<GetTalentHistoryResponse>()
        {
        new GetTalentHistoryResponse{
            ActionPerformedDate=DateTime.Now.ToString(),
            ActualMessage="applied for XXX",
            ManagerName="Mdhu",
            AdditionalComments="ad comments",
            Comments="comment",
            EmployeeName="Maneesh Deepankar",
            WFMName="AMY"
        }
        };

        /// <summary>
        /// ListManager Resourcess
        /// </summary>
        public static List<ManagerResources> ListManagerResourcess { get; set; } = new List<ManagerResources>
        {
            new ManagerResources {

                        AllocatedOn=DateTime.Now.ToString(),
                        EmployeeId="1",
                        ManagerApproveOrWithdrawDate=DateTime.Now.ToString(),
                        Status="1",
                        CreatedBy="1",
                        WFMEmployeeId="2",
                        EmployeeName="MA",
                        ExperienceInProject=12,
                        WfmSuggestedDate=DateTime.Now.ToString(),
                        ExperienceYears=1,
                        BillingStatus="1",
                        InformedEmployee="Yes",
                        ModifiedBy="1",
                        ProjectName="P1",
                        ReleaseReason="Withdraw",
                        Role="SSE",
                        WfmRejectComment = "Test"
            }
        };

        /// <summary>
        /// ListManager Resourcess
        /// </summary>
        public static DataTable DataTableManagerResourcess { get; set; } = GetDataTable();


        public static List<LaunchpadEmployee> GetHomeSearchDetails { get; set; } = GetLaunchpadEmployee();


        public static List<LaunchpadEmployee> GetLaunchpadEmployee()
        {
            var employeeHomeSearchResult = new List<LaunchpadEmployee>();

            var resourceRequestSearch = new List<ResourceRequest>();
            resourceRequestSearch.Add(new ResourceRequest()
            {
                RRId = 16694,
                RRNumber = "RR/513/2023",
                JobTitle = "Senior Software Engineer",
                PrimarySkill = null,
                SecondarySkill = "HTML/CSS",
                StartDate = DateTime.Now,
                Experience = 4,
                Location = "India",
                Designation = "Senior Software Engineer",
                ProjectName = "ONLIFE HEALTH - Development",
                Allocation = 100,
            }
            );



            return employeeHomeSearchResult;
        }

        public static DataTable GetDataTable()
        {
            DataTable dt = new DataTable();
            DataRow row = dt.NewRow();

            dt.Columns.Add("EmployeeId");
            dt.Columns.Add("WFMEmployeeId");
            dt.Columns.Add("CreatedBy");
            dt.Columns.Add("ReleaseReason");
            dt.Columns.Add("ManagerApproveOrWithdrawDate");
            dt.Columns.Add("EmployeeName");
            dt.Columns.Add("EmpeMidsID");
            dt.Columns.Add("Designation");
            dt.Columns.Add("Past Experience");
            dt.Columns.Add("eMids Experience");
            dt.Columns.Add("ProjectName");
            dt.Columns.Add("AssignDate");
            dt.Columns.Add("Status");
            dt.Columns.Add("BillingType");
            dt.Columns.Add("ModifiedBy");
            dt.Columns.Add("InformedEmployee");
            dt.Columns.Add("WfmSuggestedDate");

            dt.Columns.Add("EmployeeSummary");
            dt.Columns.Add("ManagerSummary");

            row["EmployeeId"] = "1";
            row["WFMEmployeeId"] = "2";
            row["CreatedBy"] = "2";
            row["ReleaseReason"] = "1";
            row["ManagerApproveOrWithdrawDate"] = DateTime.Now.ToString();
            row["EmployeeName"] = "1";
            row["EmpeMidsID"] = "1";
            row["Designation"] = "1";
            row["Past Experience"] = "1";
            row["eMids Experience"] = "1";
            row["ProjectName"] = "1";
            row["AssignDate"] = DateTime.Now.ToString();
            row["Status"] = "1";
            row["BillingType"] = "1";
            row["ModifiedBy"] = "1";
            row["InformedEmployee"] = "true";
            row["WfmSuggestedDate"] = DateTime.Now.ToString();
            row["EmployeeSummary"] = "{Name:\"MAN\"}";
            row["ManagerSummary"] = "{Name:\"MAN\"}";
            dt.Rows.Add(row);
            return dt;
        }

        /// <summary>
        /// GetEmployeeSummaryResponse utilised for Test case
        /// </summary>
        public static EmployeeSummaryResponse GetEmployeeSummaryResponse { get; set; } = new EmployeeSummaryResponse
        {

            EmployeeSummary = new Dictionary<string, object>()        {
            { "1",  "{Name:\"MAN\"}" }, },
            ManagerSummary = new Dictionary<string, object>()        {
            { "1",  "{Role:\"Manager\"}" }, },



        };

        /// <summary>
        /// ResourceRequestsComments utilised for Test case
        /// </summary>
        public static ResourceRequestsComments ResourceRequestsComments { get; set; } = new ResourceRequestsComments
        {

            RRNumber = "123",
            RRComment = "123",
            WFMCreatedBy = "123",
            WFMCreatedDate = DateTime.Now
        };
        public static List<ReleasedEmployeeResponse> GetReleasedEmployee { get; set; } = new List<ReleasedEmployeeResponse>() { new ReleasedEmployeeResponse {

         EmployeeId = "INEMP1111", EmployeeName = "Test", ReportingManagerName = "abc", BusinessLocation = "Banglore", WorkingLocation ="India", ProjectName = "Emids", ReleaseReason = "INEMP4444", WfmSpoc = "Amy", ReleaseRequestOn =DateTime.Now, PrimarySkills = "", SecondarySkills = "sql", PlannedReleaseDate = DateTime.Now,

        },
        new ReleasedEmployeeResponse {

         EmployeeId = "INEMP1112", EmployeeName = "Test1", ReportingManagerName = "abcd", BusinessLocation = "Banglore", WorkingLocation ="India", ProjectName = "Emids", ReleaseReason = "INEMP4444", WfmSpoc = "Amy", ReleaseRequestOn = DateTime.Now, PrimarySkills = "", SecondarySkills = "sql", PlannedReleaseDate = DateTime.Now,
        },
         new ReleasedEmployeeResponse {
         EmployeeId = "INEMP1162", EmployeeName = "Test11", ReportingManagerName = "abcdef", BusinessLocation = "Banglore", WorkingLocation ="India", ProjectName = "Emids", ReleaseReason = "INEMP4444", WfmSpoc = "Amy", ReleaseRequestOn = DateTime.Now, PrimarySkills = "", SecondarySkills = "sql", PlannedReleaseDate = DateTime.Now,
        }
        };


        /// <summary>
        /// ListAppliedOpportunitys
        /// </summary>
        public static List<AppliedOpportunity> ListAppliedOpportunitys { get; set; } = new List<AppliedOpportunity>
        {
            new AppliedOpportunity {

                        AdditionalComments="MDR",
                        Comments="Comments",
                        RRId=1212,
                        RRNumber="123",
                        ProjectStartDate=DateTime.Now,
                        EmployeeDesignation="Dev",
                        ScheduledDate=DateTime.Now,
                        EmidsExperience =1,
                        EmployeeCurrentProject="Bridge",
                        EmployeeEmailId="ManeeshD@emids.com",
                        EmployeeName="Maneesh Deepankar",EmployeePrimarySkill=".Net"


            }
        };

        public static DataTable DataTableRRAgeing { get; set; } = GetRRAgeingDataTable();

        public static DataTable GetRRAgeingDataTable()
        {
            DataTable dt = new DataTable();
            DataRow row = dt.NewRow();

            dt.Columns.Add("RRId");
            dt.Columns.Add("RRNumber");
            dt.Columns.Add("RoleRequested");
            dt.Columns.Add("PostedOn");
            dt.Columns.Add("Ageing");
            dt.Columns.Add("ProjectName");

            row["RRId"] = 1;
            row["RRNumber"] = "RR/123";
            row["RoleRequested"] = "SSE";
            row["PostedOn"] = "31-01-2023 00:00:00";
            row["Ageing"] = DateTime.Now.ToString();
            row["ProjectName"] = "ABC";

            dt.Rows.Add(row);
            return dt;
        }
        public static List<ActiveRrResponse> GetActiveRRS { get; set; } = new List<ActiveRrResponse>()
        {
        new ActiveRrResponse{
            ScheduleDate=DateTime.Now.ToString(),
            Appliedon=DateTime.Now.ToString(),
             RRAging=12,
             Experience="12",
             Skills=".Net",
             Location="India",
             ProjectName="LaunchPad",
             RRNumber="123", 
            EmployeeName="Maneesh Deepankar",
            EmployeeId="123",
            RrId = 1,
            EmployeeAgeing = 333,
            Comments = "test comments",
            Status = "Active"
        }
        };

        public static LaunchPadResourceAnalysisResponses LaunchPadResourceAnalysisResponses { get; set; } = new LaunchPadResourceAnalysisResponses()
        {
            RoleCount = 1,
            RoleWiseResponsess = new List<LaunchPadResourceAnalysisResponse> { new LaunchPadResourceAnalysisResponse { } },
            ExperienceCount = 1,
            LocationwiseCount = 1,             
            PrimarySkillCount = 1,
            ScendarySkillCount = 1,
        };


    }
}

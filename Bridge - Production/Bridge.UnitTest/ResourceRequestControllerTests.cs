using Bridge.API.Controllers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Linq;


namespace Bridge.UnitTest
{
    [TestClass]
    public class ResourceRequestControllerTests
    {
        private readonly Mock<IResourceRequestSync> _mockRrsSvc;
        private readonly ResourceRequestController _rrsController;
        private readonly Mock<ILogger<ResourceRequestController>> _logger = new Mock<ILogger<ResourceRequestController>>();

        public ResourceRequestControllerTests()
        {
            _mockRrsSvc = new Mock<IResourceRequestSync>();
            _rrsController = new ResourceRequestController(_mockRrsSvc.Object, _logger.Object);
        }

        #region GetResourceRequestDetails

        [TestMethod]
        [DataRow(0)]
        public void GetResourceRequestDetails_When_ResourceRequestNumberIsZero_Then_ReturnsBadRequest(int id)
        {
            var resourceRequestDetailsHeader = new ResourceRequestDetailsHeader() {id= id,EmployeeID="INEMP5189" };
            var result = _rrsController.GetResourceRequestDetails(resourceRequestDetailsHeader).Result;
            Assert.IsInstanceOfType(result.Result, typeof(BadRequestResult));
        }

        [TestMethod]
        [DataRow(123)]
        public void GetResourceRequestDetails_When_ResourceRequestNumberIsInvalid_Then_ReturnsNotFoundResult(int id)
        {
            var resourceRequestDetailsHeader = new ResourceRequestDetailsHeader() { id = id, EmployeeID = "INEMP5189" };
            var result = _rrsController.GetResourceRequestDetails(resourceRequestDetailsHeader).Result;
            Assert.IsInstanceOfType(result.Result, typeof(NoContentResult));
        }

        [TestMethod]
        [DataRow(15812)]
        public void GetResourceRequestDetails_When_ResourceRequestNumberIsValid_Then_ReturnsOkResult(int resourceRequestID)
        {
            ResourceRequestResult resourceRequestDetails = GetResourceRequestDetails();
            var resourceRequestDetailsHeader = new ResourceRequestDetailsHeader() { id = resourceRequestID, EmployeeID = "INEMP5189" };
            _mockRrsSvc.Setup(x => x.GetResourceRequestsById(resourceRequestDetailsHeader)).Returns(Task.FromResult(resourceRequestDetails));
            var result = _rrsController.GetResourceRequestDetails(resourceRequestDetailsHeader).Result;
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        }

        private ResourceRequestResult GetResourceRequestDetails()
        {
            ResourceRequestDetails resourceRequest = new ResourceRequestDetails()
            {
                RRId = 15813,
                StartDate = DateTime.Now,
                AccountName = "MEDIDATA - CTMS",
                MinimumExp = 2,
                Allocation = 100,
                WorkLocation = null,
                PrimarySkill = null,
                SecondarySkill = "MySQL",
                ManagerId = null,
                About = "Application maintenance & support for clinical trial legacy application",
                JobSummary = "support for clinical trial legacy application",
                RolesandResponsibilities = "Team Lead for the Application",
                OpenTill = null,
            };

            ResourceRequestResult mockResult = new ResourceRequestResult
            {
                ResourceRequestDetails = resourceRequest,
                Applicants = 10
            };

            return mockResult;
        }

        #endregion

        #region Apply Filter 

        [TestMethod]
        [DataRow(null)]
        public void GetEmployeeOpportunities_When_EmployeeIdIsNull_Then_ReturnBadRequest(string employeeId)
        {
            var res = _rrsController.GetEmployeeOpportunities(employeeId).Result;
            Assert.IsInstanceOfType(res.Result, typeof(BadRequestResult));
        }

        [TestMethod]
        [DataRow("")]
        public void GetEmployeeOpportunities_When_EmployeeIdIsBlank_Then_ReturnBadRequest(string employeeId)
        {
            var res = _rrsController.GetEmployeeOpportunities(employeeId).Result;
            Assert.IsInstanceOfType(res.Result, typeof(BadRequestResult));
        }

        [TestMethod]
        [DataRow("INEMP3146")]
        public void GetEmployeeOpportunities_When_EmployeeIDIsValid_Then_ReturnsOkResult(string employeeId)
        {
            List<ResourceRequestWithApplicantsCount> employeeOpportunityRequest = GetResourceRequestWithApplicantsCount();
            _mockRrsSvc.Setup(x => x.GetEmployeeOpportunities(employeeId)).Returns(Task.FromResult(employeeOpportunityRequest));
            var result = _rrsController.GetEmployeeOpportunities(employeeId).Result;
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        }

        private List<ResourceRequestWithApplicantsCount> GetResourceRequestWithApplicantsCount()
        {
            List<ResourceRequestWithApplicantsCount> RRDetails = new List<ResourceRequestWithApplicantsCount>();

            ResourceRequest resourceRequest = new ResourceRequest()
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
                RrComments = "test comments"
            };
            ResourceRequestWithApplicantsCount mockResult = new ResourceRequestWithApplicantsCount
            {
                ResourceRequest = resourceRequest,
                EmployeeAppliedCount = 10
            };

            RRDetails.Add(mockResult);
            return RRDetails;
        }

        #endregion

        #region GetActiveResourceRequestForManager

        [TestMethod]
        public void GetActiveRRsForManager_When_ManagerIDIsValid_Then_ReturnsOkResult()
        {
            ManagerEmployeeIdsModel managerEmployeeIdsModel = new ManagerEmployeeIdsModel()
            {
                ManagerId = "INEMP5376",
                EmployeeId = ""
            };
            List<ResourceRequest> RRDetailsOfManger = GetActiveResourceRequestDetails();
            _mockRrsSvc.Setup(x => x.GetActiveResourceRequestsForManager(managerEmployeeIdsModel)).Returns(Task.FromResult(RRDetailsOfManger));
            var result = _rrsController.GetActiveResourceRequestsForManager(managerEmployeeIdsModel).Result;
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        }

        [TestMethod]
        public void GetActiveRRsForManager_When_ManagerIDIsInvalid_Then_ReturnsBadRequestResult()
        {
            ManagerEmployeeIdsModel managerEmployeeIdsModel = new ManagerEmployeeIdsModel()
            {
                ManagerId = "",
                EmployeeId = ""
            };
            var res = _rrsController.GetActiveResourceRequestsForManager(managerEmployeeIdsModel).Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res.Result, typeof(BadRequestResult));
        }

        [TestMethod]
        public void GetActiveRRsForManager_When_ManagerIDIsNotExists_Then_ReturnsNotFoundResult()
        {
            ManagerEmployeeIdsModel managerEmployeeIdsModel = new ManagerEmployeeIdsModel()
            {
                ManagerId = "1111",
                EmployeeId = ""
            };
            var result = _rrsController.GetActiveResourceRequestsForManager(managerEmployeeIdsModel).Result;

            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(NoContentResult));
        }
        [TestMethod]
        public void GetApplicantsByRRId_Positive()
        {
            int rrid = 1;
            _mockRrsSvc.Setup(x => x.GetApplicantsByRRId(rrid)).Returns(Task.FromResult(MockData.MockData.ListAppliedOpportunitys));
            var result = _rrsController.GetApplicantsByRRId(rrid).Result;
            Assert.IsNotNull(result);
            var data = ((ObjectResult)result).Value;
             Assert.IsTrue(data != null);          

        }
        [TestMethod]
        public void GetApplicantsByRRId_Error()
        {
            int rrid = 1;
            _mockRrsSvc.Setup(x => x.GetApplicantsByRRId(rrid)).Throws(new Exception("Error", new Exception("Internal Error")));
            var result = _rrsController.GetApplicantsByRRId(rrid).Result;
            Assert.IsNotNull(result);
            var data = ((ObjectResult)result);
            Assert.AreEqual(500, data.StatusCode);
            Assert.AreEqual("An error occurred in GetApplicantsByRRId method", data.Value);
        }

        [TestMethod]
        public void GetApplicantsByRRId_0_Error()
        {
            int rrid = 0;            
            var result = _rrsController.GetApplicantsByRRId(rrid).Result;
            Assert.IsNotNull(result);  
            Assert.AreEqual(400, ((StatusCodeResult)result).StatusCode);         
        }

        [TestMethod]
        public void GetOpportunityHistory_0_Error()
        {
             
            int rrid = 0;
            var result = _rrsController.GetOpportunityHistory(rrid, OpportunityHistoryType.RR).Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(400, ((StatusCodeResult)result).StatusCode);
        }

        [TestMethod]
        public void GetOpportunityHistory_RRID_Positive()
        {
            int rrid = 1;
            string type = "resource";
            _mockRrsSvc.Setup(x => x.GetOpportunityHistory(rrid, OpportunityHistoryType.RR)).Returns(Task.FromResult(MockData.MockData.GetOpportunityHistory));
            var result = _rrsController.GetOpportunityHistory(rrid, OpportunityHistoryType.RR).Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(200, ((ObjectResult)result).StatusCode);
        }
        private List<ResourceRequest> GetActiveResourceRequestDetails()
        {
            List<ResourceRequest> RRDetails = new List<ResourceRequest>();
            RRDetails.Add(new ResourceRequest()
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
            });
            return RRDetails;
        }


        [TestMethod]
        public void GetActiveRRS_Status_Positive()
        {
         
            string Statustype = "Scheduled,L2Discussion";
            _mockRrsSvc.Setup(x => x.GetActiveRRs(Statustype)).Returns(Task.FromResult(MockData.MockData.GetActiveRRS));
            var result = _rrsController.GetActiveRRs(Statustype).Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(200, ((ObjectResult)result).StatusCode);
        }

        [TestMethod]
        public void GetActiveRRS_Status_Negative()
        {
            string Statustype = "";
            _mockRrsSvc.Setup(x => x.GetActiveRRs(Statustype)).Returns(Task.FromResult(MockData.MockData.GetActiveRRS));
            var result = _rrsController.GetActiveRRs(Statustype).Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(400, ((BadRequestResult)result).StatusCode);
        }
        #endregion

        [TestMethod]
        public void  GetViewLaunchPadResourceAnalysis_Positive()
        { 
            _mockRrsSvc.Setup(x => x.GetViewLaunchPadResourceAnalysis()).Returns(Task.FromResult(MockData.MockData.LaunchPadResourceAnalysisResponses));
            var result = _rrsController.GetViewLaunchPadResourceAnalysis().Result;
            var res = ((ObjectResult)result);
            var values = res.Value;
            Assert.AreEqual(200, res.StatusCode);             
        }

        [TestMethod]
        public void GetViewLaunchPadResourceAnalysis_Negative()
        {
            _mockRrsSvc.Setup(x => x.GetViewLaunchPadResourceAnalysis()).Throws(new Exception("Error"));
            var result = _rrsController.GetViewLaunchPadResourceAnalysis().Result;
            var res = ((ObjectResult)result);
            var values = res.Value;
            Assert.AreEqual(500, res.StatusCode);
        }

    }
}

using Bridge.API.Controllers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Bridge.UnitTest
{
    [TestClass]
    public class WFMHandlerControllerTests
    {
        private readonly Mock<IWFMHandlerSync> _mockWFMHandlerSync;
        private readonly WFMHandlerController _wfmHandlerController;
        private readonly Mock<ILogger<WFMHandlerController>> _logger = new Mock<ILogger<WFMHandlerController>>();
        private readonly Mock<IEmployeeSync> _mockEmployeeSync;

        public WFMHandlerControllerTests()
        {
            _mockWFMHandlerSync = new Mock<IWFMHandlerSync>();
            _mockEmployeeSync = new Mock<IEmployeeSync>();
            _wfmHandlerController = new WFMHandlerController(_mockWFMHandlerSync.Object, _logger.Object, _mockEmployeeSync.Object);
        }

        #region GetWFMTeamList

        [TestMethod]
        public void GetWFMTeamList_When_TableHasData_Then_ReturnOkResult()
        {
            _mockWFMHandlerSync.Setup(x => x.GetWFMTeamList()).Returns(Task.FromResult(GetWFMDetails()));
            var res = _wfmHandlerController.GetWFMTeamList().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetWFMTeamList_When_TableHasNoData_ReturnsNotFoundResult()
        {
            List<WFMDetails>? wFMDetails = null;
            _mockWFMHandlerSync.Setup(e => e.GetWFMTeamList()).ReturnsAsync(wFMDetails);
            var controller = new WFMHandlerController(_mockWFMHandlerSync.Object, _logger.Object, _mockEmployeeSync.Object);
            var result = await controller.GetWFMTeamList();
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        private List<WFMDetails> GetWFMDetails()
        {
            var wfmDetails = new List<WFMDetails>
            {
                new WFMDetails { EmployeeID = "INEMP1111", EmployeeName = "Test", EmailId = "Test@abc.com" },
                new WFMDetails { EmployeeID = "INEMP1112", EmployeeName = "Jack", EmailId = "Jack@abc.com"}
            };
            return wfmDetails;
        }

        #endregion

        #region GetResourceAllocationDetails

        [TestMethod]
        public void GetResourceAllocationDetails_When_TableHasData_Then_ReturnOkResult()
        {
            _mockWFMHandlerSync.Setup(x => x.GetResourceAllocationDetails()).Returns(Task.FromResult(GetResourceAllocationList()));
            var res = _wfmHandlerController.GetResourceAllocationDetails().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetResourceAllocationDetails_When_TableHasNoData_ReturnsNotFoundResult()
        {
            List<ResourceAllocationDetails>? resourceAllocationDetails = null;
            _mockWFMHandlerSync.Setup(e => e.GetResourceAllocationDetails()).ReturnsAsync(resourceAllocationDetails);
            var controller = new WFMHandlerController(_mockWFMHandlerSync.Object, _logger.Object, _mockEmployeeSync.Object);
            var result = await controller.GetResourceAllocationDetails();
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        private List<ResourceAllocationDetails> GetResourceAllocationList()
        {
            var resourceAllocationDetails = new List<ResourceAllocationDetails>
            {
                new ResourceAllocationDetails { EmployeeId = "INEMP1111", EmployeeName = "Test", AdditionalComments = "abc", AllocationPercentage = 100, CityName = "Banglore", Location ="India", ProjectName = "Emids", RequesterID = "INEMP4444", WFMSpoc = "Amy", RRNumber = "RR/123", PrimarySkill = "", SecondarySkill = "sql", RequesterName = "NMA", AvailableAllocationPercentage = 100},
                new ResourceAllocationDetails { EmployeeId = "INEMP1111", EmployeeName = "Test", AdditionalComments = "abc", AllocationPercentage = 100, CityName = "Banglore", Location ="India", ProjectName = "Emids", RequesterID = "INEMP4444", WFMSpoc = "Amy", RRNumber = "RR/124", PrimarySkill = "", SecondarySkill = "C#", RequesterName = "NMA", AvailableAllocationPercentage = 99},
                new ResourceAllocationDetails { EmployeeId = "INEMP1234", EmployeeName = "John", AdditionalComments = "TestComments", AllocationPercentage = 100, CityName = "Banglore", Location ="India", ProjectName = "Emids", RequesterID = "INEMP4444", WFMSpoc = "Amy", RRNumber = "RR/124", PrimarySkill = "", SecondarySkill = "C#", RequesterName = "NMA", AvailableAllocationPercentage = 99}
            };
            return resourceAllocationDetails;
        }

        #endregion

        [TestMethod]
        public void GetReleasedEmployee_When_TableHasData_Then_ReturnOkResult()
        {
            _mockWFMHandlerSync.Setup(x => x.GetReleasedEmployee()).Returns(Task.FromResult(MockData.MockData.GetReleasedEmployee));
            var res = _wfmHandlerController.GetReleasedEmployee().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }
        [TestMethod]
        public void GetReleasedEmployee_When_TableHasData_Then_NotContentResult()
        {
            _mockWFMHandlerSync.Setup(x => x.GetReleasedEmployee()).Returns(Task.FromResult(new List<ReleasedEmployeeResponse>()));
            var res = _wfmHandlerController.GetReleasedEmployee().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(NoContentResult));
            Assert.AreEqual(204, ((NoContentResult)res).StatusCode);
        }


        [TestMethod]
        public void GetReleasedEmployee_When_TableHasData_Then_ReturnBADResult()
        {
            _mockWFMHandlerSync.Setup(x => x.GetReleasedEmployee()).Throws(new Exception("Error"));
            var res = _wfmHandlerController.GetReleasedEmployee();
            Assert.IsNotNull(res);
            Assert.AreEqual(TaskStatus.Faulted, res.Status);
        }

        [TestMethod]
        public void UpsertResourceAllocationDetails_Tests()
        {
            var employeeID = new EmployeeOpportunity() { EmployeeId = "INEMP1111" };
            _mockEmployeeSync.Setup(x => x.CheckResourceStatus(It.IsAny<string>())).Returns(Task.FromResult(new List<ResourceAvailabilityStatus>() { new ResourceAvailabilityStatus { Id = 1, AvailableStatus = "Unavailabe" } }));
            var res = _wfmHandlerController.UpsertResourceAllocationDetails(employeeID).Result;
            Assert.IsNotNull(res);
            Assert.AreEqual(409, ((ConflictObjectResult)res).StatusCode);

        }

        [TestMethod]
        public void SaveResourceRequestsComments_Tests()
        {
            _mockWFMHandlerSync.Setup(x => x.SaveResourceRequestsComments(It.IsAny<ResourceRequestsComments>())).Returns(Task.FromResult(200));
            var res = _wfmHandlerController.SaveResourceRequestsComments(MockData.MockData.ResourceRequestsComments).Result;
            Assert.IsNotNull(res);
            Assert.AreEqual(200, ((OkResult)res).StatusCode);

        }


        [TestMethod]
        public void SaveResourceRequestsComments__ExceptionTests()
        {
            _mockWFMHandlerSync.Setup(x => x.SaveResourceRequestsComments(It.IsAny<ResourceRequestsComments>())).Throws<Exception>();
            Task<ActionResult> res = _wfmHandlerController.SaveResourceRequestsComments(MockData.MockData.ResourceRequestsComments);
            Assert.IsNotNull(res);

            Assert.IsNotNull(res.Exception.Message);

        }


        [TestMethod]
        public void SaveResourceRequestsComments_Exception_Tests()
        {
            _mockWFMHandlerSync.Setup(x => x.SaveResourceRequestsComments(It.IsAny<ResourceRequestsComments>())).Returns(Task.FromResult(500));
            var res = _wfmHandlerController.SaveResourceRequestsComments(MockData.MockData.ResourceRequestsComments).Result;
            Assert.IsNotNull(res);
            Assert.AreEqual(500, ((ObjectResult)res).StatusCode);
        }

        [TestMethod]
        public void SaveResourceRequestsComments_Exception_Null_Tests()
        {
            _mockWFMHandlerSync.Setup(x => x.SaveResourceRequestsComments(It.IsAny<ResourceRequestsComments>())).Returns(Task.FromResult(500));
            var res = _wfmHandlerController.SaveResourceRequestsComments(new ResourceRequestsComments() { RRNumber = "" }).Result;
            Assert.IsNotNull(res);
            Assert.AreEqual(500, ((ObjectResult)res).StatusCode);

        }

        [TestMethod]
        public void GetResourceComments_Tests()
        {
            int rrNumber = 1;
            _mockWFMHandlerSync.Setup(x => x.GetResourceComments(rrNumber)).Returns(Task.FromResult(new List<ResourceRequestsComments> {

            MockData.MockData.ResourceRequestsComments
            }));
            var res = _wfmHandlerController.GetResourceComments(rrNumber).Result;
            Assert.IsNotNull(res);
            Assert.AreEqual(200, ((Microsoft.AspNetCore.Mvc.ObjectResult)res).StatusCode);

        }
        [TestMethod]
        public void GetResourceComments_Null_Response_Tests()
        {
            int rrNumber = 1;
            _mockWFMHandlerSync.Setup(x => x.GetResourceComments(rrNumber)).Returns(Task.FromResult(new List<ResourceRequestsComments>()));
            var res = _wfmHandlerController.GetResourceComments(rrNumber).Result;
            Assert.IsNotNull(res);
            Assert.AreEqual(204, ((NoContentResult)res).StatusCode);
        }

        [TestMethod]
        public void GetResourceComments_Exception_Response_Tests()
        {
            int rrNumber = 1;
            _mockWFMHandlerSync.Setup(x => x.GetResourceComments(rrNumber)).Throws(new Exception("ERROR"));
            var res = _wfmHandlerController.GetResourceComments(rrNumber).Result;
            Assert.IsNotNull(res);
            Assert.AreEqual(400, ((BadRequestObjectResult)res).StatusCode);
        }

        #region GetDeclinedAndDroppedComment

        [TestMethod]
        public void GetDeclinedAndDroppedComments_When_TableHasData_Then_ReturnOkResult()
        {
            _mockWFMHandlerSync.Setup(x => x.GetDeclinedAndDroppedComments()).Returns(Task.FromResult(GetDeclinedAndDroppedComments()));
            var res = _wfmHandlerController.GetDeclinedAndDroppedComments().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetDeclinedAndDroppedComments_When_TableHasNoData_ReturnsNotFoundResult()
        {
            List<CommentsDeatils>? commDetails = null;
            _mockWFMHandlerSync.Setup(e => e.GetDeclinedAndDroppedComments()).ReturnsAsync(commDetails);
            var controller = new WFMHandlerController(_mockWFMHandlerSync.Object, _logger.Object, _mockEmployeeSync.Object);
            var result = await controller.GetDeclinedAndDroppedComments();
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        private List<CommentsDeatils> GetDeclinedAndDroppedComments()
        {
            var commentDetails = new List<CommentsDeatils>
            {
                new CommentsDeatils { Comments = "Client Rejection" , CommentsCount = 3},
                new CommentsDeatils { Comments = "Cost Rejection" , CommentsCount = 4},
                new CommentsDeatils { Comments = "Employee Self-rejection" , CommentsCount = 5},
                new CommentsDeatils { Comments = "Skills Gap - Potential Training Candidate" , CommentsCount = 1},
            };
            return commentDetails;
        }
        #endregion

        #region GetDroppedApplications

        [TestMethod]
        public void GetDroppedApplications_When_TableHasData_Then_ReturnOkResult()
        {
            _mockWFMHandlerSync.Setup(x => x.GetDroppedApplications()).Returns(Task.FromResult(GetDroppedApplications()));
            var res = _wfmHandlerController.GetDroppedApplications().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetDroppedApplications_When_TableHasNoData_ReturnsNotFoundResult()
        {
            List<DroppedApplications>? droppedApplications = null;
            _mockWFMHandlerSync.Setup(e => e.GetDroppedApplications()).ReturnsAsync(droppedApplications);
            var controller = new WFMHandlerController(_mockWFMHandlerSync.Object, _logger.Object, _mockEmployeeSync.Object);
            var result = await controller.GetDeclinedAndDroppedComments();
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        private List<DroppedApplications> GetDroppedApplications()
        {
            var droppedApplications = new List<DroppedApplications>
            {
                new DroppedApplications
                {
                    RrId= 16494,
                    RRNumber = "RR/660/2023",
                    ProjectName = "CALYX - MI Backbone Execution Phase",
                    RRAging = 206,
                    EmployeeName = "Manoj Kumar M",
                    EmployeeId = "INEMP6522",
                    RRSkills = "QA Manual",
                    Location = "India",
                    CityName = "Bangalore",
                    Experience = 4,
                    AppliedOn = DateTime.Now,
                    DroppedReason = "Client Rejection",
                    AdditionalComments = "test cost comment",
                    Status = "Dropped"
                },
                new DroppedApplications
                {
                    RrId= 16494,
                    RRNumber = "RR/660/2023",
                    ProjectName = "CALYX - MI Backbone Execution Phase",
                    RRAging = 206,
                    EmployeeName = " Raj Kumar",
                    EmployeeId = "INEMP7777",
                    RRSkills = "QA Manual",
                    Location = "India",
                    CityName = "Bangalore",
                    Experience = 10,
                    AppliedOn = DateTime.Now,
                    DroppedReason = "Client Rejection",
                    AdditionalComments = "test",
                    Status = "Dropped"
                },
            };
            return droppedApplications;
        }

        #endregion

        #region GetFutureAvailableResources

        [TestMethod]
        public void GetFutureAvailableResources_When_TableHasData_Then_ReturnOkResult()
        {
            _mockWFMHandlerSync.Setup(x => x.GetFutureAvailableResources()).Returns(Task.FromResult(GetFutureAvailableResources()));
            var res = _wfmHandlerController.GetFutureAvailableResources().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetFutureAvailableResources_When_TableHasNoData_ReturnsNotFoundResult()
        {
            List<LaunchpadEmployee>? futureEmployees = null;
            _mockWFMHandlerSync.Setup(e => e.GetFutureAvailableResources()).ReturnsAsync(futureEmployees);
            var controller = new WFMHandlerController(_mockWFMHandlerSync.Object, _logger.Object, _mockEmployeeSync.Object);
            var result = await controller.GetFutureAvailableResources();
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        private List<LaunchpadEmployee> GetFutureAvailableResources()
        {
            List<LaunchpadEmployee> launchpadEmployees = new List<LaunchpadEmployee>();
            launchpadEmployees.Add(new LaunchpadEmployee()
            {
                Designation = "Associate Technical Lead",
                EmployeeEmailId = "A.Reddy@emids.com",
                EmployeeId = "INEMP5239",
                EmployeeName = "A Hema Kumar Reddy",
                EmployeeRole = "Developer",
                PrimarySkills = ".NET",
                SecondarySkills = "",
                ReportingManagerName = "Lipika  Gupta",
                AvailableAllocationPercentage = 100,
                Aging = 478,
                Studio = "connect",
                ReleaseStatus = "Confirmed",
                EmidsExperience = 10,
                ProfileCompleteness = 10
            });

            launchpadEmployees.Add(new LaunchpadEmployee()
            {
                Designation = "QA Lead",
                EmployeeEmailId = "Aakriti.Koul@emids.com",
                EmployeeId = "INEMP5435",
                EmployeeName = "Aakriti  Koul",
                EmployeeRole = "QA",
                PrimarySkills = "QA Automation",
                SecondarySkills = "",
                ReportingManagerName = "Dharmendra Kumar Singh",
                AvailableAllocationPercentage = 78,
                Aging = 49,
                Studio = "connect",
                ReleaseStatus = "Confirmed",
                EmidsExperience = 12,
                ProfileCompleteness = 55
            });

            launchpadEmployees.Add(new LaunchpadEmployee()
            {
                Designation = "QA",
                EmployeeEmailId = "Aa@emids.com",
                EmployeeId = "INEMP5555",
                EmployeeName = "Aakriti  Koul",
                EmployeeRole = "QA",
                PrimarySkills = "QA Automation",
                SecondarySkills = "",
                ReportingManagerName = "Dharmendra Kumar Singh",
                AvailableAllocationPercentage = 78,
                Aging = 49,
                Studio = "connect",
                ReleaseStatus = "Confirmed",
                EmidsExperience = 12,
                ProfileCompleteness = 66
            });
            return launchpadEmployees;
        }

        #endregion
    }
}

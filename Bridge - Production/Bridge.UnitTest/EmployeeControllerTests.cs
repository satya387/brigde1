using Bridge.API.Controllers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Bridge.UnitTest
{
    [TestClass]
    public class EmployeeControllerTests
    {
        private readonly Mock<IEmployeeSync> _mockEmployeeSync;
        private readonly EmployeeController _employeeController;
        private readonly Mock<ILogger<EmployeeController>> _logger = new Mock<ILogger<EmployeeController>>();

        public EmployeeControllerTests()
        {
            _mockEmployeeSync = new Mock<IEmployeeSync>();
            _employeeController = new EmployeeController(_mockEmployeeSync.Object, _logger.Object);
        }

        [TestMethod]
        [DataRow(null)]
        public async Task GetEmployees_When_LocationIsNull_Then_ReturnsEmpty(string location)
        {
            var res = await _employeeController.GetEmployees(location: location);

            Assert.IsInstanceOfType(res.Result, typeof(NoContentResult));
        }

        [TestMethod]
        [DataRow("INDIA")]
        public async Task GetEmployees_When_LocationIsValid_Then_ReturnsValidList(string location)
        {

            _mockEmployeeSync.Setup(x => x.GetEmployees(location)).Returns(Task.FromResult(GetEmployeesMockByIteration(5)));

            var res = await _employeeController.GetEmployees(location: location);

            Assert.IsInstanceOfType(res.Result, typeof(OkObjectResult));
        }

        #region

        private List<Employee> GetEmployeesMockByIteration(int iteration)
        {
            var employees = new List<Employee>();
            for (var i = 0; i < iteration; i++)
            {
                employees.Add(createEmployeeMock(i));
            }
            return employees;
        }
        private Employee createEmployeeMock(int iteration)
        {
            return new Employee
            {
                EmidsUniqueId = "INEMP00" + iteration,
                EmployeeName = "Test ABC" + iteration,
                EmailId = "Test@abc.com" + iteration
            };
        }
        #endregion

        #region Apply Opportunity 

        [TestMethod]
        public void ApplyOpportunity_When_EmployeeIdIsNull_Then_ReturnBadRequest()
        {
            ApplyOpportunityRequest applyOpportunityRequest = new ApplyOpportunityRequest()
            {
                EmployeeId = null,
                ResourceRequestId = 0
            };

            var res = _employeeController.ApplyOpportunity(applyOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void ApplyOpportunity_When_ResourceRequestIdIsBlank_Then_ReturnBadRequest()
        {
            ApplyOpportunityRequest applyOpportunityRequest = new ApplyOpportunityRequest()
            {
                EmployeeId = "",
                ResourceRequestId = 0
            };

            var res = _employeeController.ApplyOpportunity(applyOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void ApplyOpportunity_When_ResourceRequestIdIsZero_Then_ReturnBadRequest()
        {
            ApplyOpportunityRequest applyOpportunityRequest = new ApplyOpportunityRequest()
            {
                EmployeeId = "INEMP6700",
                ResourceRequestId = 0
            };

            var res = _employeeController.ApplyOpportunity(applyOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void ApplyOpportunity_When_OpportunityAlreadyApplied_Then_ReturnConflict()
        {
            ApplyOpportunityRequest applyOpportunityRequest = new ApplyOpportunityRequest()
            {
                EmployeeId = "INEMP6700",
                ResourceRequestId = 1
            };

            _mockEmployeeSync.Setup(x => x.ApplyOpportunity(applyOpportunityRequest)).Returns(Task.FromResult<int?>(StatusCodes.Status409Conflict));

            var res = _employeeController.ApplyOpportunity(applyOpportunityRequest).Result;

            Assert.IsInstanceOfType(res, typeof(ConflictObjectResult));
        }

        [TestMethod]
        public void ApplyOpportunity_When_ErrorInApplyingOpportunity_Then_ReturnError()
        {
            ApplyOpportunityRequest applyOpportunityRequest = new ApplyOpportunityRequest()
            {
                EmployeeId = "INEMP6700",
                ResourceRequestId = 2
            };

            _mockEmployeeSync.Setup(x => x.ApplyOpportunity(applyOpportunityRequest)).Returns(Task.FromResult<int?>(StatusCodes.Status500InternalServerError));

            ObjectResult res = (ObjectResult)_employeeController.ApplyOpportunity(applyOpportunityRequest).Result;

            Assert.AreEqual(res.StatusCode, StatusCodes.Status500InternalServerError);
        }

        [TestMethod]
        public void ApplyOpportunity_When_OpportunityAppliedSuccessfully_ReturnOkResult()
        {
            ApplyOpportunityRequest applyOpportunityRequest = new ApplyOpportunityRequest()
            {
                EmployeeId = "INEMP6700",
                ResourceRequestId = 2
            };
            _mockEmployeeSync.Setup(x => x.ApplyOpportunity(applyOpportunityRequest)).Returns(Task.FromResult<int?>(StatusCodes.Status200OK));

            var res = (OkResult)_employeeController.ApplyOpportunity(applyOpportunityRequest).Result;

            Assert.IsInstanceOfType(res, typeof(OkResult));
        }


        #endregion

        #region Get Self Applied Opportunity

        [TestMethod]
        [DataRow(null)]
        public void GetEmployeeAppliedOpportunities_When_EmployeeIdIsNull_Then_ReturnBadRequest(string employeeId)
        {
            var res = _employeeController.GetSelfAppliedOpportunities(employeeId).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        [DataRow("INEMP6700")]
        public void GetEmployeeAppliedOpportunities_When_NoJobsApplied_Then_ReturnOkWithCount(string employeeId)
        {
            _mockEmployeeSync.Setup(x => x.GetSelfAppliedOpportunities(employeeId)).Returns(Task.FromResult(new List<AppliedOpportunity>()));
            var res = (OkObjectResult)_employeeController.GetSelfAppliedOpportunities(employeeId).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
            Assert.IsNotNull(res);
            Assert.AreEqual(res.StatusCode, StatusCodes.Status200OK);
            Assert.AreEqual((res.Value as List<AppliedOpportunity>).Count, 0);
        }

        [TestMethod]
        [DataRow("INEMP6700")]
        public void GetEmployeeAppliedOpportunities_When_TwoJobApplied_Then_ReturnOkResultWithCount(string employeeId)
        {
            _mockEmployeeSync.Setup(x => x.GetSelfAppliedOpportunities(employeeId)).Returns(Task.FromResult(GetEmployeeViewAppliedOpportunities()));
            var res = (OkObjectResult)_employeeController.GetSelfAppliedOpportunities(employeeId).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
            Assert.IsNotNull(res);
            Assert.AreEqual(res.StatusCode, StatusCodes.Status200OK);
            Assert.AreEqual((res.Value as List<AppliedOpportunity>).Count, 2);
        }

        private List<AppliedOpportunity> GetEmployeeViewAppliedOpportunities()
        {
            var list = new List<AppliedOpportunity>();
            list.Add(new AppliedOpportunity()
            {
                JobAppliedOn = DateTime.Now.AddDays(-7),
                JobTitle = "Architect",
                Location = "Bangalore",
                PrimarySkill = ".Net",
                Project = "Claris",
                ProjectStartDate = new DateTime(2023, 12, 1),
                RequiredExperience = 12,
                RRId = 15,
                RRNumber = "RR/1625/2017",
                SecondarySkill = "Azure",
                WorkLocation = "Bangalore",
                AvailableAllocationPercentage = 100
            });
            list.Add(new AppliedOpportunity()
            {
                JobAppliedOn = DateTime.Now.AddDays(-17),
                JobTitle = "SSE",
                Location = "Noida",
                PrimarySkill = "Azure",
                Project = "Vantage",
                ProjectStartDate = new DateTime(2023, 08, 15),
                RequiredExperience = 7,
                RRId = 4,
                RRNumber = "RR/1224/2023",
                SecondarySkill = "angular",
                WorkLocation = "Noida",
                AvailableAllocationPercentage = 100
            });
            return list;
        }


        #endregion

        #region Get Launchpad Employees 

        [TestMethod]
        [DataRow(null)]
        public void GetLaunchpadEmployees_When_LocationIsNull_Then_ReturnBadRequest(string location)
        {
            var res = _employeeController.GetLaunchpadEmployees(location).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        [DataRow("Noida")]
        public void GetLaunchpadEmployees_When_NoEmployeesFound_Then_ReturnNotFound(string location)
        {
            _mockEmployeeSync.Setup(x => x.GetLaunchpadEmployees()).Returns(Task.FromResult<List<LaunchpadEmployee>?>(null));

            var res = _employeeController.GetLaunchpadEmployees(location).Result;

            Assert.IsInstanceOfType(res, typeof(NoContentResult));
        }

        [TestMethod]
        [DataRow("india")]
        public void GetLaunchpadEmployees_When_ExceptionOccurs_Then_ReturnError(string location)
        {
            _mockEmployeeSync.Setup(x => x.GetLaunchpadEmployees()).Callback(() => throw new ArgumentException());

            var res = (ObjectResult)_employeeController.GetLaunchpadEmployees(location).Result;

            Assert.IsInstanceOfType(res, typeof(ObjectResult));
            Assert.AreEqual(res.StatusCode, StatusCodes.Status500InternalServerError);
        }

        [TestMethod]
        [DataRow("india")]
        public void GetLaunchpadEmployees_EmployeesFound(string location)
        {
            _mockEmployeeSync.Setup(x => x.GetLaunchpadEmployees()).Returns(Task.FromResult(GetLaunchpadEmployees()));

            var res = (OkObjectResult)_employeeController.GetLaunchpadEmployees(location).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
            Assert.IsNotNull(res);
            Assert.AreEqual(res.StatusCode, StatusCodes.Status200OK);
            Assert.IsTrue((res.Value as List<LaunchpadEmployee>).Count > 0);
        }

        private List<LaunchpadEmployee> GetLaunchpadEmployees()
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
                Studio = "connect"
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
                Studio = "connect"
            });
            return launchpadEmployees;
        }

        #endregion

        #region Get Employee Applied Opportunities For Managers

        [TestMethod]
        [DataRow(null)]
        [DataRow("")]
        public void GetEmployeeAppliedOpportunitiesForManager_When_ManagerIdIsNull_Then_ReturnBadResult(string managerId)
        {
            var res = _employeeController.GetEmployeeAppliedOpportunitiesForManager(managerId).Result;

            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        [DataRow("USEMP001")]
        public void GetEmployeeAppliedOpportunitiesForManager_When_NoJobsAppliedUnderManager_Then_ReturnNoCount(string managerId)
        {
            _mockEmployeeSync.Setup(x => x.GetEmployeeAppliedOpportunitiesForManager(managerId)).Returns(Task.FromResult(new List<ApplicationReviewResponse>()));

            var res = (OkObjectResult)_employeeController.GetEmployeeAppliedOpportunitiesForManager(managerId).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
            Assert.IsNotNull(res);
            Assert.AreEqual(res.StatusCode, StatusCodes.Status200OK);
            Assert.AreEqual((res.Value as List<ApplicationReviewResponse>).Count, 0);
        }

        [TestMethod]
        [DataRow("USEMP001")]
        public void GetEmployeeAppliedOpportunitiesForManager_When_NoJobsAppliedUnderManager_Then_ReturnNoCount1(string managerId)
        {
            _mockEmployeeSync.Setup(x => x.GetEmployeeAppliedOpportunitiesForManager(managerId)).Returns(Task.FromResult(new List<ApplicationReviewResponse>()));

            var res = (OkObjectResult)_employeeController.GetEmployeeAppliedOpportunitiesForManager(managerId).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
            Assert.IsNotNull(res);
            Assert.AreEqual(res.StatusCode, StatusCodes.Status200OK);
            Assert.AreEqual((res.Value as List<ApplicationReviewResponse>).Count, 0);
        }

        [TestMethod]
        [DataRow("USEMP001")]
        public void GetEmployeeAppliedOpportunitiesForManager_one_Job_Applied_Under_Manager(string managerId)
        {
            _mockEmployeeSync.Setup(x => x.GetEmployeeAppliedOpportunitiesForManager(managerId)).Returns(Task.FromResult(GetManagerViewAppliedJobs()));

            var res = (OkObjectResult)_employeeController.GetEmployeeAppliedOpportunitiesForManager(managerId).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
            Assert.IsNotNull(res);
            Assert.AreEqual(res.StatusCode, StatusCodes.Status200OK);
            Assert.AreEqual((res.Value as List<ApplicationReviewResponse>).Count, 1);
        }

        private List<ApplicationReviewResponse> GetManagerViewAppliedJobs()
        {
            var list = new List<ApplicationReviewResponse>();
            list.Add(new ApplicationReviewResponse()
            {
                JobTitle = "Architect",
                Location = "Bangalore",
                PrimarySkill = ".Net",
                Project = "Claris",
                ProjectStartDate = new DateTime(2023, 12, 1),
                RequiredExperience = 12,
                RRId = 15,
                RRNumber = "RR/1625/2017",
                SecondarySkill = "Azure",
                WorkLocation = "Bangalore",
                EmployeeApplications = GetEmployeeApplications()
            }); ;
            return list;
        }

        private List<EmployeeApplication> GetEmployeeApplications()
        {
            var employeeApplications = new List<EmployeeApplication>();
            employeeApplications.Add(new EmployeeApplication()
            {
                EmployeeEmailId = "Test@emids.com",
                EmployeeName = "test test",
                EmployeeUniqueId = "INEMP0001",
                JobAppliedOn = DateTime.Now.AddDays(-7),
                AvailableAllocationPercentage = 100,
                EmployeeDesignation = "sse"
            });
            employeeApplications.Add(new EmployeeApplication()
            {
                EmployeeEmailId = "Test2@emids.com",
                EmployeeName = "test",
                EmployeeUniqueId = "INEMP0002",
                JobAppliedOn = DateTime.Now.AddDays(-3),
                AvailableAllocationPercentage = 100,
                EmployeeDesignation = "sse"
            });
            employeeApplications.Add(new EmployeeApplication()
            {
                EmployeeEmailId = "Test2@emids.com",
                EmployeeName = "test test",
                EmployeeUniqueId = "INEMP0022",
                JobAppliedOn = DateTime.Now.AddDays(-3),
                AvailableAllocationPercentage = 10,
                EmployeeDesignation = "sse"
            });
            return employeeApplications;
        }

        #endregion

        #region Withdraw Applied Opportunity


        [TestMethod]
        public void WithdrawAppliedOpportunity_When_EmployeeIdIsNull_Then_ReturnBadRequest()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = null,
                ResourceRequestId = 0
            };

            var res = _employeeController.WithdrawAppliedOpportunity(withdrawOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void WithdrawAppliedOpportunity_When_ResourceRequestIdIsBlank_Then_ReturnBadRequest()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "",
                ResourceRequestId = 0
            };

            var res = _employeeController.WithdrawAppliedOpportunity(withdrawOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void WithdrawAppliedOpportunity_When_ResourceRequestIdIsZero_Then_ReturnBadRequest()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP6700",
                ResourceRequestId = 0
            };

            var res = _employeeController.WithdrawAppliedOpportunity(withdrawOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void WithdrawAppliedOpportunity_When_ErrorInApplyingOpportunity_Then_ReturnError()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP6700",
                ResourceRequestId = 2
            };

            _mockEmployeeSync.Setup(x => x.WithdrawAppliedOpportunity(withdrawOpportunityRequest, false)).Returns(Task.FromResult<int?>(StatusCodes.Status500InternalServerError));

            ObjectResult res = (ObjectResult)_employeeController.WithdrawAppliedOpportunity(withdrawOpportunityRequest).Result;

            Assert.AreEqual(res.StatusCode, StatusCodes.Status500InternalServerError);
        }

        [TestMethod]
        public void WithdrawAppliedOpportunity_When_OpportunityAppliedSuccessfully_ReturnOkResult()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP6700",
                ResourceRequestId = 2
            };
            _mockEmployeeSync.Setup(x => x.WithdrawAppliedOpportunity(withdrawOpportunityRequest, false)).Returns(Task.FromResult<int?>(StatusCodes.Status200OK));

            var res = (OkResult)_employeeController.WithdrawAppliedOpportunity(withdrawOpportunityRequest).Result;

            Assert.IsInstanceOfType(res, typeof(OkResult));
        }

        #endregion

        #region Disapprove Applied Opportunity By Manager


        [TestMethod]
        public void DisapproveAppliedOpportunityByManager_When_EmployeeIdIsNull_Then_ReturnBadRequest()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = null,
                ResourceRequestId = 0,
                DisapprovedBy = "US001",
                ReasonForDisapprove = "NA"
            };

            var res = _employeeController.DisapproveAppliedOpportunityByManager(withdrawOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void DisapproveAppliedOpportunityByManager_When_ReasonForDisapproveIsNullOrEmpty_Then_ReturnBadRequest()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP001",
                ResourceRequestId = 100,
                DisapprovedBy = "US001",
                ReasonForDisapprove = ""
            };

            var res = _employeeController.DisapproveAppliedOpportunityByManager(withdrawOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void DisapproveAppliedOpportunityByManager_When_DisapproveByNullOrEmpty_Then_ReturnBadRequest()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP001",
                ResourceRequestId = 100,
                DisapprovedBy = null,
                ReasonForDisapprove = "NA"
            };

            var res = _employeeController.DisapproveAppliedOpportunityByManager(withdrawOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void DisapproveAppliedOpportunityByManager_When_ResourceRequestIdIsZero_Then_ReturnBadRequest()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP001",
                ResourceRequestId = 0,
                DisapprovedBy = "US001",
                ReasonForDisapprove = "NA"
            };

            var res = _employeeController.DisapproveAppliedOpportunityByManager(withdrawOpportunityRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void DisapproveAppliedOpportunityByManager_When_ErrorInDisapprovingOpportunity_Then_ReturnError()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP001",
                ResourceRequestId = 155,
                DisapprovedBy = "US001",
                ReasonForDisapprove = "NA"
            };

            _mockEmployeeSync.Setup(x => x.WithdrawAppliedOpportunity(withdrawOpportunityRequest, true)).Returns(Task.FromResult<int?>(StatusCodes.Status500InternalServerError));

            ObjectResult res = (ObjectResult)_employeeController.DisapproveAppliedOpportunityByManager(withdrawOpportunityRequest).Result;

            Assert.AreEqual(res.StatusCode, StatusCodes.Status500InternalServerError);
        }

        [TestMethod]
        public void DisapproveAppliedOpportunityByManager_When_OpportunityToDisapproveNotFound_Then_ReturnNotFoundResult()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP001",
                ResourceRequestId = 100,
                DisapprovedBy = "US012",
                ReasonForDisapprove = "NA"
            };
            _mockEmployeeSync.Setup(x => x.WithdrawAppliedOpportunity(withdrawOpportunityRequest, true)).Returns(Task.FromResult<int?>(StatusCodes.Status404NotFound));

            var res = (ActionResult)_employeeController.DisapproveAppliedOpportunityByManager(withdrawOpportunityRequest).Result;

            Assert.IsInstanceOfType(res, typeof(NoContentResult));
        }

        [TestMethod]
        public void DisapproveAppliedOpportunityByManager_When_WithdrawOpportunityAppliedSuccessfully_Then_ReturnOkResult()
        {
            WithdrawOpportunityRequest withdrawOpportunityRequest = new WithdrawOpportunityRequest()
            {
                EmployeeId = "INEMP001",
                ResourceRequestId = 100,
                DisapprovedBy = "US012",
                ReasonForDisapprove = "NA"
            };
            _mockEmployeeSync.Setup(x => x.WithdrawAppliedOpportunity(withdrawOpportunityRequest, true)).Returns(Task.FromResult<int?>(StatusCodes.Status200OK));

            var res = (OkResult)_employeeController.DisapproveAppliedOpportunityByManager(withdrawOpportunityRequest).Result;

            Assert.IsInstanceOfType(res, typeof(OkResult));
        }

        #endregion

        #region Disapprove Applied Opportunity By Manager


        [TestMethod]
        public void ApproveAppliedOpportunityByManager_When_EmployeeIdIsNull_Then_ReturnBadRequest()
        {
            var employeeOpportunity = new EmployeeOpportunity()
            {
                EmployeeId = null,
                RrId = 1,
                AllocationPercentage = 100,
                AllocationStartDate = DateTime.Now
            };
            var res = _employeeController.ApproveAppliedOpportunityByManager(employeeOpportunity).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void ApproveAppliedOpportunityByManager_When_AllocationPercentageIsNull_Then_ReturnBadRequest()
        {
            var employeeOpportunity = new EmployeeOpportunity()
            {
                EmployeeId = "TEST",
                RrId = 1,
                AllocationPercentage = null,
                AllocationStartDate = DateTime.Now
            };
            var res = _employeeController.ApproveAppliedOpportunityByManager(employeeOpportunity).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void ApproveAppliedOpportunityByManager_When_AllocationStartDateIsNull_Then_ReturnBadRequest()
        {
            var employeeOpportunity = new EmployeeOpportunity()
            {
                EmployeeId = "TEST",
                RrId = 1,
                AllocationPercentage = 100,
                AllocationStartDate = null
            };
            var res = _employeeController.ApproveAppliedOpportunityByManager(employeeOpportunity).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void ApproveAppliedOpportunityByManager_When_RrIdIsZero_Then_ReturnBadRequest()
        {
            var employeeOpportunity = new EmployeeOpportunity()
            {
                EmployeeId = "TEST",
                RrId = 0,
                AllocationPercentage = 100,
                AllocationStartDate = DateTime.Now
            };
            var res = _employeeController.ApproveAppliedOpportunityByManager(employeeOpportunity).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void ApproveAppliedOpportunityByManager_When_WithdrawOpportunityAppliedSuccessfully_Then_ReturnOkResult()
        {
            var employeeOpportunity = new EmployeeOpportunity()
            {
                EmployeeId = "INEMP001",
                RrId = 1,
                AllocationPercentage = 100,
                AdditionalComments = "TEST",
                AllocationStartDate = DateTime.Now
            };
            _mockEmployeeSync.Setup(x => x.ApproveAppliedOpportunity(employeeOpportunity)).Returns(Task.FromResult<int?>(StatusCodes.Status200OK));
            var res = (OkResult)_employeeController.ApproveAppliedOpportunityByManager(employeeOpportunity).Result;
            Assert.IsInstanceOfType(res, typeof(OkResult));
        }

        #endregion

        #region Get Employee Profile Details

        [TestMethod]
        [DataRow(null)]
        public void EmployeePrfileDetails_EmployeeId_IsNull(string employeeId)
        {
            var res = _employeeController.GetEmployeeProfileDetails(employeeId).Result;

            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        [DataRow("test")]
        public void EmployeePrfileDetails_EmployeeId_NotFound(string employeeId)
        {
            var res = _employeeController.GetEmployeeProfileDetails(employeeId).Result;

            Assert.IsInstanceOfType(res, typeof(NoContentResult));
        }

        [TestMethod]
        [DataRow("INEMP6700")]
        public void EmployeePrfileDetails_OkResult(string employeeId)
        {
            var employeeDetail = GetEmployeeProfileDetails();

            _mockEmployeeSync.Setup(x => x.GetEmployeeProfileDetails(employeeId)).Returns(Task.FromResult<Employee>(employeeDetail));

            var res = _employeeController.GetEmployeeProfileDetails(employeeId).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        [DataRow("INEMP6700")]
        public void EmployeePrfileDetails_Error(string employeeId)
        {

            _mockEmployeeSync.Setup(x => x.GetEmployeeProfileDetails(employeeId)).Callback(() => throw new NullReferenceException());

            var res = _employeeController.GetEmployeeProfileDetails(employeeId).Result;

            Assert.IsInstanceOfType(res, typeof(ObjectResult));
        }

        private Employee GetEmployeeProfileDetails()
        {
            var skills = new EmployeeSkillMatrix()
            {
                EmployeeId = "INEMP6700",
                PrimarySkills = ".Net"
            };
            var employeeProjects = new List<EmployeeProject>();
            employeeProjects.Add(new EmployeeProject()
            {
                Allocation = 100,
                AssignDate = new DateTime(2023, 03, 11),
                ProjectId = 23677,
                ProjectName = "Launchpad",
                ReleaseDate = new DateTime(2023, 12, 31),
            });

            employeeProjects.Add(new EmployeeProject()
            {
                Allocation = 100,
                AssignDate = new DateTime(2023, 02, 1),
                ProjectId = 23206,
                ProjectName = "Vantage",
                ReleaseDate = new DateTime(2023, 03, 10),
            });

            return new Employee()
            {
                AccountName = "Launchpad",
                BusinessLocation = "India",
                CurrentManagerId = "Amy Verghis",
                CurrentProject = "Launchpad",
                Designation = "SSE",
                EmailId = "test@emids.com",
                EmidsExperience = 50,
                EmidsUniqueId = "INEMP6700",
                EmployeeName = "Test Test",
                Location = "Bangalore",
                PastExperience = 44,
                PrimarySkills = ".Net",
                Role = "Developer",
                ReportingManagerName = "Amy Verghis",
                SkillMatrix = skills,
                EmployeeProjects = employeeProjects,
                AvailableAllocationPercentage = 100
            };
        }

        #endregion

        #region InitiateDiscussion


        [TestMethod]
        public void InitiateDiscussion_When_EmployeeIdIsNull_Then_ReturnBadRequest()
        {
            InitiateDiscussionRequest initiateDiscussionRequest = new InitiateDiscussionRequest()
            {
                EmployeeId = null,
                DiscussionDuration = 20,
                DiscussionStartTime = DateTime.UtcNow.AddDays(1),
                EmployeeMailId = "vivekj@emids.com",
                ManagerEmployeeMailId = "test@emids.com",
                Location = "bangalore",
                OptionalAttendees = null,
                ResourceRequestNumber = "RR/123",
                RrId = 12345
            };

            var res = _employeeController.InitiateDiscussion(initiateDiscussionRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void InitiateDiscussion_When_DiscussionStartTimeIsLess_Then_ReturnBadRequest()
        {
            InitiateDiscussionRequest initiateDiscussionRequest = new InitiateDiscussionRequest()
            {
                EmployeeId = "inemp5897",
                DiscussionDuration = 0,
                DiscussionStartTime = DateTime.UtcNow.AddDays(-1),
                EmployeeMailId = "vivekj@emids.com",
                ManagerEmployeeMailId = "test@emids.com",
                Location = "bangalore",
                OptionalAttendees = null,
                ResourceRequestNumber = "RR/123",
                RrId = 12345
            };

            var res = _employeeController.InitiateDiscussion(initiateDiscussionRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void InitiateDiscussion_When_DiscussionDurationIsZero_Then_ReturnBadRequest()
        {
            InitiateDiscussionRequest initiateDiscussionRequest = new InitiateDiscussionRequest()
            {
                EmployeeId = "inemp5897",
                DiscussionDuration = 0,
                DiscussionStartTime = DateTime.UtcNow.AddDays(1),
                EmployeeMailId = "vivekj@emids.com",
                ManagerEmployeeMailId = "test@emids.com",
                Location = "bangalore",
                OptionalAttendees = null,
                ResourceRequestNumber = "RR/123",
                RrId = 12345
            };

            var res = _employeeController.InitiateDiscussion(initiateDiscussionRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void InitiateDiscussion_When_EmployeeMailIdIsNull_Then_ReturnBadRequest()
        {
            InitiateDiscussionRequest initiateDiscussionRequest = new InitiateDiscussionRequest()
            {
                EmployeeId = "inemp5897",
                DiscussionDuration = 20,
                DiscussionStartTime = DateTime.UtcNow.AddDays(1),
                EmployeeMailId = "",
                ManagerEmployeeMailId = "test@emids.com",
                Location = "bangalore",
                OptionalAttendees = null,
                ResourceRequestNumber = "RR/123",
                RrId = 12345
            };

            var res = _employeeController.InitiateDiscussion(initiateDiscussionRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void InitiateDiscussion_When_ManagerEmployeeMailIdIsNull_Then_ReturnBadRequest()
        {
            InitiateDiscussionRequest initiateDiscussionRequest = new InitiateDiscussionRequest()
            {
                EmployeeId = "inemp5897",
                DiscussionDuration = 20,
                DiscussionStartTime = DateTime.UtcNow.AddDays(1),
                EmployeeMailId = "vivekj@emids.com",
                ManagerEmployeeMailId = "",
                Location = "bangalore",
                OptionalAttendees = null,
                ResourceRequestNumber = "RR/123",
                RrId = 12345
            };

            var res = _employeeController.InitiateDiscussion(initiateDiscussionRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void InitiateDiscussion_When_ResourceRequestNumerIsEmpty_Then_ReturnBadRequest()
        {
            InitiateDiscussionRequest initiateDiscussionRequest = new InitiateDiscussionRequest()
            {
                EmployeeId = "inemp5897",
                DiscussionDuration = 20,
                DiscussionStartTime = DateTime.UtcNow.AddDays(1),
                EmployeeMailId = "vivekj@emids.com",
                ManagerEmployeeMailId = "Test@emids.com",
                Location = "bangalore",
                OptionalAttendees = null,
                ResourceRequestNumber = "",
                RrId = 12345
            };

            var res = _employeeController.InitiateDiscussion(initiateDiscussionRequest).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void InitiateDiscussion_When_ErrorInIniatingDiscussion_Then_ReturnError()
        {
            InitiateDiscussionRequest initiateDiscussionRequest = new InitiateDiscussionRequest()
            {
                EmployeeId = "inemp5897",
                DiscussionDuration = 20,
                DiscussionStartTime = DateTime.UtcNow.AddDays(1),
                EmployeeMailId = "vivekj@emids.com",
                ManagerEmployeeMailId = "Test@emids.com",
                Location = "bangalore",
                OptionalAttendees = null,
                ResourceRequestNumber = "RR-123",
                RrId = 12345
            };

            _mockEmployeeSync.Setup(x => x.InitiateDiscussion(initiateDiscussionRequest)).Returns(Task.FromResult<int?>(StatusCodes.Status500InternalServerError));

            BadRequestResult res = (BadRequestResult)_employeeController.InitiateDiscussion(initiateDiscussionRequest).Result;

            Assert.AreEqual(res.StatusCode, StatusCodes.Status400BadRequest);
        }


        [TestMethod]
        public void InitiateDiscussion_When_InitiatedDiscussionSuccessfully_Then_ReturnOkResult()
        {
            InitiateDiscussionRequest initiateDiscussionRequest = new InitiateDiscussionRequest()
            {
                EmployeeId = "inemp5897",
                DiscussionDuration = 20,
                DiscussionStartTime = DateTime.UtcNow.AddDays(1),
                EmployeeMailId = "vivekj@emids.com",
                ManagerEmployeeMailId = "Test@emids.com",
                Location = "bangalore",
                OptionalAttendees = null,
                ResourceRequestNumber = "RR-123",
                RrId = 12345
            };

            _mockEmployeeSync.Setup(x => x.InitiateDiscussion(initiateDiscussionRequest)).Returns(Task.FromResult<int?>(StatusCodes.Status200OK));

            var res = (BadRequestResult)_employeeController.InitiateDiscussion(initiateDiscussionRequest).Result;

            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }


        #endregion

        #region GetDisapprovalReasons

        [TestMethod]
        public void GetDisapprovalReasons_When_TableHasData_Then_ReturnOkResult()
        {
            _mockEmployeeSync.Setup(x => x.GetDisapprovalReasons()).Returns(Task.FromResult(GetDisapprovalReasons()));
            var res = _employeeController.GetDisapprovalReasons().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetDisapprovalReasons_When_TableHasNoData_Then_ReturnsNotFoundResult()
        {
            List<DisapprovalReasons>? disapprovalReasons = null;
            _mockEmployeeSync.Setup(e => e.GetDisapprovalReasons()).ReturnsAsync(disapprovalReasons);
            var controller = new EmployeeController(_mockEmployeeSync.Object, _logger.Object);
            var result = await controller.GetDisapprovalReasons();
            Assert.IsNotNull(result);
        }

        private List<DisapprovalReasons> GetDisapprovalReasons()
        {
            var disapprovalReasons = new List<DisapprovalReasons>
            {
                new DisapprovalReasons { DisapprovalReason = "Client Rejection" },
                new DisapprovalReasons { DisapprovalReason = "Behaviour Rejection" },
                new DisapprovalReasons { DisapprovalReason = "Employee Self-rejection" },
                new DisapprovalReasons { DisapprovalReason = ".Net" }
            };
            return disapprovalReasons;
        }

        #endregion

        #region UpdateEmployeeWriteUp 

        [TestMethod]
        public void UpdateEmployeeWriteUp_When_MoldelIsNull_Then_ReturnBadRequest()
        {
            UpdateEmployeeWriteUp? updateEmployeeWriteUp = null;
            var res = _employeeController.UpdateEmployeeWriteUp(updateEmployeeWriteUp).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void UpdateEmployeeWriteUp_When_EmployeeIdInMoldelIsNull_Then_ReturnBadRequest()
        {
            UpdateEmployeeWriteUp updateEmployeeWriteUp = GetUpdateEmployeeWriteUpobj();
            updateEmployeeWriteUp.EmployeeId = null;

            var res = _employeeController.UpdateEmployeeWriteUp(updateEmployeeWriteUp).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void UpdateEmployeeWriteUp_When_UpdatedSuccessfully_Then_ReturnOkResult()
        {
            UpdateEmployeeWriteUp updateEmployeeWriteUp = GetUpdateEmployeeWriteUpobj();

            _mockEmployeeSync.Setup(x => x.UpdateEmployeeWriteUp(updateEmployeeWriteUp)).Returns(Task.FromResult<int?>(1));

            var res = _employeeController.UpdateEmployeeWriteUp(updateEmployeeWriteUp).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        private UpdateEmployeeWriteUp GetUpdateEmployeeWriteUpobj()
        {
            return new UpdateEmployeeWriteUp()
            {
                EmployeeId = "INEMP6700",
                EmployeeWriteup = "An Engineer by qualification, Ramkumar is part of the team working on developing applications and products as part of client projects."
            };
        }

        #endregion

        #region UpdateRoleAndResponsibilityOfEmployee 

        [TestMethod]
        public void UpdateRoleAndResponsibilityOfEmployee_When_ResourceAssignIdIsZero_Then_ReturnNoContentResult()
        {
            EmployeeAssignment updateRoleAndResponsibilityOfEmployee = GetUpdateRoleAndResponsibilityOfEmployeeObj();
            updateRoleAndResponsibilityOfEmployee.ResourceAssignId = 0;
            var res = _employeeController.UpdateRoleAndResponsibilityOfEmployee(updateRoleAndResponsibilityOfEmployee).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void UpdateRoleAndResponsibilityOfEmployee_When_ResourceAssignIdIsNull_Then_ReturnNoContentResult()
        {
            EmployeeAssignment updateRoleAndResponsibilityOfEmployee = GetUpdateRoleAndResponsibilityOfEmployeeObj();
            updateRoleAndResponsibilityOfEmployee.ResourceAssignId = null;

            var res = _employeeController.UpdateRoleAndResponsibilityOfEmployee(updateRoleAndResponsibilityOfEmployee).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void UpdateRoleAndResponsibilityOfEmployee_When_UpdatedSuccessfully_Then_ReturnOkResult()
        {
            EmployeeAssignment updateEmployeeWriteUp = GetUpdateRoleAndResponsibilityOfEmployeeObj();

            _mockEmployeeSync.Setup(x => x.UpdateRoleAndResponsibilityOfEmployee(updateEmployeeWriteUp)).Returns(Task.FromResult<int?>(1));

            var res = _employeeController.UpdateRoleAndResponsibilityOfEmployee(updateEmployeeWriteUp).Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        private EmployeeAssignment GetUpdateRoleAndResponsibilityOfEmployeeObj()
        {
            return new EmployeeAssignment()
            {
                EmidsUniqueId = "INEMP6700",
                ProjectId = 1234,
                ProjectRole = "SSE",
                KeyResponsibilities = "Dev Activities",
                Technologies = ".net, sql",
                ResourceAssignId = 1
            };
        }

        #endregion

        [TestMethod]
        public void GetOpportunityHistory_0_Error()
        {

            string  EmployeeID = "";
            var result = _employeeController.GetTalentHistory(EmployeeID).Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(400, ((StatusCodeResult)result).StatusCode);
        }

        [TestMethod]
        public void GetOpportunityHistory_RRID_Positive()
        {
            string EmployeeID = "INEMP6469";
            _mockEmployeeSync.Setup(x => x.GetTalentHistory(EmployeeID)).Returns(Task.FromResult(MockData.MockData.GetTalentHistoryResponse));
            var result = _employeeController.GetTalentHistory(EmployeeID).Result;
            Assert.IsNotNull(result);
            Assert.AreEqual(200, ((ObjectResult)result).StatusCode);
        }
    }
}
using Bridge.API.Controllers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Bridge.UnitTest
{
    [TestClass]
    public class FilterControllerTests
    {
        private readonly Mock<IFilterSync> _mockFilterSync;
        private readonly FilterController _filterController;
        private readonly Mock<ILogger<FilterController>> _logger = new Mock<ILogger<FilterController>>();

        public FilterControllerTests()
        {
            _mockFilterSync = new Mock<IFilterSync>();
            _filterController = new FilterController(_mockFilterSync.Object, _logger.Object);
        }

        #region Get Employee Search Filter

        [TestMethod]
        [DataRow(null)]
        [DataRow("")]
        public void GetEmployeeOpportunitySearchFilter_When_EmployeeIdIsNull_Then_ReturnBadRequest(string employeeId)
        {
            var res = _filterController.GetEmployeeOpportunitySearchFilter(employeeId).Result.Result;

            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        [DataRow("INEMP6700")]
        public void GetEmployeeOpportunitySearchFilter_When_FilterNotFound_Then_ReturnNotFound(string employeeId)
        {
            _mockFilterSync.Setup(x => x.GetEmployeeOpportunitySearchFilter(employeeId)).Returns(Task.FromResult<OpportunityFilter?>(null));

            var res = _filterController.GetEmployeeOpportunitySearchFilter(employeeId).Result.Result;

            Assert.IsInstanceOfType(res, typeof(NoContentResult));
        }

        [TestMethod]
        [DataRow("INEMP6700")]
        public void GetEmployeeOpportunitySearchFilter_When_OpportunityAppliedSuccessfully_Then_ReturnOkResult(string employeeId)
        {

            _mockFilterSync.Setup(x => x.GetEmployeeOpportunitySearchFilter(employeeId)).Returns(Task.FromResult<OpportunityFilter>(GetOpportunityFilterObj()));

            var res = _filterController.GetEmployeeOpportunitySearchFilter(employeeId).Result.Result;

            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }


        #endregion

        #region SaveEmployeeOpportunityFilter 

        [TestMethod]      
        public void SaveEmployeeOpportunityFilter_When_MoldelIsNull_Then_ReturnBadRequest()
        {
            OpportunityFilter? opportunityFilter = null;
            var res = _filterController.SaveEmployeeOpportunityFilter(opportunityFilter).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void SaveEmployeeOpportunityFilter_When_EmployeeIdInMoldelIsNull_Then_ReturnBadRequest()
        {
            OpportunityFilter opportunityFilter = GetOpportunityFilterObj();
            opportunityFilter.EmployeeId = null;

            var res = _filterController.SaveEmployeeOpportunityFilter(opportunityFilter).Result;
            Assert.IsInstanceOfType(res, typeof(BadRequestResult));
        }

        [TestMethod]
        public void SaveEmployeeOpportunityFilter_When_ErrorInSaving_Then_ReturnProblem()
        {
            OpportunityFilter opportunityFilter = GetOpportunityFilterObj();

            _mockFilterSync.Setup(x => x.SaveEmployeeOpportunityFilter(opportunityFilter)).Returns(Task.FromResult<int?>(StatusCodes.Status500InternalServerError));

            var res = (ObjectResult)_filterController.SaveEmployeeOpportunityFilter(opportunityFilter).Result;

            Assert.AreEqual(res.StatusCode, StatusCodes.Status500InternalServerError);
        }

        [TestMethod]
        public void SaveEmployeeOpportunityFilter_When_SavedSuccessfully_Then_ReturnOkResult()
        {
            OpportunityFilter opportunityFilter = GetOpportunityFilterObj();

            _mockFilterSync.Setup(x => x.SaveEmployeeOpportunityFilter(opportunityFilter)).Returns(Task.FromResult<int?>(StatusCodes.Status200OK));

            var res = (OkResult)_filterController.SaveEmployeeOpportunityFilter(opportunityFilter).Result;

            Assert.IsInstanceOfType(res, typeof(OkResult));
        }

        #endregion

        #region GetProjectsDetailsOfActiveRRs

        [TestMethod]
        public void GetProjectsDetailsOfActiveRRs_When_TableHasData_Then_ReturnOkResult()
        {
            _mockFilterSync.Setup(x => x.GetProjectsDetailsOfActiveRRs()).Returns(Task.FromResult(GetProjectsDetailsOfActiveRRs()));
            var res = _filterController.GetProjectsDetailsOfActiveRRs().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetProjectsDetailsOfActiveRRs_When_TableHasNoData_ReturnsNotFoundResult()
        {
            List<ProjectDetails>? projDetails = null;
            _mockFilterSync.Setup(e => e.GetProjectsDetailsOfActiveRRs()).ReturnsAsync(projDetails);
            var controller = new FilterController(_mockFilterSync.Object, _logger.Object);
            var result = await controller.GetProjectsDetailsOfActiveRRs();
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        private List<ProjectDetails> GetProjectsDetailsOfActiveRRs()
        {
            var projDetails = new List<ProjectDetails>
            {
                new ProjectDetails { ProjectId = 124, ProjectName = "CALYX - MI Backbone Execution Phase", ProjectRRCount = 3 },
                new ProjectDetails { ProjectId = 123, ProjectName = "CALYX - MI Backbone Execution Phase  - Ramp Up", ProjectRRCount = 4 },
                new ProjectDetails { ProjectId = 1145, ProjectName = "Greenway", ProjectRRCount = 3 },
                new ProjectDetails { ProjectId = 1898, ProjectName = "Atena", ProjectRRCount = 4 }
            };
            return projDetails;
        }

        #endregion

        private OpportunityFilter GetOpportunityFilterObj()
        {
            return new OpportunityFilter()
            {
                EmployeeId = "INEMP6700",
                MinExperienceInYears = 10,
                MaxExperienceInYears = 12,
                Id = 1,
                Location = "Bangalore",
                PrimarySkills = ".Net",
                Role = "Architect"
            };
        }
    }
}

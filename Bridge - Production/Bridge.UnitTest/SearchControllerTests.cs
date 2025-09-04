using Bridge.API.Controllers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Bridge.UnitTest
{
    [TestClass]
    public class SearchControllerTests
    {
        private readonly Mock<ISearchSync> _mockHomeSearchSvc;
        private readonly SearchController _homeSearchController;
        private readonly Mock<ILogger<SearchController>> _logger = new Mock<ILogger<SearchController>>();

        public SearchControllerTests()
        {
            _mockHomeSearchSvc = new Mock<ISearchSync>();
            _homeSearchController = new SearchController(_mockHomeSearchSvc.Object, _logger.Object);
        }

        #region GetHomeSearchDetails

        [TestMethod]
        public void GetHomeSearchRequestDetails_When_SearchElementIsEmpty_Then_ReturnsBadRequest()
        {
            SearchRequest homeSearchRequest = new SearchRequest()
            {
                SearchElement = "",
            };
            var result = _homeSearchController.GlobalSearch(homeSearchRequest).Result;
            Assert.IsInstanceOfType(result.Result, typeof(BadRequestResult));
        }

        [TestMethod]
        public void GetHomeSearchRequestDetails_When_SearchElementIsInvalid_Then_ReturnsNotFoundResult()
        {
            SearchRequest homeSearchRequest = new SearchRequest()
            {
                SearchElement = "^^^",
                IsManager = false,
                EmployeeId = "INEMP3146"
            };
            var result = _homeSearchController.GlobalSearch(homeSearchRequest).Result;
            Assert.IsInstanceOfType(result.Result, typeof(NoContentResult));
        }

        [TestMethod]
        public void GetHomeSearchRequestDetails_When_SearchElementIsIsValid_Then_ReturnsOkResult()
        {
            SearchRequest homeSearchRequest = new SearchRequest()
            {
                SearchElement = "RR/513/2023",
                IsManager = false,
                EmployeeId = "INEMP3146"
            };

            SearchResult homeSearchResult = GetHomeSearchDetails();
            _mockHomeSearchSvc.Setup(x => x.GlobalSearch(homeSearchRequest.SearchElement, homeSearchRequest.IsManager, homeSearchRequest.EmployeeId)).Returns(Task.FromResult(homeSearchResult));
            var result = _homeSearchController.GlobalSearch(homeSearchRequest).Result;
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        }

        private SearchResult GetHomeSearchDetails()
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

            SearchResult mockResult = new SearchResult()
            {
                EmployeeSearchResult = employeeHomeSearchResult,
                ResourceRequestSearchResult = resourceRequestSearch
            };

            return mockResult;
        }

        #endregion

    }
}
using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Interfaces;
using Moq;

namespace Bridge.UnitTest.ServiceTests
{
    public class SearchSyncTests
    {
        private readonly Mock<IEmployeeSync> _mockManagerDAO;
        private readonly SearchSync _ManagerSync;
        private readonly Mock<IResourceRequestSync> _resourceRequestSearch;
        public SearchSyncTests()
        {
            _mockManagerDAO = new Mock<IEmployeeSync>();
            _resourceRequestSearch = new Mock<IResourceRequestSync>();
            _ManagerSync = new SearchSync(_mockManagerDAO.Object, _resourceRequestSearch.Object);
        }

        [TestMethod]
        [DataRow("1")]
        public async Task GetManagerResources_EmployeeID_Exists(string employeeID)
        {
            _mockManagerDAO.Setup(x => x.EmployeeSearchData(employeeID)).Returns(Task.FromResult(MockData.MockData.GetHomeSearchDetails));
            var responses = await _ManagerSync.GlobalSearch("RI",true, "INEMP3146");         
            Assert.IsNull(responses);

        }
    }
}

using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Interfaces;
using Moq;

namespace Bridge.UnitTest.ServiceTests
{
    [TestClass]
    public class ManagerSyncTests
    {

        private readonly Mock<IManagerDAO> _mockManagerDAO;
        private readonly ManagerSync _ManagerSync; 
        public ManagerSyncTests()
        {
            _mockManagerDAO = new Mock<IManagerDAO>();
            _ManagerSync = new ManagerSync(_mockManagerDAO.Object);
        }

        [TestMethod]
        [DataRow("1")]
        public async Task GetManagerResources_EmployeeID_Exists(string employeeID)
        {
            _mockManagerDAO.Setup(x => x.GetManagerResources(employeeID)).Returns(Task.FromResult(MockData.MockData.ListManagerResourcess));
            var responses = await _ManagerSync.GetManagerResources(employeeID);
            _mockManagerDAO.Verify(mock => mock.GetManagerResources(employeeID), Times.Once());
            Assert.IsTrue(responses.Count > 0);
            
        }
        [TestMethod]
        [DataRow("123")]
        [ExpectedException(typeof(Exception), "Error")]
        public async Task GetManagerResources_EmployeeID_ExceptionTests(string employeeID)
        {
            _mockManagerDAO.Setup(x => x.GetManagerResources(employeeID)).Throws(new Exception("Error",new Exception("Internal Error")));            
            await  _ManagerSync.GetManagerResources(employeeID); 
        }

        [TestMethod]        
        public async Task GetEmployeeSummary_Valid_Tests()
        {
            var employeeID = "12";
           _mockManagerDAO.Setup(x => x.GetEmployeeSummary(employeeID)).Returns(Task.FromResult(MockData.MockData.GetEmployeeSummaryResponse));
            var responses = await _ManagerSync.GetEmployeeSummary(employeeID);
             _mockManagerDAO.Verify(mock => mock.GetEmployeeSummary(employeeID), Times.Once());
             Assert.IsNotNull(responses); 
        }

    }
}

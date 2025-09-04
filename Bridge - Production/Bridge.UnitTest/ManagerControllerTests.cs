using Bridge.API.Controllers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;


namespace Bridge.UnitTest
{
    [TestClass]
    public class ManagerControllerTests
    {
        private readonly Mock<IManagerSync> _mockManagerSync;
        private readonly ManagerController _employeeController;
        private readonly Mock<ILogger<ManagerController>> _logger = new Mock<ILogger<ManagerController>>();

        public ManagerControllerTests()
        {
            _mockManagerSync = new Mock<IManagerSync>();
            _employeeController = new ManagerController(_mockManagerSync.Object, _logger.Object);
        }
        # region GetManagerResources Tests
        [TestMethod]
        [DataRow("1")]
        public async Task GetManagerResources_EmployeeID_Exists(string employeeID)
        {
            _mockManagerSync.Setup(x => x.GetManagerResources(employeeID)).Returns(Task.FromResult(MockData.MockData.ListManagerResourcess));
            var responses = await _employeeController.GetManagerResources(employeeID);
            _mockManagerSync.Verify(mock => mock.GetManagerResources(employeeID), Times.Once());
            var res = ((Microsoft.AspNetCore.Mvc.ObjectResult)responses);
            Assert.AreEqual(200, res.StatusCode);
            var data = (List<Bridge.Infrastructure.Entities.ManagerResources>)res.Value;
            Assert.IsNotNull(data);
            Assert.IsTrue(data.Count > 0);
        }
        [TestMethod]
        [DataRow("")]
        public async Task GetManagerResources_EmployeeID_NOTExists(string employeeID)
        {
            _mockManagerSync.Setup(x => x.GetManagerResources(employeeID)).Returns(Task.FromResult(new List<Infrastructure.Entities.ManagerResources>()));
            var responses = await _employeeController.GetManagerResources(employeeID);
            var res = ((Microsoft.AspNetCore.Mvc.ObjectResult)responses);
            Assert.AreEqual(400, res.StatusCode);
            Assert.AreEqual("GetManagerResources: Invalid employeeId request.", res.Value);
        }

        [TestMethod]
        [DataRow("121")]
        public async Task GetManagerResources_EmployeeID_Exception(string employeeID)
        {
            _mockManagerSync.Setup(x => x.GetManagerResources(employeeID)).Throws(new Exception("Internal Error"));
            var responses = await _employeeController.GetManagerResources(employeeID);
            _mockManagerSync.Verify(mock => mock.GetManagerResources(employeeID), Times.Once());
            var res = ((Microsoft.AspNetCore.Mvc.ObjectResult)responses);
            Assert.AreEqual(500, res.StatusCode);
            Assert.AreEqual("An error occurred while processing your request.", res.Value);
        }
        #endregion

        #region GetEmployeeSummary

        [TestMethod]
         
        public async Task GetEmployeeSummary_EmployeeID_Exists()
        {
            var employeeID = "12";
          _mockManagerSync.Setup(x => x.GetEmployeeSummary(employeeID)).Returns(Task.FromResult(MockData.MockData.GetEmployeeSummaryResponse));
            var responses = await _employeeController.GetEmployeeSummary(employeeID);
            _mockManagerSync.Verify(mock => mock.GetEmployeeSummary(employeeID), Times.Once());
             var res = (Microsoft.AspNetCore.Mvc.OkObjectResult)responses;
             Assert.AreEqual(200, res.StatusCode);
             Assert.IsTrue( ((EmployeeSummaryResponse)res.Value).EmployeeSummary.Count>0);
             Assert.IsTrue(((EmployeeSummaryResponse)res.Value).ManagerSummary.Count > 0);

        }


        [TestMethod]

        public async Task GetEmployeeSummary_EmployeeID_Exception()
        {
            var employeeID = "12";
            _mockManagerSync.Setup(x => x.GetEmployeeSummary(employeeID)).Throws<Exception>();
            var responses = await _employeeController.GetEmployeeSummary(employeeID);
            _mockManagerSync.Verify(mock => mock.GetEmployeeSummary(employeeID), Times.Once());
             var res = (Microsoft.AspNetCore.Mvc.ObjectResult)responses;
             Assert.AreEqual(500, res.StatusCode);
             Assert.AreEqual("Internal server error", res.Value);

        }
        #endregion
    }
}

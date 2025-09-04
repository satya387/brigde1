using Bridge.API.DAO;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.UnitTest.ServiceTests
{
    [TestClass]
    public class ManagerDAOTests
    {
        private readonly Mock<IManagerDAO> _mockManagerDAO;
        private readonly ManagerDAO _ManagerSync;
        private readonly Mock<ILogger<ManagerDAO>> _logger = new Mock<ILogger<ManagerDAO>>();
        private readonly Mock<IConfiguration> _configuration;
        private readonly Mock<ISyncProvider> _syncProvider;
        
        public ManagerDAOTests()
        {
            _mockManagerDAO = new Mock<IManagerDAO>();
            _configuration = new Mock<IConfiguration>();
            _syncProvider = new Mock<ISyncProvider>();
            _ManagerSync = new ManagerDAO(_configuration.Object, _syncProvider.Object, _logger.Object);
        }

        [TestMethod]
        [DataRow("1")]
        public async Task GetManagerResources_EmployeeID_Exists(string employeeID)
        {
            _syncProvider.Setup(x => x.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>())).Returns(Task.FromResult(MockData.MockData.DataTableManagerResourcess));
            var responses = await _ManagerSync.GetManagerResources(employeeID);
            _syncProvider.Verify(mock => mock.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>()), Times.Once());
            Assert.IsTrue(responses.Count > 0); 
        }

        [TestMethod]
        [DataRow("112")]
        [ExpectedException(typeof(Exception), "Error")]
        public async Task GetManagerResources_EmployeeID_Exists_Exceptions(string employeeID)
        {
            _syncProvider.Setup(x => x.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>())).Throws(new Exception("Error"));
           await _ManagerSync.GetManagerResources(employeeID); 
        }

        
        [TestMethod]
        public async Task GetEmployeeSummary_Valid_Tests()
        {
            var employeeID = "12";
            _syncProvider.Setup(x => x.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>())).Returns(Task.FromResult(MockData.MockData.DataTableManagerResourcess));
            _mockManagerDAO.Setup(x => x.GetEmployeeSummary(employeeID)).Returns(Task.FromResult(MockData.MockData.GetEmployeeSummaryResponse));
            var responses = await _ManagerSync.GetEmployeeSummary(employeeID);
             Assert.IsNotNull(responses);
        }

        [TestMethod]        
        public async Task GetEmployeeSummary_Valid_Tests_Exception()
        {
            var employeeID = "12";
            _syncProvider.Setup(x => x.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>())).Throws(new Exception("Error")); 
             var responses = await _ManagerSync.GetEmployeeSummary(employeeID);
             Assert.IsNull(responses);
        }
    }
}

using Bridge.API.DAO;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;

namespace Bridge.UnitTest.ServiceTests
{
    [TestClass]
    public class ResourceRequestDAOTests
    {        
        private readonly ResourceRequestDAO _ResourceRequestDAO;
        private readonly Mock<ILogger<ResourceRequestDAO>> _logger = new Mock<ILogger<ResourceRequestDAO>>();
        private readonly Mock<IConfiguration> _configuration;
        private readonly Mock<ISyncProvider> _syncProvider;        
        public ResourceRequestDAOTests()
        {
           
            _configuration = new Mock<IConfiguration>();
            _syncProvider = new Mock<ISyncProvider>();
            _ResourceRequestDAO = new ResourceRequestDAO(_configuration.Object, _syncProvider.Object, _logger.Object);
        } 
        [TestMethod]
        [DataRow("112")]
        [ExpectedException(typeof(Exception), "Error")]
        public async Task GetManagerResources_EmployeeID_Exists_Exceptions(string employeeID)
        {
            _syncProvider.Setup(x => x.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>())).Throws(new Exception("Error"));
            var responses= await _ResourceRequestDAO.GetActiveResourceRequestsForManager(employeeID); 
        }

        
        [TestMethod]
        public async Task GetActiveResourceRequestsForManager_Valid_Tests()
        {
            var manageremployeeID = "12";
            _syncProvider.Setup(x => x.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>())).Returns(Task.FromResult(MockData.MockData.DataTableManagerResourcess));
            var responses = await _ResourceRequestDAO.GetActiveResourceRequestsForManager(manageremployeeID);
            Assert.IsNotNull(responses);
        }

         
    }
}

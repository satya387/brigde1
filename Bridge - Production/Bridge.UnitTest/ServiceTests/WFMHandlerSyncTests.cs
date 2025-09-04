using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.UnitTest.ServiceTests
{
    [TestClass]
    public class WFMHandlerSyncTests
    {
        private readonly Mock<IWFMHandlerDAO> _mockManagerDAO;
        private readonly WFMHandlerSync _ManagerSync;
        public WFMHandlerSyncTests()
        {
            _mockManagerDAO = new Mock<IWFMHandlerDAO>();
            _ManagerSync = new WFMHandlerSync(_mockManagerDAO.Object);
        }

        [TestMethod]         
        public async Task GetManagerResources_EmployeeID_Exists()
        {
            _mockManagerDAO.Setup(x => x.SaveResourceRequestsComments(It.IsAny<ResourceRequestsComments>())).Returns(Task.FromResult(1));
            var responses = await _ManagerSync.SaveResourceRequestsComments(MockData.MockData.ResourceRequestsComments);            
            _mockManagerDAO.Verify(x => x.SaveResourceRequestsComments(It.IsAny<ResourceRequestsComments>()), Times.Once());
            Assert.IsTrue(responses > 0);

        }

        [TestMethod]
        public async Task GetResourceComments_Exists()
        {
            int rrNumber = 1;
            _mockManagerDAO.Setup(x => x.GetResourceComments(rrNumber)).Returns(Task.FromResult(new List<ResourceRequestsComments> {
            MockData.MockData.ResourceRequestsComments
            }));
            var responses = await _ManagerSync.GetResourceComments(rrNumber);
            _mockManagerDAO.Verify(x => x.GetResourceComments(rrNumber), Times.Once());
            Assert.IsTrue(responses.Count > 0);

        }

        
    }
}

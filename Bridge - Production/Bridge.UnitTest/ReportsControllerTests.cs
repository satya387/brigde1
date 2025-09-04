using Bridge.API.Controllers;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;

namespace Bridge.UnitTest
{
    [TestClass]
    public class ReportsControllerTests
    {

        private readonly Mock<IReportsSync> _reportsSync;
        private readonly ReportsController _reportController;
        private readonly Mock<ILogger<ReportsController>> _logger = new Mock<ILogger<ReportsController>>();
        private readonly Mock<IConfiguration> _configuration;

        public ReportsControllerTests()
        {
            _reportsSync = new Mock<IReportsSync>();
            _configuration = new Mock<IConfiguration>();
            _reportController = new ReportsController( _logger.Object,_reportsSync.Object, _configuration.Object);
        }

        #region GetRRAgeingReport

        [TestMethod]
        public void Get_RR_Ageing_Report()
        {
            _reportsSync.Setup(x => x.GetRRAgeingReport()).Returns(Task.FromResult(GetRRAgeingList()));
            var res = _reportController.GetRRAgeingReport().Result;
            Assert.IsNotNull(res);
            Assert.IsInstanceOfType(res, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetRRAgeing_Exception()
        {
            Exception ex = new Exception("No data found");
            _reportsSync.Setup(e => e.GetRRAgeingReport()).Throws(ex);
            var controller = new ReportsController( _logger.Object,_reportsSync.Object, _configuration.Object);
            var result = await controller.GetRRAgeingReport();
        }

        private List<RRAgeingReport> GetRRAgeingList()
        {
            var skillsList = new List<RRAgeingReport>
            {
                new RRAgeingReport {RRId=1 ,RRNumber = "RR/162", Ageing = 128,PostedOn="2021-01-01",ProjectName="CSV", RoleRequested ="Senior Software Engineer" }
            };
            return skillsList;
        }

        #endregion
    }
}

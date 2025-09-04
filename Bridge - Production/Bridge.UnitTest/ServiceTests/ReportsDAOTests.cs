using Bridge.API.DAO;
using Bridge.API.Synchronizer;
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
    public class ReportsDAOTests
    {
        private readonly Mock<IConfiguration> _configuration;
        private readonly Mock<ISyncProvider> _syncProvider;
        private static string connectionString;
        private readonly ReportsDAO _ReportSync;
        private readonly Mock<ILogger<ReportsDAO>> _logger = new Mock<ILogger<ReportsDAO>>();
        public ReportsDAOTests()
        {
            _configuration = new Mock<IConfiguration>();
            _syncProvider = new Mock<ISyncProvider>();
            _logger = new Mock<ILogger<ReportsDAO>>();
            _ReportSync = new ReportsDAO(_configuration.Object, _syncProvider.Object, _logger.Object);
        }

        [TestMethod]
        public async Task GetRRAgeing()
        {
            _syncProvider.Setup(x => x.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>())).Returns(Task.FromResult(MockData.MockData.DataTableRRAgeing));
            var responses = await _ReportSync.GetRRAgeingReport();
            _syncProvider.Verify(mock => mock.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>()));
            Assert.IsTrue(responses.Count > 0);
        }

        [TestMethod]
        public async Task GetRRAgeing_Exception()
        {
            _syncProvider.Setup(x => x.GetByStoredProcedure(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<List<QueryParameters>>())).Throws(new Exception("Error"));
            var responses = await _ReportSync.GetRRAgeingReport();
            Assert.IsNull(responses);
        }
    }
}

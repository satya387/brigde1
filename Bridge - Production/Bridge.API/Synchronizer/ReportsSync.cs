using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;

namespace Bridge.API.Synchronizer
{
    public class ReportsSync : IReportsSync
    {
        private readonly IReportsDAO _reportsDAO;
        public ReportsSync(IReportsDAO reportsDAO)
        {
            _reportsDAO = reportsDAO;
        }
        public async Task<List<BridgeUsageReport>> GetBridgeUsageReport(ReportParameters reportParameters)
        {
            return await _reportsDAO.GetBridgeUsageReport(reportParameters);
        }
        public async Task<List<RRProgressReport>> GetRRProgressReport(ReportParameters reportParameters)
        {
            return await _reportsDAO.GetRRProgressReport(reportParameters);
        }
        public async Task<List<RRAgeingReport>> GetRRAgeingReport()
        {
            return await _reportsDAO.GetRRAgeingReport();
        }
    }
}

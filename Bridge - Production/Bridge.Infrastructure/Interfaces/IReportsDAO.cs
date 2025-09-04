using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IReportsDAO
    {
        Task<List<BridgeUsageReport>> GetBridgeUsageReport(ReportParameters reportParameters);
        Task<List<RRProgressReport>> GetRRProgressReport(ReportParameters reportParameters);
        Task<List<RRAgeingReport>> GetRRAgeingReport();
    }
}

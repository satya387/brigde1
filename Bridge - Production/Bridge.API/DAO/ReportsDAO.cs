using Bridge.API.DAO.Mappers;
using Bridge.API.DAO.QueryBuilder;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Bridge.API.DAO
{
    public class ReportsDAO : IReportsDAO
    {
        private readonly IConfiguration _configuration;
        private readonly ISyncProvider _syncProvider;
        private static string connectionString;
        private readonly ILogger<ReportsDAO> _logger;
        public ReportsDAO(IConfiguration configuration, ISyncProvider syncProvider, ILogger<ReportsDAO> logger)
        {
            _configuration = configuration;
            _syncProvider = syncProvider;
            _logger = logger;
        }
        public async Task<List<BridgeUsageReport>> GetBridgeUsageReport(ReportParameters reportParameters)
        {
            try
            {
                _logger.LogInformation("ReportsDAO: GetBridgeUsageReport");
                _logger.LogTrace("GetBridgeUsageReport method started. FromDate: {reportParameters.FromDate}, ToDate: {reportParameters.ToDate}", reportParameters.FromDate, reportParameters.ToDate);

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>() {
                new QueryParameters
                    {
                        ValueName = "@FromDate",
                        Value = reportParameters.FromDate.ToString(),
                        ValueType = DbType.DateTime,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@ToDate",
                        Value = reportParameters.ToDate.ToString(),
                        ValueType = DbType.DateTime,
                        ValueDirection = ParameterDirection.Input
                    }
                };
                var bridgeUsageReportDataTable = await _syncProvider.GetByStoredProcedure(connectionString, ReportsQueryBuilder.USP_GETBRIDGEUSAGEREPORT, sqlParameters);

                if (bridgeUsageReportDataTable == null || bridgeUsageReportDataTable.Rows.Count == 0)
                {
                    _logger.LogTrace("GetBridgeUsageReport: No records found for the given FromDate: {reportParameters.FromDate}, ToDate: {reportParameters.ToDate}", reportParameters.FromDate, reportParameters.ToDate);

                }

                _logger.LogInformation("GetBridgeUsageReport method completed successfully.");

                return ReportsMapper.MapBridgeUsageReport(bridgeUsageReportDataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetBridgeUsageReport. FromDate: {reportParameters.FromDate}, ToDate: {reportParameters.ToDate}", reportParameters.FromDate, reportParameters.ToDate);
                throw;
            }
        }

        public async Task<List<RRProgressReport>> GetRRProgressReport(ReportParameters reportParameters)
        {
            try
            {
                _logger.LogInformation("ReportsDAO: GetRRProgressReport");
                _logger.LogTrace("GetRRProgressReport method started. FromDate: {reportParameters.FromDate}, ToDate: {reportParameters.ToDate}", reportParameters.FromDate, reportParameters.ToDate);

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                var sqlParameters = new List<QueryParameters>() {
                new QueryParameters
                    {
                        ValueName = "@FromDate",
                        Value = reportParameters.FromDate.ToString(),
                        ValueType = DbType.DateTime,
                        ValueDirection = ParameterDirection.Input
                    },
                    new QueryParameters
                    {
                        ValueName = "@ToDate",
                        Value = reportParameters.ToDate.ToString(),
                        ValueType = DbType.DateTime,
                        ValueDirection = ParameterDirection.Input
                    }
                };
                var rRProgressReportDataTable = await _syncProvider.GetByStoredProcedure(connectionString, ReportsQueryBuilder.USP_GETRRPROGRESSREPORT, sqlParameters);

                if (rRProgressReportDataTable == null || rRProgressReportDataTable.Rows.Count == 0)
                {
                    _logger.LogTrace("GetRRProgressReport: No records found for the given FromDate: {reportParameters.FromDate}, ToDate: {reportParameters.ToDate}", reportParameters.FromDate, reportParameters.ToDate);

                }

                _logger.LogInformation("GetRRProgressReport method completed successfully.");

                return ReportsMapper.MapRRProgressReport(rRProgressReportDataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetRRProgressReport. FromDate: {reportParameters.FromDate}, ToDate: {reportParameters.ToDate}", reportParameters.FromDate, reportParameters.ToDate);
                throw;
            }
        }

        public async Task<List<RRAgeingReport>> GetRRAgeingReport()
        {
            try
            {
                _logger.LogInformation("ReportsDAO: GetRRProgressReport");
                _logger.LogTrace("GetRRAgeingReport method started");

                connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);
                
                var rRAgeingReportDataTable = await _syncProvider.GetByStoredProcedure(connectionString, ReportsQueryBuilder.USP_GETRRAGEING, new List<QueryParameters>());

                if (rRAgeingReportDataTable == null || rRAgeingReportDataTable.Rows.Count == 0)
                {
                    _logger.LogTrace("GetRRAgeingReport: No records found ");

                }

                _logger.LogInformation("GetRRAgeingReport method completed successfully.");

                return ReportsMapper.MapRRAgeingReport(rRAgeingReportDataTable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetRRAgeingReport");
                return null;
            }
        }
    }
}

using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Reflection.Metadata;

namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ILogger<ReportsController> _logger;
        private readonly IReportsSync _reportsSync;
        private readonly IConfiguration _configuration;
        public ReportsController(ILogger<ReportsController> logger, IReportsSync reportsSync, IConfiguration configuration) {
            _logger = logger;
            _reportsSync = reportsSync;
            _configuration = configuration;
        }

        /// <summary>
        /// A Post api to return bridge application usage report in spcified format
        /// </summary>
        /// <param name="reportParameters"></param>
        /// <returns>BridgeUsaageReport</returns>
        [HttpPost]
        [Route("GetBridgeUsageReport")]
        public async Task<ActionResult> GetBridgeUsageReport([FromBody] ReportParameters reportParameters)
        {
            try
            {
                _logger.LogInformation("ReportsController: GetBridgeUsageReport");
                _logger.LogInformation("GetBridgeUsageReport method started");

                if (reportParameters == null || reportParameters.FromDate > reportParameters.ToDate)
                {
                    _logger.LogWarning("GetBridgeUsageReport: Invalid report parameters or FromDate cannot be after ToDate");
                    return BadRequest("GetBridgeUsageReport: Invalid report parameters or FromDate cannot be after ToDate");
                }

                var bridgeUsageReports = await _reportsSync.GetBridgeUsageReport(reportParameters);

                _logger.LogInformation("GetBridgeUsageReport method completed successfully");
                return Ok(bridgeUsageReports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetBridgeUsageReport method");
                return Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetRRProgressReport")]
        public async Task<ActionResult> GetRRProgressReport([FromBody] ReportParameters reportParameters)
        {
            try
            {
                _logger.LogInformation("ReportsController: GetRRProgressReport");
                _logger.LogInformation("GetRRProgressReport method started");

                if (reportParameters == null || reportParameters.FromDate > reportParameters.ToDate)
                {
                    _logger.LogWarning("GetRRProgressReport: Invalid report parameters or FromDate cannot be after ToDate");
                    return BadRequest("GetRRProgressReport: Invalid report parameters or FromDate cannot be after ToDate");
                }

                var rRProgressReports = await _reportsSync.GetRRProgressReport(reportParameters);

                _logger.LogInformation("GetRRProgressReport method completed successfully");
                return Ok(rRProgressReports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetRRProgressReport method");
                return Problem(ex.Message);
            }
        }

        /// <summary>
        /// TO GET SSRS (.RDL) Report 
        /// </summary>
        /// <param name="ReportName">Report Name</param>
        /// <param name="Parameter">Parametername1=Value&</param>
        /// <param name="ReportType">csv/PDF</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetDynamicReport")]
        public async Task<ActionResult> GetDynamicReport([FromBody] DynamicReportParameter dynamicReportParameter)
        { 
            try
            {
                string ReportURL = _configuration["ReportURL"];
                string ReportUserName = _configuration["ReportUserName"];
                string ReportPassword = _configuration["ReportPassword"];
                var path = $"{ReportURL}?/Bridge.Report/{dynamicReportParameter.ReportName}&rs:Command=Render&rs:Format={dynamicReportParameter.ReportType}";
                if (!string.IsNullOrEmpty(dynamicReportParameter.Parameter))
                {
                    path += $"&{dynamicReportParameter.Parameter}";
                }
                var myWebClient = new WebClient();
                var netCredential = new NetworkCredential (ReportUserName, Utilities.Base64Decode(ReportPassword) );
                myWebClient.Credentials = netCredential;
                byte[] myDataBuffer = myWebClient.DownloadData(path);
                string fileformat= UtilityConstant.FILEFORMAT_PDF;
                string Extension = UtilityConstant.FILEFORMAT_PDF;
                if (dynamicReportParameter.ReportType == "csv" || dynamicReportParameter.ReportType == "Excel")
                {
                    fileformat = UtilityConstant.FILEFORMAT;
                    Extension = UtilityConstant.FILEFORMAT_XLSX;
                } 
                
               return File(myDataBuffer, $"application/{fileformat}", $"{dynamicReportParameter.ReportName}_{DateTime.Now}.{Extension}");
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetDynamicReport method");
                return Problem(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetRRActivityAgeingReport")]
        public async Task<ActionResult> GetRRAgeingReport()
        {
            try
            {
                _logger.LogInformation("ReportsController: GetRRAgeingReport");
                _logger.LogInformation("GetRRAgeingReport method started");

                var rRAgeingReport = await _reportsSync.GetRRAgeingReport();

                _logger.LogInformation("GetRRAgeingReport method completed successfully");
                return Ok(rRAgeingReport);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetRRAgeingReport method");
                return Problem("GetRRActivityAgeingReport have some technical issues");
            }
        }

    }
}

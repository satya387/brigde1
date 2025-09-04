using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerSync _managerSync;
        private readonly ILogger<ManagerController> _logger;

        public ManagerController(IManagerSync managerSync, ILogger<ManagerController> logger)
        {
            _managerSync = managerSync;
            _logger = logger;
        }

        /// <summary>
        /// Fecthing manager resource details
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetManagerResources")]
        public async Task<ActionResult> GetManagerResources([FromHeader] string employeeId)
        {
            try
            {
                _logger.LogInformation("ManagerController : GetManagerResources");
                if (string.IsNullOrWhiteSpace(employeeId))
                {
                    _logger.LogError("Invalid employeeId request.");
                    return BadRequest("GetManagerResources: Invalid employeeId request.");
                }

                var managerResources = await _managerSync.GetManagerResources(employeeId);

                if (managerResources == null)
                {
                    _logger.LogWarning("Manager resources not found.");
                    return NoContent();
                }

                _logger.LogInformation("Manager resources retrieved successfully.");
                return Ok(managerResources);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting manager resources.");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        /// <summary>
        /// GetEmployeeSummary  to Get manager summary and Employee Summary
        /// </summary>
        /// <param name="employeeID"> Employee ID</param>
        /// <returns>employeeID</returns>
        [HttpGet]
        [Route("GetEmployeeSummary/{employeeID}")]
        public async Task<ActionResult> GetEmployeeSummary(  string employeeID)
        {
            try
            {
                _logger.LogInformation("ResourceRequestController: GetEmployeeSummary");
                var result= await _managerSync.GetEmployeeSummary(employeeID);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeSummary.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Upsert self summary
        /// </summary>
        /// <param name="selfSummary"></param>
        /// <returns>int</returns>
        [HttpPost]
        [Route("UpsertSelfSummary")]
        public async Task<ActionResult> UpsertSelfSummary([FromBody] SelfSummary selfSummary)
        {
            try
            {
                _logger.LogTrace("UpsertSelfSummary: Received request to upsert self summary for EmployeeId: {EmployeeId}", selfSummary.EmployeeId);
                var result = await _managerSync.UpsertSelfSummary(selfSummary);
                _logger.LogTrace("Self summary upsert operation succeeded for EmployeeId: {EmployeeId}", selfSummary.EmployeeId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in UpsertSelfSummary for EmployeeId: {EmployeeId}", selfSummary.EmployeeId); ;
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
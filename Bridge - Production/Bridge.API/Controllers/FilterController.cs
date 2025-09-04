using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class FilterController : ControllerBase
    {
        private readonly IFilterSync _filterSync;
        private readonly ILogger<FilterController> _logger;
        public FilterController(IFilterSync filterSync, ILogger<FilterController> logger)
        {
            _filterSync = filterSync;
            _logger = logger;
        }

        /// <summary>
        /// Get API to return employee opportunity filter
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns>OpportunityFilter</returns>
        [HttpGet]
        [Route("GetEmployeeOpportunitySearchFilter")]
        public async Task<ActionResult<OpportunityFilter>> GetEmployeeOpportunitySearchFilter([FromHeader] string employeeId)
        {
            try
            {
                _logger.LogInformation("FilterController: GetEmployeeOpportunitySearchFilter");
                _logger.LogTrace("GetEmployeeOpportunitySearchFilter started for EmployeeId: {EmployeeId}", employeeId);

                if (string.IsNullOrEmpty(employeeId))
                {
                    _logger.LogError("Invalid or missing EmployeeId in the request.");
                    return BadRequest();
                }

                var employeeOpportunitySearchFilter = await _filterSync.GetEmployeeOpportunitySearchFilter(employeeId);
                if (employeeOpportunitySearchFilter == null)
                {
                    _logger.LogWarning("No content found for EmployeeId: {EmployeeId}", employeeId);
                    return NoContent();
                }

                _logger.LogTrace("GetEmployeeOpportunitySearchFilter completed successfully for EmployeeId: {EmployeeId}", employeeId);
                return Ok(employeeOpportunitySearchFilter);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeOpportunitySearchFilter for EmployeeId: {EmployeeId}", employeeId);
                return Problem(ex.Message);
            }
        }

        /// <summary>
        /// Saves employee opportunity filter details
        /// </summary>
        /// <param name="opportunityFilter"></param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        [Route("SaveEmployeeOpportunityFilter")]
        public async Task<ActionResult> SaveEmployeeOpportunityFilter([FromBody] OpportunityFilter opportunityFilter)
        {
            try
            {
                _logger.LogInformation("FilterController: GetEmployeeOpportunitySearchFilter");
                _logger.LogTrace("SaveEmployeeOpportunityFilter started for EmployeeId: {EmployeeId}", opportunityFilter?.EmployeeId);

                if (string.IsNullOrWhiteSpace(opportunityFilter?.EmployeeId))
                {
                    _logger.LogWarning("SaveEmployeeOpportunityFilter: Invalid or missing EmployeeId in the request.");
                    return BadRequest();
                }

                var result = await _filterSync.SaveEmployeeOpportunityFilter(opportunityFilter);
                if (result != null && result == StatusCodes.Status500InternalServerError)
                {
                    _logger.LogError("An error occurred while saving the opportunity filter.");
                    return Problem("An error occurred while saving");
                }

                _logger.LogTrace("SaveEmployeeOpportunityFilter completed successfully for EmployeeId: {EmployeeId}", opportunityFilter.EmployeeId);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in SaveEmployeeOpportunityFilter for EmployeeId: {EmployeeId}", opportunityFilter?.EmployeeId);
                throw;
            }
        }

        /// <summary>
        /// Get project details for activeRRs
        /// </summary>
        /// <returns>GetProjectDetailsOfActiveRRs</returns>
        [HttpGet]
        [Route("GetProjectsDetailsOfActiveRRs")]
        public async Task<ActionResult> GetProjectsDetailsOfActiveRRs()
        {
            try
            {
                _logger.LogInformation("FilterController: GetProjectsDetailsOfActiveRRs");
                _logger.LogInformation("Fetching project details for activeRRs started...");

                var projectDeatils = await _filterSync.GetProjectsDetailsOfActiveRRs();

                if (projectDeatils == null)
                {
                    _logger.LogWarning("No records found.");
                    return NoContent();
                }

                _logger.LogInformation("Project details for activeRRs fetched successfully.");
                return Ok(projectDeatils);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching Project details.");
                return StatusCode(500, "An error occurred while fetching Project details.");
            }
        }
    }
}

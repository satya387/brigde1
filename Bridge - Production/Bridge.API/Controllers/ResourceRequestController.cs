using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq;
using System.Text.Json;
using static Bridge.Infrastructure.Utility.Utilities;
namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class ResourceRequestController : ControllerBase
    {
        private readonly IResourceRequestSync _resourceRequestSync;
        private readonly ILogger<ResourceRequestController> _logger;

        public ResourceRequestController(IResourceRequestSync resourceRequestSync, ILogger<ResourceRequestController> logger)
        {
            _resourceRequestSync = resourceRequestSync;
            _logger = logger;
        }

        /// <summary>
        /// Get API to return all the open, active resource requests for the given parameter
        /// </summary>
        /// <param name="employeeId"></param>
        /// <param name="location"></param>
        /// <returns>ResourceRequest</returns>
        [HttpGet]
        [Route("GetEmployeeOpportunities")]
        public async Task<ActionResult<IEnumerable<ResourceRequestWithApplicantsCount>>> GetEmployeeOpportunities([FromHeader] string employeeID)
        {
            try
            {
                _logger.LogInformation("ResourceRequestController: GetEmployeeOpportunities");
                if (string.IsNullOrWhiteSpace(employeeID))
                {
                    _logger.LogError("Invalid employee ID received in GetEmployeeOpportunities.");
                    return BadRequest();
                }

                var employeeOpportunities = await _resourceRequestSync.GetEmployeeOpportunities(employeeID);

                if (employeeOpportunities == null)
                {
                    _logger.LogWarning("No content found in GetEmployeeOpportunities.");
                    return NoContent();
                }

                _logger.LogTrace("GetEmployeeOpportunities completed successfully for EmployeeId: {EmployeeId}", employeeID);
                return Ok(employeeOpportunities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeOpportunities.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// GET API to return specific resource request detail for the given Id parameter
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetResourceRequestDetails")]
        // GET api/ResourceRequest/id
        public async Task<ActionResult<ResourceRequestResult>> GetResourceRequestDetails([FromHeader] ResourceRequestDetailsHeader resourceRequestDetailsHeader)
        {
            try
            {
                _logger.LogInformation("ResourceRequestController: GetResourceRequestDetails");
                if (resourceRequestDetailsHeader.id == 0)
                {
                    _logger.LogError("Invalid ID received in GetResourceRequestDetails.");
                    return BadRequest();
                }

                var resourceRequestDetail = await _resourceRequestSync.GetResourceRequestsById(resourceRequestDetailsHeader);

                if (resourceRequestDetail == null)
                {
                    _logger.LogWarning("No content found in GetResourceRequestDetails.");
                    return NoContent();
                }

                _logger.LogInformation("GetResourceRequestDetails completed successfully for RRID: {RRID}", resourceRequestDetailsHeader.id);
                return Ok(resourceRequestDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetResourceRequestDetails.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// GET API to return list of active resource request details for the given parameters
        /// </summary>
        /// <param name="managerId"></param>
        /// <returns>ResourceRequest</returns>
        [HttpPost]
        [Route("GetActiveResourceRequestsForManager")]
        public async Task<ActionResult<IEnumerable<ResourceRequest>>> GetActiveResourceRequestsForManager([FromBody] ManagerEmployeeIdsModel managerEmployeeIdsModel)
        {
            try
            {
                _logger.LogInformation("ResourceRequestController: GetActiveResourceRequestsForManager");
                if (string.IsNullOrEmpty(managerEmployeeIdsModel.ManagerId))
                {
                    _logger.LogError("Invalid or missing manager ID received in GetActiveResourceRequestsForManager.");
                    return BadRequest();
                }

                var activeResourceRequests = await _resourceRequestSync.GetActiveResourceRequestsForManager(managerEmployeeIdsModel);

                if (activeResourceRequests == null)
                {
                    _logger.LogWarning("No active resource requests found for manager in GetActiveResourceRequestsForManager.");
                    return NoContent();
                }

                _logger.LogTrace("GetActiveResourceRequestsForManager completed successfully for ManagerId: {ManagerId}", managerEmployeeIdsModel.ManagerId);
                return Ok(activeResourceRequests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetActiveResourceRequestsForManager.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// GET api to return list of applicants for the given RRId
        /// </summary>
        /// <param name="rrId"></param>
        /// <returns>List<ApplicationOpportunity></returns>
        [HttpGet]
        [Route("GetApplicantsByRRId")]
        public async Task<ActionResult> GetApplicantsByRRId([FromHeader] int rrId)
        {
            try
            {
                _logger.LogInformation("ResourceRequestController: GetApplicantsByRRId");
                _logger.LogInformation("GetApplicantsByRRId method started");

                if (rrId == 0)
                {
                    _logger.LogWarning("GetApplicantsByRRId: Invalid or missing rrId in the request.");
                    return BadRequest();
                }

                var applicantsByRRId = await _resourceRequestSync.GetApplicantsByRRId(rrId);

                _logger.LogInformation("GetApplicantsByRRId method completed successfully");
                return Ok(applicantsByRRId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetApplicantsByRRId method");
                return StatusCode(500, "An error occurred in GetApplicantsByRRId method");
            }
        }

        /// <summary>
        /// GetOpportunityHistory to return list of applicants for the given RRId
        /// </summary>
        /// <param name="rrId"></param>
        /// <returns>List<ApplicationOpportunity></returns>
        [HttpGet]
        [Route("GetOpportunityHistory")]
        public async Task<IActionResult> GetOpportunityHistory([FromHeader] int rrId, [FromHeader] OpportunityHistoryType historyType)
        {
            try
            {
                _logger.LogInformation("ResourceRequestController: GetOpportunityHistory");
                _logger.LogInformation("GetOpportunityHistory method started");

                if (rrId == 0 || Enum.IsDefined(typeof(OpportunityHistoryType), historyType) == false)
                {
                    _logger.LogWarning("GetOpportunityHistory: Invalid or missing rrId in the request.");
                    return BadRequest();
                }

                var result = await _resourceRequestSync.GetOpportunityHistory(rrId, historyType);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetOpportunityHistory method");
                return StatusCode(500, "An error occurred in GetOpportunityHistory method");
            }
        }


        /// <summary>
        /// GetActiveRRs
        /// </summary>
        /// <param name="status"></param>
        /// <returns>List<ApplicationOpportunity></returns>
        [HttpGet]
        [Route("GetActiveRRs")]
        public async Task<ActionResult> GetActiveRRs([FromHeader] string status = "Scheduled,L2Discussion")
        {
            try
            {
                _logger.LogInformation("GetActiveRRs: method started");


                if (string.IsNullOrWhiteSpace(status))
                {
                    _logger.LogWarning("GetActiveRRs: Invalid or missing rrId in the request.");
                    return BadRequest();
                }

                List<ActiveRrResponse> applicantsByRRId = await _resourceRequestSync.GetActiveRRs(status);

                _logger.LogInformation("GetActiveRRs method completed successfully");
                return Ok(applicantsByRRId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetActiveRRs method");
                return StatusCode(500, "An error occurred in GetActiveRRs method");
            }
        }


        /// <summary>
        /// GetViewLaunchPadResourceAnalysis
        /// </summary>         
        /// <returns>List<LaunchPadResourceAnalysis></returns>
        [HttpGet]
        [Route("GetViewLaunchPadResourceAnalysis")]
        public async Task<ActionResult> GetViewLaunchPadResourceAnalysis()
        {
            try
            {
                _logger.LogInformation("GetViewLaunchPadResourceAnalysis: method started");

 

                var result = await _resourceRequestSync.GetViewLaunchPadResourceAnalysis();

                _logger.LogInformation("GetViewLaunchPadResourceAnalysis method completed successfully");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetViewLaunchPadResourceAnalysis method");
                return StatusCode(500, "An error occurred in GetViewLaunchPadResourceAnalysis method");
            }
        }

    }   
}

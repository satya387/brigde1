using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class WFMHandlerController : Controller
    {
        private readonly IWFMHandlerSync _wfmHandlerSync;
        private readonly ILogger<WFMHandlerController> _logger;
        private readonly IEmployeeSync _employeeSync;

        public WFMHandlerController(IWFMHandlerSync wfmHandlerSync, ILogger<WFMHandlerController> logger, IEmployeeSync employeeSync)
        {
            _wfmHandlerSync = wfmHandlerSync;
            _logger = logger;
            _employeeSync = employeeSync;
        }

        /// <summary>
        /// Get the list of WFM team
        /// </summary>
        /// <returns>WFMDetails</returns>
        [HttpGet]
        [Route("GetWFMTeamList")]
        public async Task<ActionResult> GetWFMTeamList()
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: GetWFMTeamList");
                _logger.LogInformation("Fetching WFM details started...");

                var wfmDeatils = await _wfmHandlerSync.GetWFMTeamList();

                if (wfmDeatils == null)
                {
                    _logger.LogWarning("No records found.");
                    return NoContent();
                }

                _logger.LogInformation("WFM details fetched successfully.");
                return Ok(wfmDeatils);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching WFM details.");
                return StatusCode(500, "An error occurred while fetching WFM details.");
            }
        }

        /// <summary>
        /// Saves resource availability details
        /// </summary>
        /// <param name="resourceAvailability"></param>
        /// <returns>int</returns>
        [HttpPost]
        [Route("SaveResourceAvailability")]
        public async Task<ActionResult> SaveResourceAvailability([FromBody] ResourceAvailability resourceAvailability)
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: SaveResourceAvailability");
                if (string.IsNullOrWhiteSpace(resourceAvailability?.EmployeeId))
                {
                    return BadRequest("EmployeeId is not valid");
                }

                _logger.LogInformation("Saving resource availability...");

                var result = await _wfmHandlerSync.SaveResourceAvailability(resourceAvailability);

                if (result != null && result == StatusCodes.Status500InternalServerError)
                {
                    _logger.LogError("An error occurred while saving");

                    return Problem("An error occurred while saving");
                }

                _logger.LogInformation("Resource availability saved successfully for EmployeeId: {EmployeeId : ", resourceAvailability?.EmployeeId);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred");
                throw;
            }
        }

        /// <summary>
        /// Get the list of future available resources
        /// </summary>
        /// <returns>LaunchpadEmployee</returns>
        [HttpGet]
        [Route("GetFutureAvailableResources")]
        public async Task<ActionResult> GetFutureAvailableResources()
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: GetFutureAvailableResources");

                var getFutureAvailableResources = await _wfmHandlerSync.GetFutureAvailableResources();

                if (getFutureAvailableResources == null)
                {
                    _logger.LogInformation("No future available resources found");

                    return NoContent();
                }

                _logger.LogInformation("Future available resources fetched successfully");

                return Ok(getFutureAvailableResources);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred");
                throw;
            }
        }

        /// <summary>
        /// Get the list of future available resources
        /// </summary>
        /// <returns>LaunchpadEmployee</returns>
        [HttpGet]
        [Route("GetAllAvailableResources")]
        public async Task<ActionResult> GetAllAvailableResources()
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: GetAllAvailableResources");

                var getAllAvailableResources = await _wfmHandlerSync.GetAllAvailableResources();

                if (getAllAvailableResources == null)
                {
                    _logger.LogInformation("No available resources found");

                    return NoContent();
                }

                _logger.LogInformation("Available resources fetched successfully");

                return Ok(getAllAvailableResources);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred");
                throw;
            }
        }

        /// <summary>
        /// Get Resource Allocation Details
        /// </summary>
        /// <returns>ResourceAllocationDetails</returns>
        [HttpGet]
        [Route("GetResourceAllocationDetails")]
        public async Task<ActionResult> GetResourceAllocationDetails()
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: GetResourceAllocationDetails");

                var getResourceAllocationDetails = await _wfmHandlerSync.GetResourceAllocationDetails();

                if (getResourceAllocationDetails == null || getResourceAllocationDetails.Count == 0)
                {
                    _logger.LogInformation("No resources found");

                    return NoContent();
                }

                _logger.LogInformation("Resources fetched successfully");

                return Ok(getResourceAllocationDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred");
                return BadRequest("An error occurred in GetResourceAllocationDetails");
            }
        }

        /// <summary>
        /// Upsert resource allocation details
        /// </summary>
        /// <param name="employeeOpportunity"></param>
        /// <returns>int</returns>
        [HttpPost]
        [Route("UpsertResourceAllocationDetails")]
        public async Task<ActionResult> UpsertResourceAllocationDetails([FromBody] EmployeeOpportunity employeeOpportunity)
        {
            try
            {
                _logger.LogInformation("EmployeeController: UpsertResourceAllocationDetails");
                _logger.LogInformation("Attempting to upsert resource allocation details...");
                var checkResourceStatus = await _employeeSync.CheckResourceStatus(employeeOpportunity.EmployeeId);
                if (checkResourceStatus == null || checkResourceStatus?.Count == 0)
                {
                    var result = await _employeeSync.ApproveAppliedOpportunity(employeeOpportunity);

                    _logger.LogInformation("Resource allocation details upserted successfully.");
                    return Ok(result);
                }
                return new ConflictObjectResult(checkResourceStatus);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while upserting previous organization assignments.");
                return StatusCode(500, "An error occurred while upserting previous organization assignments.");
            }
        }



        /// <summary>
        /// Get Released Employee
        /// </summary>
        /// <returns>GetReleasedEmployee</returns>
        [HttpGet]
        [Route("GetReleasedEmployee")]
        public async Task<ActionResult> GetReleasedEmployee()
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: GetReleasedEmployee");

                var results = await _wfmHandlerSync.GetReleasedEmployee();

                if (results == null || results?.Count == 0)
                {
                    _logger.LogInformation("No available resources found");

                    return NoContent();
                }

                _logger.LogInformation("GetReleasedEmployee fetched successfully");

                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred");
                throw;
            }
        }


        /// <summary>
        /// ResourceRequestsComments 
        /// </summary>
        /// <param name="ResourceRequestsComments"></param>
        /// <returns>int</returns>
        [HttpPost]
        [Route("SaveRRResourceComments")]
        public async Task<ActionResult> SaveResourceRequestsComments([FromBody] ResourceRequestsComments resourceAvailability)
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: ResourceRequestsComments");
                if (resourceAvailability?.RRID == 0)
                {
                    return BadRequest("RRID is not valid");
                }

                _logger.LogInformation("Save ResourceRequests Comments...");
                var result = await _wfmHandlerSync.SaveResourceRequestsComments(resourceAvailability);
                if (result != 0 && result == StatusCodes.Status500InternalServerError)
                {
                    _logger.LogError("An error occurred while saving");
                    return Problem("An error occurred while saving");
                }

                _logger.LogInformation($"Save ResourceRequestsComments saved successfully for  RRNumber : {resourceAvailability?.RRNumber} ");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred");
                throw;
            }
        }

        /// <summary>
        /// Get RR Resource Comments
        /// </summary>
        /// <returns>ResourceAllocationDetails</returns>
        [HttpGet]
        [Route("GetRRResourceComments")]
        public async Task<ActionResult> GetResourceComments([FromHeader, Required] int rrid)
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: GetResourceComments");

                var getResourceComments = await _wfmHandlerSync.GetResourceComments(rrid);

                if (getResourceComments == null || getResourceComments.Count == 0)
                {
                    _logger.LogInformation("No resources found");

                    return NoContent();
                }

                _logger.LogInformation("GetResourceComments fetched successfully");

                return Ok(getResourceComments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred");
                return BadRequest("An error occurred in getResourceComments");
            }
        }

        /// <summary>
        /// Get declined and dropped comments
        /// </summary>
        /// <returns>CommentsDeatils</returns>
        [HttpGet]
        [Route("GetDeclinedAndDroppedComments")]
        public async Task<ActionResult> GetDeclinedAndDroppedComments()
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: GetDeclinedAndDroppedComments");

                var listOfDeclinedDroppedComments = await _wfmHandlerSync.GetDeclinedAndDroppedComments();

                if (listOfDeclinedDroppedComments == null)
                {
                    _logger.LogWarning("No records found.");
                    return NoContent();
                }

                _logger.LogInformation("GetDeclinedAndDroppedComments fetched successfully.");
                return Ok(listOfDeclinedDroppedComments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching declined and dropped comments.");
                return StatusCode(500, "An error occurred while fetching declined and dropped comments.");
            }
        }

        /// <summary>
        /// Get list of dropped applications
        /// </summary>
        /// <returns>DroppedApplications</returns>
        [HttpGet]
        [Route("GetDroppedApplications")]
        public async Task<ActionResult> GetDroppedApplications()
        {
            try
            {
                _logger.LogInformation("WFMHandlerController: GetDroppedApplications");

                var listOfDroppedApplications = await _wfmHandlerSync.GetDroppedApplications();

                if (listOfDroppedApplications == null)
                {
                    _logger.LogWarning("No records found.");
                    return NoContent();
                }

                _logger.LogInformation("GetDroppedApplications fetched successfully.");
                return Ok(listOfDroppedApplications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching dropped applications.");
                return StatusCode(500, "An error occurred while fetching dropped applications.");
            }
        }
    }
}

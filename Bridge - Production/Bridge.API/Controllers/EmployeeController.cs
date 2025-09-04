using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeSync _employeeSync;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(IEmployeeSync employeeSync, ILogger<EmployeeController> logger)
        {
            _employeeSync = employeeSync;
            _logger = logger;
        }
        /// <summary>
        /// Get API to return all the employees on launchpad
        /// </summary>
        /// <returns>IEnumerable<Employee></returns>
        [HttpGet]
        // GET api/GetEmployees
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees([FromHeader] string location)
        {
            var employees = await _employeeSync.GetEmployees(location);
            if (employees == null)
            {
                return NoContent();
            }
            return Ok(employees);
        }

        /// <summary>
        /// Post API to apply for an opportunity
        /// </summary>
        /// <param name="applyOpportunityRequest"></param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        [Route("ApplyOpportunity")]
        public async Task<ActionResult> ApplyOpportunity([FromBody] ApplyOpportunityRequest applyOpportunityRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeController: ApplyOpportunity");
                if (string.IsNullOrWhiteSpace(applyOpportunityRequest?.EmployeeId) || applyOpportunityRequest?.ResourceRequestId == 0)
                {
                    _logger.LogError("Invalid request received in ApplyOpportunity action.");
                    return BadRequest();
                }

                _logger.LogInformation("ApplyOpportunity method started");
                var result = await _employeeSync.ApplyOpportunity(applyOpportunityRequest);

                if (result == null)
                {
                    _logger.LogError("EmployeeId or RRId is invalid.");
                    return Problem("EmployeeId or RRId is invalid");
                }
                if (result == StatusCodes.Status200OK)
                {
                    _logger.LogInformation("Opportunity applied successfully.");
                    return Ok();
                }
                else if (result == StatusCodes.Status409Conflict)
                {
                    _logger.LogInformation("Employee has already applied for this job.");
                    return Conflict("Employee has already applied for this job.");
                }
                else if (result == StatusCodes.Status208AlreadyReported)
                {
                    _logger.LogInformation("Meeting already scheduled for this opportunity.");
                    return Conflict("Meeting already scheduled for this opportunity.");
                }

                _logger.LogError("An unexpected error occurred.");
                return Problem();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in ApplyOpportunity action.");
                return StatusCode(500, "An error occurred in ApplyOpportunity action.");
            }
        }

        /// <summary>
        /// Get API for getting self applied opportunities
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns>List<AppliedOpportunity></returns>
        [HttpGet]
        [Route("GetSelfAppliedOpportunities")]
        public async Task<ActionResult> GetSelfAppliedOpportunities([FromHeader] string employeeId)
        {
            try
            {
                _logger.LogInformation("EmployeeController: GetSelfAppliedOpportunities");
                if (string.IsNullOrWhiteSpace(employeeId))
                {
                    _logger.LogError("Invalid request received in GetSelfAppliedOpportunities action.");
                    return BadRequest();
                }

                var result = await _employeeSync.GetSelfAppliedOpportunities(employeeId);
                if (result == null)
                {
                    _logger.LogWarning("No self-applied opportunities found for employeeId: {EmployeeId}", employeeId);
                    return NoContent();
                }

                _logger.LogTrace("Self-applied opportunities retrieved successfully for employeeId: {EmployeeId}", employeeId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetSelfAppliedOpportunities action.");
                return StatusCode(500, "An error occurred in GetSelfAppliedOpportunities action.");
            }
        }

        /// <summary>
        /// Get API for fetching launchpad employees
        /// </summary>
        /// <param name="location"></param>
        /// <returns>List<LaunchpadEmployee></returns>
        [HttpGet]
        [Route("GetLaunchpadEmployees")]
        public async Task<ActionResult> GetLaunchpadEmployees([FromHeader] string location)
        {
            try
            {
                _logger.LogInformation("EmployeeController: GetLaunchpadEmployees");
                if (string.IsNullOrWhiteSpace(location))
                {
                    _logger.LogError("Invalid request received in GetLaunchpadEmployees action.");
                    return BadRequest();
                }

                _logger.LogInformation("Fetching launchpad employees started for location: {Location}", location);

                var launchpadEmployees = await _employeeSync.GetLaunchpadEmployees();

                if (launchpadEmployees == null)
                {
                    _logger.LogWarning("No launchpad employees found for location: {Location}", location);
                    return NoContent();
                }

                _logger.LogInformation("Launchpad employees retrieved successfully for location: {Location}", location);
                return Ok(launchpadEmployees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetLaunchpadEmployees action.");
                return StatusCode(500, "An error occurred in GetLaunchpadEmployees action.");
            }
        }


        /// <summary>
        ///  Get Employee Applied pportunities for Manager
        /// </summary>
        /// <param name="managerEmployeeId"></param>
        /// <returns>List<AppliedOpportunity></returns>
        [HttpGet]
        [Route("GetEmployeeAppliedOpportunitiesForManager")]
        public async Task<ActionResult> GetEmployeeAppliedOpportunitiesForManager([FromHeader] string managerEmployeeId)
        {
            try
            {
                _logger.LogInformation("EmployeeController: GetEmployeeAppliedOpportunitiesForManager");
                if (string.IsNullOrWhiteSpace(managerEmployeeId))
                {
                    _logger.LogError("Invalid request received in GetEmployeeAppliedOpportunitiesForManager action.");
                    return BadRequest();
                }
                _logger.LogTrace("Fetching applied opportunities for manager with EmployeeId: {EmployeeId}", managerEmployeeId);

                var result = await _employeeSync.GetEmployeeAppliedOpportunitiesForManager(managerEmployeeId);

                if (result == null)
                {
                    _logger.LogWarning("No applied opportunities found for manager with EmployeeId: {EmployeeId}", managerEmployeeId);
                    return NoContent();
                }

                _logger.LogTrace("Applied opportunities retrieved successfully for manager with EmployeeId: {EmployeeId}", managerEmployeeId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeAppliedOpportunitiesForManager action.");
                return StatusCode(500, "An error occurred in GetEmployeeAppliedOpportunitiesForManager action.");
            }
        }

        /// <summary>
        /// Post API to withdraw the self applied opportunity
        /// </summary>
        /// <param name="WithdrawOpportunityRequest"></param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        [Route("WithdrawAppliedOpportunity")]
        public async Task<ActionResult> WithdrawAppliedOpportunity([FromBody] WithdrawOpportunityRequest withdrawOpportunityRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeController: WithdrawAppliedOpportunity");
                if (withdrawOpportunityRequest?.ResourceRequestId == 0 || string.IsNullOrWhiteSpace(withdrawOpportunityRequest?.EmployeeId))
                {
                    _logger.LogError("Invalid request received in WithdrawAppliedOpportunity action.");
                    return BadRequest();
                }
                _logger.LogTrace("Withdrawing applied opportunity for EmployeeId: {EmployeeId}, ResourceRequestId: {ResourceRequestId}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);

                var result = await _employeeSync.WithdrawAppliedOpportunity(withdrawOpportunityRequest, false);

                if (result == StatusCodes.Status200OK)
                {
                    _logger.LogTrace("Applied opportunity withdrawn successfully for EmployeeId: {EmployeeId}, ResourceRequestId: {ResourceRequestId}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                    return Ok();
                }
                else if (result == StatusCodes.Status404NotFound)
                {
                    _logger.LogWarning("Applied opportunity not found for EmployeeId: {EmployeeId}, ResourceRequestId: {ResourceRequestId}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId);
                    return NoContent();
                }

                _logger.LogError("An error occurred in WithdrawAppliedOpportunity action for EmployeeId: {EmployeeId}, ResourceRequestId: {ResourceRequestId} with Status code: {StatusCode}", withdrawOpportunityRequest.EmployeeId, withdrawOpportunityRequest.ResourceRequestId, result);
                return Problem();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred in WithdrawAppliedOpportunity action.");
                return StatusCode(500, "An error occurred in WithdrawAppliedOpportunity action.");
            }
        }

        /// <summary>
        /// Post API to disapprove applied opportunity from Manager
        /// </summary>
        /// <param name="WithdrawOpportunityRequest"></param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        [Route("DisapproveAppliedOpportunityByManager")]
        public async Task<ActionResult> DisapproveAppliedOpportunityByManager([FromBody] WithdrawOpportunityRequest disapproveOpportunityRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeController: DisapproveAppliedOpportunityByManager");
                if (disapproveOpportunityRequest?.ResourceRequestId == 0 || string.IsNullOrWhiteSpace(disapproveOpportunityRequest?.EmployeeId)
                    || string.IsNullOrWhiteSpace(disapproveOpportunityRequest?.ReasonForDisapprove)
                    || string.IsNullOrWhiteSpace(disapproveOpportunityRequest?.DisapprovedBy))
                {
                    _logger.LogError("Invalid request received in DisapproveAppliedOpportunityByManager action.");
                    return BadRequest();
                }
                _logger.LogTrace("Disapproving applied opportunity by Manager. EmployeeId: {EmployeeId}, ResourceRequestId: {ResourceRequestId}", disapproveOpportunityRequest.EmployeeId, disapproveOpportunityRequest.ResourceRequestId);

                var result = await _employeeSync.WithdrawAppliedOpportunity(disapproveOpportunityRequest, true);

                if (result == StatusCodes.Status200OK)
                {
                    _logger.LogTrace("Applied opportunity disapproved successfully. EmployeeId: {EmployeeId}, ResourceRequestId: {ResourceRequestId}", disapproveOpportunityRequest.EmployeeId, disapproveOpportunityRequest.ResourceRequestId);
                    return Ok();
                }
                else if (result == StatusCodes.Status404NotFound)
                {
                    _logger.LogWarning("Applied opportunity not found. EmployeeId: {EmployeeId}, ResourceRequestId: {ResourceRequestId}", disapproveOpportunityRequest.EmployeeId, disapproveOpportunityRequest.ResourceRequestId);
                    return NoContent();
                }

                _logger.LogError("An error occurred in DisapproveAppliedOpportunityByManager action. EmployeeId: {EmployeeId}, ResourceRequestId: {ResourceRequestId} with Status code: {StatusCode}", disapproveOpportunityRequest.EmployeeId, disapproveOpportunityRequest.ResourceRequestId, result);
                return Problem();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred in DisapproveAppliedOpportunityByManager action.");
                return StatusCode(500, "An error occurred in DisapproveAppliedOpportunityByManager action.");
            }
        }

        /// <summary>
        /// Post API to Approve applied opportunity from Manager
        /// </summary>
        /// <param name="EmployeeOpportunity"></param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        [Route("ApproveAppliedOpportunityByManager")]
        public async Task<ActionResult> ApproveAppliedOpportunityByManager([FromBody] EmployeeOpportunity employeeOpportunity)
        {
            try
            {
                _logger.LogInformation("EmployeeController: DisapproveAppliedOpportunityByManager");
                if (string.IsNullOrWhiteSpace(employeeOpportunity?.EmployeeId) || employeeOpportunity?.RrId == 0
                    || employeeOpportunity.AllocationPercentage == null || employeeOpportunity.AllocationPercentage == 0
                    || employeeOpportunity.AllocationStartDate == null || employeeOpportunity.AllocationStartDate == DateTime.MinValue)
                {
                    _logger.LogError("Invalid request received in ApproveAppliedOpportunityByManager action.");
                    return BadRequest();
                }
                _logger.LogTrace("Approving applied opportunity by Manager. EmployeeId: {EmployeeId}, ResourceRequestId: {RrId}", employeeOpportunity.EmployeeId, employeeOpportunity.RrId);

                var result = await _employeeSync.ApproveAppliedOpportunity(employeeOpportunity);

                if (result == StatusCodes.Status200OK)
                {
                    _logger.LogTrace("Applied opportunity disapproved successfully. EmployeeId: {EmployeeId}, ResourceRequestId: {RrId}", employeeOpportunity.EmployeeId, employeeOpportunity.RrId);
                    return Ok();
                }
                else if (result == StatusCodes.Status404NotFound)
                {
                    _logger.LogWarning("Applied opportunity not found. EmployeeId: {EmployeeId}, ResourceRequestId: {RrId}", employeeOpportunity.EmployeeId, employeeOpportunity.RrId);
                    return NoContent();
                }

                _logger.LogError("An error occurred in ApproveAppliedOpportunityByManager action. EmployeeId: {EmployeeId}, ResourceRequestId: {RrId} with Status code: {StatusCode}", employeeOpportunity.EmployeeId, employeeOpportunity.RrId, result);
                return Problem();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred in ApproveAppliedOpportunityByManager action.");
                return StatusCode(500, "An error occurred in ApproveAppliedOpportunityByManager action.");
            }
        }

        /// <summary>
        /// Get API to fetch employee Details
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns>ActionResult</returns>
        [HttpGet]
        [Route("GetEmployeeProfileDetails")]
        public async Task<ActionResult> GetEmployeeProfileDetails([FromHeader] string employeeId)
        {
            try
            {
                _logger.LogInformation("EmployeeController: GetEmployeeProfileDetails");
                if (string.IsNullOrWhiteSpace(employeeId))
                {
                    _logger.LogError("Invalid request received in GetEmployeeProfileDetails action.");
                    return BadRequest();
                }
                _logger.LogTrace("Fetching employee profile details. EmployeeId: {EmployeeId}", employeeId);

                var employeeDetails = await _employeeSync.GetEmployeeProfileDetails(employeeId);

                if (employeeDetails == null)
                {
                    _logger.LogWarning("Employee profile details not found. EmployeeId: {EmployeeId}", employeeId);
                    return NoContent();
                }

                _logger.LogTrace("Employee profile details retrieved successfully. EmployeeId: {EmployeeId}", employeeId);
                return Ok(employeeDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetEmployeeProfileDetails action. EmployeeId: {EmployeeId}", employeeId);
                return StatusCode(500, "An error occurred in GetEmployeeProfileDetails action.");
            }
        }

        /// <summary>
        /// Post API to initiate discussion from manager
        /// </summary>
        /// <param name="InitiateDiscussionRequest"></param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        [Route("InitiateDiscussion")]
        public async Task<ActionResult> InitiateDiscussion([FromBody] InitiateDiscussionRequest initiateDiscussionRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeController: InitiateDiscussion");
                if (ModelState.IsValid == false)
                {
                    _logger.LogError("Invalid model state in InitiateDiscussion action.");
                    return BadRequest(ModelState.Values.SelectMany(x => x.Errors));
                }

                if (string.IsNullOrWhiteSpace(initiateDiscussionRequest.EmployeeId) || string.IsNullOrWhiteSpace(initiateDiscussionRequest.EmployeeMailId)
                    || initiateDiscussionRequest.DiscussionStartTime == DateTime.MinValue || string.IsNullOrWhiteSpace(initiateDiscussionRequest.ManagerEmployeeMailId)
                    || string.IsNullOrWhiteSpace(initiateDiscussionRequest.ResourceRequestNumber) || initiateDiscussionRequest.DiscussionDuration == 0
                    || initiateDiscussionRequest.RrId == 0 || !Enum.TryParse(typeof(EmployeeOpportunityStatus), initiateDiscussionRequest.Status, out object status))
                {
                    _logger.LogError("Invalid request received in InitiateDiscussion action.");
                    return BadRequest();
                }
                _logger.LogTrace("Initiating discussion. EmployeeId: {EmployeeId}, ResourceRequestNumber: {ResourceRequestNumber}", initiateDiscussionRequest.EmployeeId, initiateDiscussionRequest.ResourceRequestNumber);

                var result = await _employeeSync.InitiateDiscussion(initiateDiscussionRequest);

                if (result == StatusCodes.Status200OK)
                {
                    _logger.LogTrace("Discussion initiated successfully. EmployeeId: {EmployeeId}, ResourceRequestNumber: {ResourceRequestNumber}", initiateDiscussionRequest.EmployeeId, initiateDiscussionRequest.ResourceRequestNumber);
                    return Ok();
                }
                else if (result == StatusCodes.Status404NotFound)
                {
                    _logger.LogWarning("Resource request not found. EmployeeId: {EmployeeId}, ResourceRequestNumber: {ResourceRequestNumber}", initiateDiscussionRequest.EmployeeId, initiateDiscussionRequest.ResourceRequestNumber);
                    return NoContent();
                }

                _logger.LogError("Status code: {StatusCode}, Error occurred while initiating discussion. EmployeeId: {EmployeeId}, ResourceRequestNumber: {ResourceRequestNumber}", result, initiateDiscussionRequest.EmployeeId, initiateDiscussionRequest.ResourceRequestNumber);
                return Problem();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in InitiateDiscussion action.");
                return StatusCode(500, "An error occurred in InitiateDiscussion action.");
            }
        }

        /// <summary>
        /// Get the list of DisapprovalReasons
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetDisapprovalReasons")]
        public async Task<ActionResult> GetDisapprovalReasons()
        {
            try
            {
                _logger.LogInformation("EmployeeController: GetDisapprovalReasons");
                _logger.LogInformation("Fetching disapproval reasons...");

                var disapprovalReasons = await _employeeSync.GetDisapprovalReasons();

                if (disapprovalReasons == null)
                {
                    _logger.LogWarning("No disapproval reasons found.");
                    return NoContent();
                }

                _logger.LogInformation("Disapproval reasons fetched successfully.");
                return Ok(disapprovalReasons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching disapproval reasons.");
                return StatusCode(500, "An error occurred while fetching disapproval reasons.");
            }
        }

        /// <summary>
        /// Update the employee about field data
        /// </summary>
        /// <param name="updateEmployeeWriteUp"></param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        [Route("UpdateEmployeeWriteUp")]
        public async Task<ActionResult> UpdateEmployeeWriteUp([FromBody] UpdateEmployeeWriteUp updateEmployeeWriteUp)
        {
            try
            {
                _logger.LogInformation("EmployeeController: UpdateEmployeeWriteUp");
                if (string.IsNullOrWhiteSpace(updateEmployeeWriteUp?.EmployeeId))
                {
                    _logger.LogError("Invalid input received in UpdateEmployeeWriteUp action.");
                    return BadRequest();
                }

                _logger.LogTrace($"Updating write-up for employee {updateEmployeeWriteUp.EmployeeId}...");
                var result = await _employeeSync.UpdateEmployeeWriteUp(updateEmployeeWriteUp);

                _logger.LogTrace($"Write-up updated successfully for employee {updateEmployeeWriteUp.EmployeeId}.");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating employee write-up.");
                return StatusCode(500, "An error occurred while updating employee write-up.");
            }
        }

        /// <summary>
        /// Update role and responsibility of the employee
        /// </summary>
        /// <param name="updateRoleAndResponsibilityOfEmployee"></param>
        /// <returns>ActionResult</returns>
        [HttpPost]
        [Route("UpdateRoleAndResponsibilityOfEmployee")]
        public async Task<ActionResult> UpdateRoleAndResponsibilityOfEmployee([FromBody] EmployeeAssignment updateRoleAndResponsibilityOfEmployee)
        {
            try
            {

                _logger.LogInformation("EmployeeController: UpdateRoleAndResponsibilityOfEmployee");
                if (!updateRoleAndResponsibilityOfEmployee.ResourceAssignId.HasValue || updateRoleAndResponsibilityOfEmployee.ResourceAssignId <= 0)
                {
                    _logger.LogError("Invalid input received in UpdateRoleAndResponsibilityOfEmployee action.");
                    return BadRequest();
                }

                _logger.LogInformation($"Updating role and responsibility for employee with ResourceAssignId: {updateRoleAndResponsibilityOfEmployee.ResourceAssignId}...");
                var result = await _employeeSync.UpdateRoleAndResponsibilityOfEmployee(updateRoleAndResponsibilityOfEmployee);

                _logger.LogInformation($"Role and responsibility updated successfully for employee with ResourceAssignId: {updateRoleAndResponsibilityOfEmployee.ResourceAssignId}.");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating role and responsibility of an employee.");
                return StatusCode(500, "An error occurred while updating role and responsibility of an employee.");
            }
        }

        [HttpPost]
        [Route("UpsertPreviousOrgAssignments")]
        public async Task<ActionResult> UpsertPreviousOrgAssignments([FromBody] EmployeeAssignment previousOrgAssignment)
        {
            try
            {
                _logger.LogInformation("EmployeeController: UpsertPreviousOrgAssignments");
                _logger.LogInformation("Attempting to upsert previous organization assignments...");

                var result = await _employeeSync.UpsertPreviousOrgAssignments(previousOrgAssignment);

                _logger.LogInformation("Previous organization assignments upserted successfully.");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while upserting previous organization assignments.");
                return StatusCode(500, "An error occurred while upserting previous organization assignments.");
            }
        }

        [HttpPost]
        [Route("UpsertEmployeeOpportunity")]
        public async Task<ActionResult> UpsertEmployeeOpportunity([FromBody] EmployeeOpportunity employeeOpportunity)
        {
            try
            {
                _logger.LogInformation("EmployeeController: UpsertPreviousOrgAssignments");
                _logger.LogInformation("Attempting to upsert previous organization assignments...");

                var result = await _employeeSync.UpsertEmployeeOpportunity(employeeOpportunity);

                _logger.LogInformation("Previous organization assignments upserted successfully.");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while upserting previous organization assignments.");
                return StatusCode(500, "An error occurred while upserting previous organization assignments.");
            }
        }

        /// <summary>
        /// Get API for fetching RR Matching launchpad employees
        /// </summary>
        /// <param name="resourceRequest"></param>
        /// <returns>List<Employee></returns>
        [HttpPost]
        [Route("GetRRMatchingLaunchPadEmployees")]
        public async Task<ActionResult> GetRRMatchingLaunchPadEmployees([FromBody] ResourceRequest resourceRequest)
        {
            try
            {
                _logger.LogInformation("EmployeeController: GetRRMatchingLaunchPadEmployees");
                if (resourceRequest == null)
                {
                    _logger.LogError("Invalid request received in GetRRMatchingLaunchPadEmployees action.");
                    return BadRequest();
                }

                _logger.LogInformation("Fetching RR Matching launchpad employees started");

                var launchpadEmployees = await _employeeSync.GetRRMatchingLaunchPadEmployees(resourceRequest);

                if (launchpadEmployees == null)
                {
                    _logger.LogWarning("No RR Matching launchpad employees found");
                    return NoContent();
                }

                _logger.LogInformation("RR Matching Launchpad employees retrieved successfully");
                return Ok(launchpadEmployees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetRRMatchingLaunchPadEmployees action.");
                return StatusCode(500, "An error occurred in GetRRMatchingLaunchPadEmployees action.");
            }
        }

        /// <summary>
        /// GetTalentHistory to return list of applicants for the given EmployeeID
        /// </summary>
        /// <param name="employeeId">EmployeeId</param>
        /// <returns>List<ApplicationOpportunity></returns>
        [HttpGet]
        [Route("GetTalentHistory")]
        public async Task<IActionResult> GetTalentHistory([FromHeader] string  employeeId)
        {
            try
            {
                _logger.LogInformation("EmployeeController: GetTalentHistory");
                _logger.LogInformation("GetTalentHistory method started");

                if ( string.IsNullOrWhiteSpace(employeeId))
                {
                    _logger.LogWarning("GetEmployeeOpportunityHistory: Invalid or missing employeeId in the request.");
                    return BadRequest();
                }

                var result = await _employeeSync.GetTalentHistory(employeeId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetTalentHistory method");
                return StatusCode(500, "An error occurred in GetTalentHistory method");
            }
        }
    }
}

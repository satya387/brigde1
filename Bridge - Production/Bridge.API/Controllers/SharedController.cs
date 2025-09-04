using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class SharedController : ControllerBase
    {
        private readonly ISharedSync _sharedSync;
        private readonly ILogger<SharedController> _logger;

        public SharedController(ISharedSync sharedSync, ILogger<SharedController> logger)
        {
            _sharedSync = sharedSync;
            _logger = logger;
        }

        /// <summary>
        /// Get the list of skills
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSkills")]
        public async Task<ActionResult> GetSkills()
        {
            try
            {
                _logger.LogInformation("SharedController: GetSkills");
                _logger.LogInformation("Fetching skills started...");

                var employees = await _sharedSync.GetSkills();

                if (employees == null)
                {
                    _logger.LogWarning("No skills found.");
                    return NoContent();
                }

                _logger.LogInformation("Skills fetched successfully.");
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching skills.");
                return StatusCode(500, "An error occurred while fetching skills.");
            }
        }

        /// <summary>
        /// Get the list of roles
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetRoles")]
        public async Task<ActionResult> GetRoles()
        {
            try
            {
                _logger.LogInformation("SharedController: GetRoles");
                _logger.LogInformation("GetRoles method started");
                var roles = await _sharedSync.GetRoles();

                if (roles == null)
                {
                    _logger.LogWarning("No roles found");
                    return NoContent();
                }

                _logger.LogInformation("GetRoles method completed successfully");
                return Ok(roles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetRoles method");
                return StatusCode(500, "An error occurred in GetRoles method");
            }
        }

        /// <summary>
        /// Get the list of countries with cities
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCountriesWithCities")]
        public async Task<ActionResult> GetCountriesWithCities()
        {
            try
            {
                _logger.LogInformation("SharedController: GetCountriesWithCities");
                _logger.LogInformation("GetCountriesWithCities method started");
                var countries = await _sharedSync.GetCountries();

                if (countries == null)
                {
                    _logger.LogWarning("No records found");
                    return NoContent();
                }

                _logger.LogInformation("GetCountriesWithCities method completed successfully");
                return Ok(countries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in GetCountriesWithCities method");
                return StatusCode(500, "An error occurred in GetCountriesWithCities method");
            }
        }

        /// <summary>
        /// Api to track application analytics
        /// </summary>
        /// <param name="applicationTracker"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("TrackApplicationAnalytics")]
        public async Task<ActionResult> TrackApplicationAnalytics([FromBody]ApplicationTracker applicationTracker)
        {
            try
            {
                _logger.LogInformation("SharedController: TrackApplicationAnalytics");
                _logger.LogInformation("TrackApplicationAnalytics method started");

                if (string.IsNullOrWhiteSpace(applicationTracker?.EmployeeId))
                {
                    _logger.LogWarning("TrackApplicationAnalytics: Invalid or missing EmployeeId in the request.");
                    return BadRequest("TrackApplicationAnalytics: Invalid or missing EmployeeId in the request.");
                }

                await _sharedSync.TrackApplicationAnalytics(applicationTracker);

                _logger.LogInformation("TrackApplicationAnalytics method completed successfully");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in TrackApplicationAnalytics method");
                return Problem(ex.Message);
            }
        }

    }
}

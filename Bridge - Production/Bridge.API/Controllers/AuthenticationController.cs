using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using Microsoft.AspNetCore.Mvc;

namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationControllerSync _iAuthenticationControllerSync;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(IAuthenticationControllerSync iAuthenticationControllerSync, ILogger<AuthenticationController> logger)
        {
            _iAuthenticationControllerSync = iAuthenticationControllerSync;
            _logger = logger;
        }

        [HttpGet]
        [Route("GetEncodedText")]
        /// <summary>
        /// Gets the encoded text using Bse64Encode methodology
        /// </summary>
        /// <param name="text"></param>
        /// <returns>EncodedText</returns>
        public ActionResult GetEncodedText(string text)
        {
            return Ok(Utilities.Base64Encode(text));
        }

        [HttpGet]
        [Route("GetDecodedText")]
        /// <summary>
        /// Gets the decoded text using Bse64Decode methodology
        /// </summary>
        /// <param name="encodedText"></param>
        /// <returns>DecodedText</returns>
        public ActionResult GetDecodedText(string encodedText)
        {
            return Ok(Utilities.Base64Decode(encodedText));
        }

        /// <summary>
        /// Fetching employee details for authentication 
        /// </summary>
        /// <param name="userName"></param>
        /// <returns>EmployeeAuthenticationDetails</returns>
        [HttpGet]
        [Route("GetEmployeeAuthenticationDetails")]
        public async Task<ActionResult> GetEmployeeAuthenticationDetails([FromHeader] string userMailId)
        {
            _logger.LogInformation("AuthenticationController: GetEmployeeAuthenticationDetails");
            _logger.LogTrace("Action started for userMailId: {UserMailId}", userMailId);

            if (string.IsNullOrWhiteSpace(userMailId))
            {
                _logger.LogError("UserMailId is empty or null.");
                return BadRequest();
            }

            var results = await _iAuthenticationControllerSync.GetEmployeeAuthenticationDetails(userMailId);

            if (results == null)
            {
                _logger.LogWarning("No authentication details found for userMailId: {UserMailId}", userMailId);
                return NoContent();
            }

            _logger.LogTrace("Authentication details fetched successfully for userMailId: {UserMailId}", userMailId);

            return Ok(results);
        }
    }
}

using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bridge.API.Controllers
{
    [Authenticate()]
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchSync _searchSync;
        private readonly ILogger<SearchController> _logger;

        public SearchController(ISearchSync searchSync, ILogger<SearchController> logger)
        {
            _searchSync = searchSync;
            _logger = logger;
        }

        /// <summary>
        /// Fetching the search results
        /// </summary>
        /// <param name="searchRequest"></param>
        /// <returns>SearchResult</returns>
        [HttpPost]
        [Route("GlobalSearch")]
        public async Task<ActionResult<SearchResult>> GlobalSearch(SearchRequest searchRequest)
        {

            _logger.LogInformation("SearchController: GlobalSearch");
            if (string.IsNullOrWhiteSpace(searchRequest.SearchElement))
            {
                _logger.LogError("SearchElement is empty or null.");
                return BadRequest();
            }
            _logger.LogInformation($"Performing global search for: {searchRequest.SearchElement}");

            var results = await _searchSync.GlobalSearch(searchRequest.SearchElement, searchRequest.IsManager, searchRequest.EmployeeId);

            if (results == null)
            {
                _logger.LogInformation("No search results found.");
                return NoContent();
            }

            _logger.LogInformation("Global search completed successfully.");
            return Ok(results);
        }
    }
}

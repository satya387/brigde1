using Bridge.Infrastructure.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;

namespace Bridge.API
{
    [ExcludeFromCodeCoverage]
    public class AuthenticateAttribute : TypeFilterAttribute
    {
        public AuthenticateAttribute() : base(typeof(EmployeeAuthenticationFilter))
        {
        }
    }
    [ExcludeFromCodeCoverage]
    public class EmployeeAuthenticationFilter : IAuthorizationFilter
    {
        private readonly IDistributedCache _distributedCache;
        private readonly IConfiguration _configuration;
        public EmployeeAuthenticationFilter(IDistributedCache distributedCache, IConfiguration configuration)
        {
            _configuration = configuration;
            _distributedCache = distributedCache;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (_configuration["Authentication:Enabled"] == "false")
                return;

            var username = context.HttpContext.Request?.Headers["username"].ToString().ToLower();
            var bearerToken = context.HttpContext.Request?.Headers["Bearer_Token"].ToString();
            var cachedBytes = _distributedCache.Get(username);
            string cachedBearerToken = null;

            if (cachedBytes != null)
                cachedBearerToken = Encoding.UTF8.GetString(cachedBytes, 0, cachedBytes.Length);

            if (string.IsNullOrEmpty(cachedBearerToken) || cachedBearerToken != bearerToken)
            {
                EmployeeBaseInfo employeeBaseInfo = null;
                using (var client = new HttpClient())
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, _configuration["Authentication:Url"]);
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);
                    HttpResponseMessage emplResponse = client.Send(request);
                    var emplResponseContent = emplResponse.Content.ReadAsStringAsync().Result;
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    employeeBaseInfo = JsonSerializer.Deserialize<EmployeeBaseInfo>(emplResponseContent, options);
                }
                if (employeeBaseInfo == null || employeeBaseInfo.UserPrincipalName == null || employeeBaseInfo.UserPrincipalName.ToLower() != username.ToLower())
                {
                    context.Result = new JsonResult("Unauthorized access!")
                    {
                        StatusCode = 401,
                        Value = "Unauthorized access!"
                    };
                }
                else
                {
                    var expTime = Convert.ToInt16(_configuration["Authentication:ExpiryInMinutes"]);
                    var stringBytes = Encoding.ASCII.GetBytes(bearerToken);
                    var dco = new DistributedCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(expTime))
                        .SetAbsoluteExpiration(TimeSpan.FromMinutes(expTime * 2));
                    _distributedCache.Set(username, stringBytes, dco);
                }
            }
        }
    }
    
}

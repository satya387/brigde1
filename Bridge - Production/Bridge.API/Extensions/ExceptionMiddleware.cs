using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Reflection;

namespace Bridge.API.Extensions
{
    public static class EventLoggingConstants
    {
        // Generic event information 
        /// <summary>
        /// Constant for UTC timestamp format
        /// </summary>
        public const string UTC_Format = "yyyy-MM-ddThh:mm:ss.s";

        /// <summary>
        /// Constant for timestamp in UTC
        /// </summary>
        public const string UTC = "UTC";
        /// <summary>
        /// Constant for name of the user of the application
        /// </summary>
        public const string Username = "username";
        /// <summary>
        /// Constant for simulation created by user
        /// </summary>
        public const string CreatedBy = "createdby";
        /// <summary>
        /// Constant for Session identifier or hashkey
        /// </summary>
        public const string SessionIdentifier = "sessionIdentifier";
        /// <summary>
        /// Constant for Assembly Name
        /// </summary>
        public const string AssemblyName = "assemblyName";
        /// <summary>
        /// Constant for Assembly Version
        /// </summary>
        public const string AssemblyVersion = "assemblyVersion";
        /// <summary>
        /// Constant for Method Name
        /// </summary>
        public const string MethodName = "methodName";
       
        /// <summary>
        /// Constant for Simulation ID
        /// </summary>
    
        /// <summary>
        /// Constant for Event Type
        /// </summary>
        public const string EventType = "eventType";
        /// <summary>
        /// Constant for Logged in user ID
        /// </summary>
        public const string LoggedInUser = "Logged In User ID";

        // Additional event information
 
        /// <summary>
        /// Constant for request JSON object
        /// </summary>
        public const string RequestObject = "requestObject";
        /// <summary>
        /// Constant for Model Number
        /// </summary>
        public const string ModelNumber = "modelNumber";
        /// <summary>
        /// Constant for Summary Statistics File Name
        /// </summary>
        public const string FileName = "fileName";
        /// <summary>
        /// Constant for Summary Statistics File Name
        /// </summary>
        public const string ErrorMessage = "errorMessage";
        /// <summary>
        /// Constant for FavoritesDesign - design key
        /// </summary>
        public const string DesignKey = "designKey";
        /// <summary>
        /// Constant for FavoriteScenario - scenario key
        /// </summary>
        public const string ScenarioKey = "ScenarioKey";
        /// <summary>
        /// Constant for FavoritesDesign - favorite flag
        /// </summary>
        public const string FavoriteFlag = "favoriteFlag";
        /// <summary>
        /// Constant for FavoriteScenario - Scenario Flag
        /// </summary>
        public const string ScenarioFlag = "scenarioFlag";
        /// <summary>
        /// Constant for FavoritesDesign - Simulation Model Name
        /// </summary>
        public const string SimModelName = "simModelName";
        /// <summary>
        /// Constant for FavoritesDesign - Color
        /// </summary>
        public const string Color = "color";
        /// <summary>
        /// Constant for FavoritesDesign - Name
        /// </summary>
        public const string Name = "name";
        /// <summary>
        /// Constant for FavoriteScenario - Color
        /// </summary>
        public const string ScenarioColor = "scenarioColor";
        /// <summary>
        /// Constant for FavoriteScenario - Name
        /// </summary>
        public const string ScnearioName = "scnearioName";
        /// <summary>
        /// Constant for SessionModel - JSON object
        /// </summary>
        public const string SessionModelObject = "sessionModelObject";
        /// <summary>
        /// Constant for SessionModel - Version
        /// </summary>
        public const string SessionModelVersion = "sessionModelVersion";
        /// <summary>
        /// Constant for SessionModel - Name
        /// </summary>
        public const string SessionModelName = "sessionModelName";
        /// <summary>
        /// Constant for SessionModel - TempSave
        /// </summary>
        public const string SessionModelTempSave = "sessionModelTempSave";
        /// <summary>
        /// Constant for Statistical Design Models list
        /// </summary>
        public const string StatisticalDesignModelsListCount = "statisticalDesignModelsListCount";
        /// <summary>
        /// Constant for Design Wise Pareto list
        /// </summary>
        public const string DesignWiseParetoListCount = "designWiseParetoListCount";

        // Exception information

        /// <summary>
        /// Constant for Http Status Code
        /// </summary>
        public const string StatusCode = "statusCode";
        /// <summary>
        /// Constant for Http Content Type
        /// </summary>
        public const string ContentType = "contentType";
        /// <summary>
        /// Constant for Http Error Message
        /// </summary>
        public const string Message = "message";
        /// <summary>
        /// Constant for internal exception message
        /// </summary>
        public const string InternalErrorMessage = "internalErrorMessage";
        /// <summary>
        /// Constant for stack trace
        /// </summary>
        public const string StackTrace = "stackTrace";

        /// <summary>
        /// Constant for ServiceName
        /// </summary>
        public const string ServiceName = "serviceName";
        /// <summary>
        /// Constant for ApplicationName
        /// </summary>
        public const string ApplicationName = "applicationName";
        /// <summary>
        /// Constant for StartTime
        /// </summary>
        public const string StartTime = "StartTime";
        /// <summary>
        /// Constant for EndTime
        /// </summary>
        public const string EndTime = "EndTime";
        /// <summary>
        /// Constant for ElaspedTime
        /// </summary>
        public const string ElaspedTime = "ElaspedTime";

        // Application and service constants
        /// <summary>
        /// Constant for ElaspedTime
        /// </summary>
        public const string QueryService = "Query";
        /// <summary>
        /// Constant for Solara
        /// </summary>
        public const string Solara = "Solara";
        /// <summary>
        /// Constant for EndpointType
        /// </summary>
        public const string EndpointType = "EndpointType";
        /// <summary>
        /// Constant for ResourceID
        /// </summary>
        public const string ResourceID = "ResourceID";

        /// <summary>
        /// constant for filter  in design finder filters
        /// </summary>
        public const string filterSetID = "filterSetID";

        /// <summary>
        /// constant for search result count
        /// </summary>
        public const string ResultCount = "ResultCount";

        /// <summary>
        /// Filter set name.
        /// </summary>
        public const string FilterSetName = "FilterSetName";

        /// <summary>
        ///  ThresholdValue1
        /// </summary>
        public const string ThresholdValue1 = "ThresholdValue1";

        /// <summary>
        /// ThresholdValue2
        /// </summary>
        public const string ThresholdValue2 = "ThresholdValue2";

        /// <summary>
        /// IsModifiedSimulation
        /// </summary>
        public const string IsModifiedSimulation = "IsModifiedSimulation";

        ///Redis Constants
        /// <summary>
        /// IsModifiedSimulation
        /// </summary>
        public const string RedisKey = "RedisKey";

        /// <summary>
        /// Prior Number.
        /// </summary>
        public const string PriorNumber = "PriorNumber";

        /// <summary>
        /// Sub Prior Number.
        /// </summary>
        public const string SubPriorNumber = "SubPriorNumber";

        /// <summary>
        /// Custom FileName.
        /// </summary>
        public const string CustomFileName = "CustomFileName";

        /// <summary>
        /// Custom FizeSize.
        /// </summary>
        public const string CustomFizeSize = "CustomFizeSize";

        /// <summary>
        /// Is New File.
        /// </summary>
        public const string IsNewFile = "isNewFile";

        /// <summary>
        /// Is Last Chunk.
        /// </summary>
        public const string IsLastChunk = "isLastChunk";
    }
    /// <summary>
    /// Middleware definition for Global Exception Handler
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class ExceptionMiddleware
    {
        /// <summary>
        /// Telemetry client object.
        /// </summary>
        private static TelemetryClient _telemetryClient;

        /// <summary>
        /// Create telemetry client object.
        /// </summary>
        /// <param name="instrumentationKey">Application Insights Instrumentation Key.</param>
        /// <returns>TelemetryClient object.</returns>
        private static TelemetryClient GetTelemetryClient(string instrumentationKey)
        {
            var teleConfig = new TelemetryConfiguration
            {
                InstrumentationKey = instrumentationKey
            };
            TelemetryClient telemetryClient = new TelemetryClient(teleConfig);
            return telemetryClient;
        }

        /// <summary>
        /// Configures Exception Handler
        /// </summary>
        /// <param name="app">Application Builder Object</param>
        /// <param name="instrumentationKey">Application Insights Instrumentation Key.</param>
        public static void ConfigureExceptionHandler(this IApplicationBuilder app, string instrumentationKey)
        {
            // Create telemetry client object.
            _telemetryClient = GetTelemetryClient(instrumentationKey);
            
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        // Add exception telemetry into Application Insights.
                        AddExceptionTelemetry(contextFeature, context);
                         
                        await context.Response.WriteAsync(new ErrorDetails()
                        {
                            StatusCode = context.Response.StatusCode,
                            Message = "INTERNAL_SERVER_ERROR"
                        }.ToString()).ConfigureAwait(false);
                    }
                });
            });
        }

        /// <summary>
        /// This method is used to add exception telemetry into Application Insights.
        /// </summary>
        /// <param name="contextFeature">Object of IExceptionHandlerFeature.</param>
        /// <param name="context">Http Context.</param>
        private static void AddExceptionTelemetry(IExceptionHandlerFeature contextFeature, HttpContext context)
        {
            Dictionary<string, string> properties = new Dictionary<string, string>();

            // Add common properties
            // Add UTC timestamp
            properties.Add(EventLoggingConstants.UTC, DateTime.UtcNow.ToString(EventLoggingConstants.UTC_Format));
            // Add Assembly name and version
            properties.Add(EventLoggingConstants.AssemblyName, Assembly.GetExecutingAssembly().GetName().Name);
            properties.Add(EventLoggingConstants.AssemblyVersion, Assembly.GetExecutingAssembly().GetName().Version?.ToString());

            // Add username and hashkey
            if (context.Request.Headers != null && !string.IsNullOrEmpty(context.Request.Headers["username"]))
            {
                // Add user name
                properties.Add(EventLoggingConstants.Username, context.Request.Headers["username"]);
            }

            if (context.Request.Headers != null && !string.IsNullOrEmpty(context.Request.Headers["hashkey"]))
            {
                // Add session identifier (HashKey)
                properties.Add(EventLoggingConstants.SessionIdentifier, context.Request.Headers["hashkey"]);
            }


            // Add exception specific properties
            properties.Add(EventLoggingConstants.StatusCode, context.Response.StatusCode.ToString());
            properties.Add(EventLoggingConstants.ContentType, context.Response.ContentType.ToString());
           // properties.Add(EventLoggingConstants.Message, ExceptionMessageCodes.INTERNAL_SERVER_ERROR);
            properties.Add(EventLoggingConstants.InternalErrorMessage, contextFeature.Error.Message);
            properties.Add(EventLoggingConstants.StackTrace, contextFeature.Error.StackTrace);

            // Log exception telemetry in Application Insights 
            _telemetryClient.TrackException(contextFeature.Error, properties);
            _telemetryClient.Flush();
        }
    }

    public class ErrorDetails
    {
        public ErrorDetails()
        {
        }

        public int StatusCode { get; set; }
        public object Message { get; set; }
    }
}

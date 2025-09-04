using Bridge.API;
using Bridge.API.DAO;
using Bridge.API.Extensions;
using Bridge.API.Synchronizer;
using Bridge.Infrastructure.Interfaces;
using Bridge.SyncProvider.Sql;
using Serilog;
using Serilog.Events;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var basePath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
var configuration = new ConfigurationBuilder()
    .SetBasePath(basePath)
    .AddJsonFile("appsettings.json", optional: false)
    .Build();

var logFilePath = configuration["LogFilePath"] ;

var minimumLogLevel = configuration["Serilog:MinimumLogLevel"];
var serilogMinimumLogLevel = ParseMinimumLogLevel(minimumLogLevel);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Is(serilogMinimumLogLevel)
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .WriteTo.File(logFilePath, rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Logging.AddSerilog();

LogEventLevel ParseMinimumLogLevel(string minimumLogLevel)
{
    return minimumLogLevel switch
    {
        "Verbose" => LogEventLevel.Verbose,
        "Debug" => LogEventLevel.Debug,
        "Information" => LogEventLevel.Information,
        "Warning" => LogEventLevel.Warning,
        "Error" => LogEventLevel.Error,
        "Fatal" => LogEventLevel.Fatal,
        _ => LogEventLevel.Error
    };
}

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwagger();

builder.Services.AddScoped<IResourceRequestSync, ResourceRequestSync>();
builder.Services.AddScoped<IResourceRequestDAO, ResourceRequestDAO>();
builder.Services.AddScoped<IEmployeeSync, EmployeeSync>();
builder.Services.AddScoped<IEmployeeDAO, EmployeeDAO>();
builder.Services.AddScoped<ISyncProvider, SqlSyncProvider>();

builder.Services.AddScoped<IFilterSync, FilterSync>();
builder.Services.AddScoped<IFilterDAO, FilterDAO>();
builder.Services.AddScoped<ISearchSync, SearchSync>();
builder.Services.AddScoped<IAuthenticationControllerSync, AuthenticationControllerSync>();
builder.Services.AddScoped<ISharedSync, SharedSync>();
builder.Services.AddScoped<ISharedDAO, SharedDAO>();
builder.Services.AddScoped<IWFMHandlerSync, WFMHandlerSync>();
builder.Services.AddScoped<IWFMHandlerDAO, WFMHandlerDAO>();
builder.Services.AddScoped<IManagerSync, ManagerSync>();
builder.Services.AddScoped<IManagerDAO, ManagerDAO>();
builder.Services.AddScoped<IReportsSync, ReportsSync>();
builder.Services.AddScoped<IReportsDAO, ReportsDAO>();

builder.Services.AddScoped<IUtilityDAO, UtilityDAO>();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddCors();

builder.Services.AddApplicationInsightsTelemetry(configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    var utilityDAO = serviceProvider.GetRequiredService<IUtilityDAO>();

    await utilityDAO.CacheBridgeConfigSettings();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});

app.UseHttpsRedirection();
 
app.UseAuthorization();

app.MapControllers();

var instrumentationKey = configuration["ApplicationInsights:InstrumentationKey"];
app.ConfigureExceptionHandler(instrumentationKey);

app.Run();

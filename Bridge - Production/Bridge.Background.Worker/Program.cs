using Bridge.Background.Worker;
using Bridge.Infrastructure.Entities.Enum;
using Bridge.Infrastructure.Interfaces;
using Bridge.SyncProvider.Sql;
using Microsoft.Extensions.Logging.Configuration;
using Microsoft.Extensions.Logging.EventLog;
using Serilog;
using Serilog.Events;
using System.Reflection;

public class Program
{
    public static void Main(string[] args)
    {
        var basePath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        var serviceName = configuration["BackgroundWorkerService"];


        string logFilePath = Path.Combine("C:\\", "BridgeAppLog", "BgServicelog.txt");
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.File(logFilePath, rollingInterval: RollingInterval.Month)
            .CreateLogger();

        try
        {
            CreateHostBuilder(args, serviceName).Build().Run();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    public static IHostBuilder CreateHostBuilder(string[] args, string serviceName) =>
        
    Host.CreateDefaultBuilder(args)

        .UseWindowsService(options =>
        {
            options.ServiceName = serviceName;
        })
        .ConfigureServices((hostContext, services) =>
        {
            LoggerProviderOptions.RegisterProviderOptions<
            EventLogSettings, EventLogLoggerProvider>(services);
            services.AddSingleton<RRAlertSvc>();
            services.AddHostedService<RRAlertWorker>();
            services.AddSingleton<ISyncProvider, SqlSyncProvider>();
            services.AddSingleton<ManagerInterviewStatusAlertSvc>();
            services.AddSingleton<Utility>();
        })
        .ConfigureLogging((hostContext, logging) =>
        {
            logging.ClearProviders();
            logging.AddSerilog();
        });
}

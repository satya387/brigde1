using Bridge.Infrastructure.Entities.Enum;

namespace Bridge.Background.Worker
{
    public class RRAlertWorker : BackgroundService
    {
        private readonly ILogger<RRAlertWorker> _logger;
        private readonly RRAlertSvc _rRAlertSvc;
        private readonly IConfiguration _configuration;
        private readonly ManagerInterviewStatusAlertSvc _managerInterviewStatusAlertSvc;

        public RRAlertWorker(ILogger<RRAlertWorker> logger, RRAlertSvc rRAlertSvc, IConfiguration configuration, ManagerInterviewStatusAlertSvc managerInterviewStatusAlertSvc)
        {
            _logger = logger;
            _rRAlertSvc = rRAlertSvc;
            _configuration = configuration;
            _managerInterviewStatusAlertSvc = managerInterviewStatusAlertSvc;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                _logger.LogInformation("Bridge background worker ExecuteAsync started: {DateTime}", DateTime.Now);
                while (!stoppingToken.IsCancellationRequested)
                {
                    DateTime nextRunTime = _configuration.GetValue<DateTime>("MailTriggerTimeSet");
                    DateTime now = DateTime.Now;

                    while (nextRunTime.DayOfWeek == DayOfWeek.Saturday || nextRunTime.DayOfWeek == DayOfWeek.Sunday)
                    {
                        nextRunTime = nextRunTime.AddDays(1);
                    }

                    if (now >= nextRunTime)
                    {
                        nextRunTime = nextRunTime.AddDays(1);
                    }
                    TimeSpan delay = nextRunTime - now;

                    await Task.Delay(delay, stoppingToken);
                    _logger.LogInformation("Bridge background worker service started: {DateTime}", DateTime.Now);

                    // Note : Depending on the which service we have to run, give that name in appsetting.json like "BackgroundWorkerService": "ManagerInterviewStatusAlertWorker", or "BackgroundWorkerService": "RRAlert",
                    string backgroundWorkerService = _configuration.GetValue<string>("BackgroundWorkerService");
                    if (backgroundWorkerService == BackgroundWorkerServiceType.BridgeRRAlertService.ToString())
                    {
                        await _rRAlertSvc.ProcessRRAlert();
                    }
                    if (backgroundWorkerService == BackgroundWorkerServiceType.BridgeManagerInterviewStatusService.ToString())
                    {
                        await _managerInterviewStatusAlertSvc.ProcessManagerInterviewStatusAlert();
                    }
                    _logger.LogInformation("Bridge background worker service completed: {DateTime}", DateTime.Now);
                }
            }
            catch (TaskCanceledException)
            {
                _logger.LogError("Bridge background worker service was stopped: {DateTime}", DateTime.Now);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{Message}", ex.Message);
                Environment.Exit(1);
            }
        }
    }
}
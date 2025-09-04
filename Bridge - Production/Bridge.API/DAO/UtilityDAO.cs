using Bridge.API.DAO.Mappers;
using Bridge.API.DAO.QueryBuilder;
using Bridge.Infrastructure.Entities.Constant;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace Bridge.API.DAO
{
    public class UtilityDAO : IUtilityDAO
    {
        private readonly ILogger<UtilityDAO> _logger;
        private readonly IConfiguration _configuration;
        private static string connectionString;
        private readonly ISyncProvider _syncProvider;
        private readonly IDistributedCache _distributedCache;


        public UtilityDAO(ILogger<UtilityDAO> logger, IConfiguration configuration, ISyncProvider syncProvider, IDistributedCache distributedCache)
        {
            _logger = logger;
            _configuration = configuration;
            _syncProvider = syncProvider;
            _distributedCache = distributedCache;
        }

        public async Task CacheBridgeConfigSettings()
        {
            _logger.LogInformation("UtilityDAO: GetBridgeConfigSettings started.");
            try
            {
                var cachedBytes = _distributedCache.Get(UtilityConstant.BRIDGE_CONFIGSETTINGS_CACHEKEY);

                if (cachedBytes == null)
                {
                    _logger.LogInformation("CacheBridgeConfigSettings : Cache is empty. Fetching BridgeConfigSettings from data source.");

                    connectionString = _configuration.GetConnectionString(UtilityConstant.ArcConnectionStringName);

                    var getBridgeConfigSettings = await _syncProvider.GetByStoredProcedure(connectionString, UtilityQueryBuilder.GET_BRIDGE_CONFIG_SETTINGS, new List<QueryParameters>());

                    var bridgeConfigSettingsValues = UtilityMapper.MapBridgeConfigSetting(getBridgeConfigSettings);

                    byte[] stringBytes = JsonSerializer.SerializeToUtf8Bytes(bridgeConfigSettingsValues);

                    double ExpiryTimeDefaultValueInMins = 1000;

                    var expiryTime = bridgeConfigSettingsValues.FirstOrDefault(x => x.Name == UtilityConstant.CACHE_EXPIRYINMINUTES);
                    double expTime = expiryTime != null && double.TryParse(expiryTime.Value, out var parsedValue) ? parsedValue : ExpiryTimeDefaultValueInMins;


                    var dco = new DistributedCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(expTime))
                        .SetAbsoluteExpiration(TimeSpan.FromMinutes(expTime * 2));
                    _distributedCache.Set(UtilityConstant.BRIDGE_CONFIGSETTINGS_CACHEKEY, stringBytes, dco);

                    _logger.LogInformation("UtilityDAO: CacheBridgeConfigSettings completed successfully.");
                }
                else
                {
                    _logger.LogInformation("CacheBridgeConfigSettings : Cache already contains BridgeConfigSettings. Skipping fetch from data source.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred in CacheBridgeConfigSettings: {ex}");
                throw;
            }
        }

        public string GetConfigValue(string configName)
        {
            try
            {
                _logger.LogInformation("GetConfigValue: GetConfigValue started.");
                var cachedBytes = _distributedCache.Get(UtilityConstant.BRIDGE_CONFIGSETTINGS_CACHEKEY);
                var configValue = string.Empty;

                if (cachedBytes == null)
                {
                    _logger.LogInformation("Cache is empty or configValue is null or empty. Calling CacheBridgeConfigSettings.");
                    CacheBridgeConfigSettings();
                }

                if (cachedBytes != null)
                {
                    var jsonToDeserialize = System.Text.Encoding.UTF8.GetString(cachedBytes);

                    var cachedResult = JsonSerializer.Deserialize<IEnumerable<BridgeConfigSettings>>(jsonToDeserialize);

                    configValue = cachedResult
                        .FirstOrDefault(x => x.Name == configName)
                        ?.Value;

                    _logger.LogInformation($"ConfigValue for '{configName}': {configValue}");
                }

                return configValue;
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred in GetConfigValue: {ex}");
                throw;
            }
        }
    }
}

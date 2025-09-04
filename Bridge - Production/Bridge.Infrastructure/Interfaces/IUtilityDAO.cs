using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IUtilityDAO
    {
        Task CacheBridgeConfigSettings();
        string GetConfigValue(string name);
    }
}

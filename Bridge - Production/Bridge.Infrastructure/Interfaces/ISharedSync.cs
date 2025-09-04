using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface ISharedSync
    {
        public Task<List<Skills>> GetSkills();
        public Task<List<Roles>> GetRoles();
        public Task<List<Country>> GetCountries();
        public Task<List<City>> GetCities();
        Task TrackApplicationAnalytics(ApplicationTracker applicationTracker);
    }
}

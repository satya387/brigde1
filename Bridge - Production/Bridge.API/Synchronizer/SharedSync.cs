using Bridge.API.DAO;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;

namespace Bridge.API.Synchronizer
{
    public class SharedSync : ISharedSync
    {
        private readonly ISharedDAO _sharedDAO;

        public SharedSync(ISharedDAO sharedDAO)
        {
            _sharedDAO = sharedDAO;
        }
        public async Task<List<Skills>> GetSkills()
        {
            return await _sharedDAO.GetSkills();
        }

        public async Task<List<Roles>> GetRoles()
        {
            return await _sharedDAO.GetRoles();
        }
        public async Task<List<Country>> GetCountries()
        {
            var countries = await _sharedDAO.GetCountries();
            var cities = await _sharedDAO.GetCities();

            if (countries == null || cities == null)
                return null;

            foreach (var country in countries)
            {
                country.Cities = cities.Where(c => c.Country == country.Code).ToList();
            }
            return countries;
        }
        public async Task<List<City>> GetCities()
        {
            return await _sharedDAO.GetCities();
        }

        public async Task TrackApplicationAnalytics(ApplicationTracker applicationTracker)
        {
            await _sharedDAO.TrackApplicationAnalytics(applicationTracker);
        }

    }
}

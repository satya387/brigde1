using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Utility;
using System.Data;

namespace Bridge.API.DAO.Mappers
{
    public class SharedMapper
    {
        public static List<Skills> MapListOfSkills(DataTable skills)
        {
            var skillList = new List<Skills>();
            foreach (DataRow row in skills.Rows)
            {
                var skill = new Skills()
                {
                    SkillName = Utilities.CheckDBNullForString(row, "Technology")
                };
                skillList.Add(skill);
            }
            return skillList;
        }

        public static List<Roles> MapListOfRoles(DataTable roles)
        {
            var roleList = new List<Roles>();
            var uniqueRoleNames = new HashSet<string>();

            foreach (DataRow row in roles.Rows)
            {
                var roleName = Utilities.CheckDBNullForString(row, "Designation");

                if (!uniqueRoleNames.Contains(roleName))
                {
                    var role = new Roles()
                    {
                        RoleName = roleName,
                    };
                    roleList.Add(role);

                    uniqueRoleNames.Add(roleName);
                }
            }

            roleList = roleList.OrderBy(role => role.RoleName).ToList();
            return roleList;
        }

        public static List<Country> MapListOfCountries(DataTable countries)
        {
            var countryList = new List<Country>();
            foreach (DataRow row in countries.Rows)
            {
                var country = new Country()
                {
                    LocationId = Utilities.CheckDBNullForInt(row, "LocationId").Value,
                    Code = Utilities.CheckDBNullForString(row, "Code"),
                    LocationName = Utilities.CheckDBNullForString(row, "LocationName"),
                };
                countryList.Add(country);
            }
            return countryList;
        }

        public static List<City> MapListOfCities(DataTable cities)
        {
            var cityList = new List<City>();
            foreach (DataRow row in cities.Rows)
            {
                var city = new City()
                {
                    Id = Utilities.CheckDBNullForInt(row, "Id").Value,
                    CityName = Utilities.CheckDBNullForString(row, "CityName"),
                    Country = Utilities.CheckDBNullForString(row, "Country"),
                };
                cityList.Add(city);
            }
            return cityList;
        }

    }
}

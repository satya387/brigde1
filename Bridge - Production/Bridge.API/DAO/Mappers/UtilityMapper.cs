using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Utility;
using System.Data;

namespace Bridge.API.DAO.Mappers
{
    public static class UtilityMapper
    {
        public static List<BridgeConfigSettings> MapBridgeConfigSetting(DataTable bridgeConfigSettingdata)
        {
            var bridgeConfigSettings = new List<BridgeConfigSettings>();
            foreach (DataRow row in bridgeConfigSettingdata.Rows)
            {
                var bridgeConfigSetting = new BridgeConfigSettings()
                {
                    Name = Utilities.CheckDBNullForString(row, "Name"),
                    Value = Utilities.CheckDBNullForString(row, "Value"),
                };
                bridgeConfigSettings.Add(bridgeConfigSetting);
            }
            return bridgeConfigSettings;
        }
    }
}

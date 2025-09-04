namespace Bridge.Infrastructure.Entities.Constant
{
    public class UtilityConstant
    {
        public const string BridgeConnectionStringName = "BridgeDBContext";
        public const string ArcConnectionStringName = "ArcDBContext";
        public const string AccountNameToFilter = "LAUNCHPAD";
        public const string DiscussionInitiated = "Discussion Initiated";

        public const string PrimarySkill = "PrimarySkill ";
        public const string SecondarySkill = "SecondarySkill ";
        public const string Designation = "Designation ";
        public const string Location = "Location ";
        public const string Experience = "Experience ";
        public const string WfmAccount = "WORKFORCE MANAGEMENT";
        public const string CountryUS = "US";
        public const string CountryUSA = "USA";
        public const string AllocationRequested = "AllocationRequested";
        public const string Earmarked = "Earmarked"; 

        public const string PIP = "This talent status is set as  <q>PIP</q>. Please update the talent status before allocation";
        public const string CUSTOMERINTERVIEW = "This talent status is set as <q>Customer Interview</q>. Please update the talent status before allocation";
        public const string MATERNITYLEAVE = "This talent status is set as <q>Maternity Leave</q>. Please update the talent status before allocation";
        public const string UNAVAILABLEPOOL = "This talent status is set as <q>Unavailable</q>. Please update the talent status before allocation";
        public const string EARMARKED_Message= "This talent is already allocated under different RR and cannot be allocated. Please check the Resource Status";
        public const string  RESIGNED="This talent status is set as <q>Resigned</q>. Cannot allocate the resource to a project";

        public const string FILEFORMAT = "vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        public const string FILEFORMAT_PDF = "PDF";
        public const string FILEFORMAT_XLSX = "xls";
        public const string BRIDGE_CONFIGSETTINGS_CACHEKEY = "BridgeConfigSettings";
        public const string MAX_APPLIEDOPPORTUNITY_NUMBER = "MaxAppliedOpportunityNumber";
        public const string CACHE_EXPIRYINMINUTES = "CacheExpiryInMinutes";
    }
}

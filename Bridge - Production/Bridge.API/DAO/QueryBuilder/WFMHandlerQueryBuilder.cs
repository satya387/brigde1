namespace Bridge.API.DAO.QueryBuilder
{
    public class WFMHandlerQueryBuilder
    {
        #region SP's and Views
        public const string UPSERT_RESOURCE_AVAILABILITY = "UpsertResourceAvailability";
        public const string GET_ALL_AVAILABLE_RESOURCES = "GetAllLaunchpadEmployees";
        public const string USP_GET_FUTUREAVAILABLERESOURCES = "USP_Get_FutureAvailableresources";
        public const string GET_WFM_EMPLOYEES = "GetWFMEmployees";
        public const string GET_RESOURCE_ALLOCATIONDETAILS = "USP_GetResourceAllocationDetails";
        public const string UPSERT_SELF_SUMMARY_DEATILS = "Upsert_SelfSummaryDeatils";
        public const string USP_GETRESOURCESBY_WFM = "USP_GetResourcesByWFM";
        public const string UPSERT_RESOURCEREQUESTSCOMMENTS = "Upsert_ResourceRequestsComments";
        public const string USP_GET_RESOURCEREQUESTSCOMMENTS = "USP_GET_ResourceRequestsComments";
        public const string USP_GET_DECLINED_AND_DROPPED_COMMENTS = "USP_GetDeclinedAndDroppedComments";
        public const string USP_GET_DROPPED_APPLICATIONS = "USP_GetDroppedApplications";
        #endregion
    }
}
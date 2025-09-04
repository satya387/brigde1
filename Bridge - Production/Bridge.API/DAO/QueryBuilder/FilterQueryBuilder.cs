namespace Bridge.API.DAO.QueryBuilder
{
    public static class FilterQueryBuilder
    {
        #region SP's and Views
        public const string GET_ACTIVE_RRS_PROJECT_DETAILS = "USP_GetActiveRRsProjectDetails";
        #endregion

        #region Insert or Update Queries
        public const string OpportunityFilter_Save = "Insert into EmployeeMyJobsSearchCriteria (EmployeeId, MinExperienceInYears, PrimarySkills, Location, Role, " +
            "IsActive, CreatedOn, Country, MaxExperienceInYears, ProjectName) values ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}')";
        public const string OpportunityFilter_Update = "update EmployeeMyJobsSearchCriteria set MinExperienceInYears= '{1}', Location = '{2}', PrimarySkills= '{3}', " +
            "Role= '{4}', IsActive = '{5}', ModifiedOn = '{6}', Country = '{7}', MaxExperienceInYears= '{8}', ProjectName = '{9}' where Id = {0}";
        #endregion

        #region Select Queries
        public const string OpportunityFilter_Get = "Select Id, EmployeeId, MinExperienceInYears, MaxExperienceInYears, PrimarySkills, [Location], [Role], [Country], ProjectName From EmployeeMyJobsSearchCriteria(Nolock) " +
            "where EmployeeId = '{0}'";
        public const string OpportunityFilter_Exist = "select Id from EmployeeMyJobsSearchCriteria(Nolock) where EmployeeId = '{0}'";
        #endregion

    }
}

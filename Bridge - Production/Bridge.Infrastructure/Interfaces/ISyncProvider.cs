using Bridge.Infrastructure.Entities;
using System.Data;

namespace Bridge.Infrastructure.Interfaces
{
    public interface ISyncProvider
    {
        public Task<DataTable> GetByQuery(string connectionString, string queryText);
        public Task<DataTable> GetByStoredProcedure(string connectionString, string procedureName, List<QueryParameters> parameters);
        public Task<int> UpsertByStoredProcedure(string connectionString, string procedureName, List<QueryParameters> parameters);
        Task<int> InsertOrUpdateByQuery(string connectionString, string queryText);
    }
}

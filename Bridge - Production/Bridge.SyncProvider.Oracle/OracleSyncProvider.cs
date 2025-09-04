using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;
using System.Data;
using System.Data.OracleClient;
using System.Diagnostics.CodeAnalysis;

namespace Bridge.SyncProvider.Oracle
{
    [ExcludeFromCodeCoverage]
    public class OracleSyncProvider : ISyncProvider
    {
        public async Task<DataTable> GetByQuery(string connectionString, string queryText)
        {
            DataTable datatable = new DataTable();
            try
            {
                await using (OracleConnection oracleConnection = new OracleConnection(Utilities.Base64Decode(connectionString)))
                {
                    // Open the connection
                    oracleConnection.Open();
                    OracleCommand command = new OracleCommand(queryText, oracleConnection);
                    using(var adapter = new OracleDataAdapter(command))
                    {
                        command.ExecuteNonQuery();
                        adapter.Fill(datatable);
                    }
                }
            }
            catch (OracleException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return datatable;
        }

        public Task<DataTable> GetByStoredProcedure(string connectionString, string procedureName, List<QueryParameters> parameters)
        {
            throw new NotImplementedException();
        }

        public async Task<int> UpsertByStoredProcedure(string connectionString, string procedureName, List<QueryParameters> parameters)
        {
            var result = 0;
            try
            {
                await using (OracleConnection sqlConnection = new OracleConnection(Utilities.Base64Decode(connectionString)))
                {
                    // Open the connection
                    sqlConnection.Open();
                    using (OracleCommand command = new OracleCommand(procedureName, sqlConnection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandTimeout = 120;

                        foreach (var param in parameters)
                        {
                            var parameter = new OracleParameter();
                            parameter.ParameterName = param.ValueName;
                            parameter.Value = param.Value;
                            parameter.DbType = param.ValueType;
                            parameter.Direction = param.ValueDirection;
                            command.Parameters.Add(parameter);

                        }
                        result = command.ExecuteNonQuery();
                    }
                }
            }
            catch (OracleException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return result;
        }


        public Task<int> InsertOrUpdateByQuery(string connectionString, string queryText)
        {
            throw new NotImplementedException();
        }
    }
}

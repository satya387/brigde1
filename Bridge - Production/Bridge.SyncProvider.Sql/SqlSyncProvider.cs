using System.Data;
using System.Data.SqlClient;
using System.Diagnostics.CodeAnalysis;
using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Bridge.Infrastructure.Utility;

namespace Bridge.SyncProvider.Sql
{
    [ExcludeFromCodeCoverage]
    public class SqlSyncProvider: ISyncProvider
    {
        public async Task<DataTable> GetByQuery(string connectionString, string queryText)
        {
            DataTable datatable = new DataTable();
            try
            {
                await using (SqlConnection sqlConnection = new SqlConnection(Utilities.Base64Decode(connectionString)))
                {
                    // Open the connection
                    sqlConnection.Open();
                    SqlCommand command = new SqlCommand(queryText, sqlConnection);
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(datatable);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return datatable;
        }
        public async Task<DataTable> GetByStoredProcedure(string connectionString, string procedureName, List<QueryParameters> parameters)
        {
            DataTable datatable = new DataTable();
            try
            {
                await using (SqlConnection sqlConnection = new SqlConnection(Utilities.Base64Decode(connectionString)))
                {
                    // Open the connection
                    sqlConnection.Open();
                    using (SqlCommand command = new SqlCommand(procedureName, sqlConnection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandTimeout = 120;

                        foreach (var param in parameters)
                        {
                            var parameter = new SqlParameter();
                            parameter.ParameterName = param.ValueName;
                            parameter.Value = param.Value;
                            parameter.DbType = param.ValueType;
                            parameter.Direction = param.ValueDirection;
                            command.Parameters.Add(parameter);
                            
                        }

                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(datatable);
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return datatable;
        }

        public async Task<int> UpsertByStoredProcedure(string connectionString, string procedureName, List<QueryParameters> parameters)
        {
            var result = 0;
            try
            {
                await using (SqlConnection sqlConnection = new SqlConnection(Utilities.Base64Decode(connectionString)))
                {
                    // Open the connection
                    sqlConnection.Open();
                    using (SqlCommand command = new SqlCommand(procedureName, sqlConnection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.CommandTimeout = 120;

                        foreach (var param in parameters)
                        {
                            var parameter = new SqlParameter();
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
            catch (SqlException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return result;
        }

        public async Task<int> InsertOrUpdateByQuery(string connectionString, string queryText)
        {
            try
            {
                await using (SqlConnection sqlConnection = new SqlConnection(Utilities.Base64Decode(connectionString)))
                {
                    // Open the connection
                    sqlConnection.Open();
                    SqlCommand command = new SqlCommand(queryText, sqlConnection);

                    return command.ExecuteNonQuery();
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}

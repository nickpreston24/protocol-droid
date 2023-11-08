using System.Data;
using System.Data.SqlClient;
using CodeMechanic.Async;

namespace ProtocolDroid.Pages.Extensions;

public static class AdoAsyncExtensions
{
    private static readonly int DefaultCommandTimeout = 180;

    public static async Task<DataTable> FillTableAsync(
        this DataTable table,
        string connectionName,
        string selectQuery = "",
        CancellationToken cancellationToken = default,
        CommandType commandType = CommandType.Text,
        params SqlParameter[] sqlParameters
    )
    {
        if (string.IsNullOrWhiteSpace(selectQuery))
        {
            throw new ArgumentException(
                $"'{nameof(selectQuery)}' cannot be null or whitespace.",
                nameof(selectQuery)
            );
        }

        await using var connection = CreateConnection(connectionName);

        table = await ExecuteQueryInternalAsync(
            selectQuery,
            CommandType.Text,
            connection,
            transaction: null,
            cancellationToken,
            sqlParameters
        );

        return table;
    }

    public static async Task<DataTable> FillTableAsync(
        this DataTable table,
        string connectionName,
        string selectQuery = "",
        params SqlParameter[] sqlParameters
    )
    {
        return await table.FillTableAsync(connectionName, selectQuery, CancellationToken.None, CommandType.Text,
            sqlParameters);
    }

    // With a default command type:
    public static Task<DataTable> FillTableAsync(
        this DataTable table,
        string connection_string,
        string query = "",
        CancellationToken cancellationToken = default,
        params SqlParameter[] sqlParameters
    )
    {
        return FillTableAsync(table, connection_string, query, cancellationToken, CommandType.Text, sqlParameters);
    }

    // This will need a refactor, as it's probably an anti-pattern to try
    // and use only connection strings within
    // our Web.config by name and not just read them in like normal.
    private static SqlConnection CreateConnection(string connectionString = null)
    {
        // Try to handle the connection string OR name of a stored connection string
        if (
            !string.IsNullOrWhiteSpace(connectionString)
            && connectionString.StartsWith("Data Source")
        )
        {
            return new SqlConnection(connectionString);
        }

        throw new ArgumentException($"Invalid Connection string '{connectionString}'");
    }

    public static Task<DataRow[]> RunQueryAsync(
        string connectionName,
        string query,
        params SqlParameter[] sqlParameters
    )
    {
        return Task.FromResult(
            FillTableAsync(
                new DataTable(),
                connectionName,
                query,
                sqlParameters
            ).Result.Select()
        );
    }

    public static async Task<object> RunScalarAsync(
        string connectionString,
        string Query,
        params SqlParameter[] Parameters
    )
    {
        return RunScalarAsync<object>(connectionString, Query, Parameters);
    }

    public static async Task<T> RunScalarAsync<T>(
        string connectionString,
        string Query,
        params SqlParameter[] Parameters
    )
    {
        await using var sqlConnection = CreateConnection(connectionString);
        await using var cmd = new SqlCommand(Query, sqlConnection);

        try
        {
            cmd.CommandTimeout = DefaultCommandTimeout;

            cmd.Parameters.AddRange(Parameters);

            if (sqlConnection.State == ConnectionState.Closed)
                await sqlConnection
                    .OpenAsync()
                    .ConfigureAwait(continueOnCapturedContext: false);

            var value = await cmd.ExecuteScalarAsync();
            return (T)value;
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            sqlConnection.Close();
        }
    }

    public static async Task<int> RunNonQueryAsync(
        string connectionString,
        string Query,
        params SqlParameter[] Parameters
    )
    {
        await using var conn = CreateConnection(connectionString);
        await using var cmd = new SqlCommand(Query, conn);

        try
        {
            conn.Open();
            cmd.CommandTimeout = DefaultCommandTimeout;
            cmd.Parameters.AddRange(Parameters);
            return await cmd.ExecuteNonQueryAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            conn.Close();
        }
    }

    public static async Task<DataTable> ExecuteAndCreateDataTableAsync(this SqlCommand cmd,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await using var reader = await cmd.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            var dataTable = reader.CreateTableSchema();

            while (await reader.ReadAsync(cancellationToken).ConfigureAwait(false))
            {
                var dataRow = dataTable.NewRow();
                for (var i = 0; i < dataTable.Columns.Count; i++)
                {
                    dataRow[i] = reader[i];
                }

                dataTable.Rows.Add(dataRow);
            }

            return dataTable;
        }
        catch (Exception ex) when (ex.IsCausedBy(cancellationToken))
        {
            throw;
        }
    }

    public static void LoadParams(this SqlCommand cmd, params SqlParameter[] parameters)
    {
        if (parameters == null) return;
        foreach (var parameter in parameters)
        {
            if (parameter == null) continue;
            parameter.Value ??= DBNull.Value;

            cmd.Parameters.Add(parameter);
        }
    }

    private static DataTable CreateTableSchema(this SqlDataReader reader)
    {
        var schema = reader.GetSchemaTable();
        var dataTable = new DataTable();
        if (schema == null) return dataTable;
        foreach (DataRow row in schema.Rows)
        {
            var columnName = Convert.ToString(row["ColumnName"]);

            if (dataTable.Columns.Contains(columnName)) continue;
            var column = new DataColumn(columnName, (Type)row["DataType"]);
            dataTable.Columns.Add(column);
        }

        return dataTable;
    }


    public static async Task<DataSet> FillDataSetAsync(
        this DataSet ds,
        string connection_string,
        string query,
        params SqlParameter[] parameters
    )
    {
        return await ds.FillDataSetAsync(connection_string, query, CommandType.StoredProcedure,
            parameters: parameters);
    }

    public static async Task<DataSet> FillDataSetAsync(
        this DataSet ds,
        string connection_string,
        string query,
        CommandType command_type = CommandType.StoredProcedure,
        CancellationToken cancellationToken = default,
        params SqlParameter[] parameters
    )
    {
        await using var connection = new SqlConnection(connection_string);
        await connection.OpenAsync(cancellationToken);
        await using var cmd = new SqlCommand(query, connection);
        await using var registration = cancellationToken.Register(() => cmd.Cancel());
        var adapter = new SqlDataAdapter
        {
            SelectCommand = cmd
        };

        adapter.SelectCommand.Parameters.AddRange(parameters);
        adapter.SelectCommand.CommandType = command_type;
        adapter.Fill(ds);

        return ds;
    }

    public static async Task<DataTable> ExecuteQueryInternalAsync(
        string commandText,
        CommandType commandType,
        SqlConnection sqlConnection,
        SqlTransaction transaction,
        CancellationToken cancellationToken = default,
        params SqlParameter[] parameters
    )
    {
        try
        {
            // IF you came here, here's why the hanging happened:

            //https://stackoverflow.com/questions/26431344/sqlconnection-openasync-hangs-when-there-are-no-active-connections

            // This shows why:
            //await Task.Delay(1000);

            await using var cmd = new SqlCommand(commandText, sqlConnection)
            {
                CommandType = commandType,
                CommandTimeout = DefaultCommandTimeout
            };
            if (transaction != null)
                cmd.Transaction = transaction;

            cmd.LoadParams(parameters);

            if (sqlConnection.State == ConnectionState.Closed)
                await sqlConnection
                    .OpenAsync(cancellationToken)
                    .ConfigureAwait(continueOnCapturedContext: false);

            var datatable = await cmd.ExecuteAndCreateDataTableAsync(cancellationToken);
            return datatable;
        }
        catch (Exception ex) when (ex is SqlException)
        {
            return new DataTable();
        }
        catch (Exception ex) when (ex.IsCausedBy(cancellationToken))
        {
            throw;
        }
    }
}
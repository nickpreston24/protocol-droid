using System.Data;
using System.Data.SqlClient;
using CodeMechanic.Async;

namespace ProtocolDroid.Pages.Extensions;

public static class PostgresqlAdoAsyncExtensions
{
    private static readonly int DefaultCommandTimeout = 180;

    
    public static async Task<DataTable> PgFillTableAsync(
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

        await using var connection = PgCreateConnection(connectionName);

        table = await PgExecuteQueryInternalAsync(
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
        return await table.PgFillTableAsync(connectionName, selectQuery, CancellationToken.None, CommandType.Text,
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
        return PgFillTableAsync(table, connection_string, query, cancellationToken, CommandType.Text, sqlParameters);
    }
    
    public static async Task<DataTable> PgExecuteQueryInternalAsync(
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

    public static async Task<DataTable> PgExecuteAndCreateDataTableAsync(this SqlCommand cmd,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await using var reader = await cmd.ExecuteReaderAsync(cancellationToken).ConfigureAwait(false);
            var dataTable = reader.PgCreateTableSchema();

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

    private static DataTable PgCreateTableSchema(this SqlDataReader reader)
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
    
    private static SqlConnection PgCreateConnection(string connectionString = null)
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
}
using System.Diagnostics;
using System.Reflection;
using System.Transactions;
using CodeMechanic.Diagnostics;
using CodeMechanic.Embeds;
using Insight.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Npgsql;

namespace ProtocolDroid.Pages;

[BindProperties]
public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly IEmbeddedResourceQuery embeddedResourceQuery;
    private readonly string azure_sql_connectionstring = string.Empty;
    private string postgresql_connectionstring = string.Empty;
    public string QueryName { get; set; } = "Test";

    public IndexModel(
        IEmbeddedResourceQuery embeddedResourceQuery
    )
    {
        this.embeddedResourceQuery = embeddedResourceQuery;
        azure_sql_connectionstring = Environment.GetEnvironmentVariable("SQLSERVER_CONNECTION_STRING");

        string host = Environment.GetEnvironmentVariable("PGHOST");
        string username = Environment.GetEnvironmentVariable("PGUSER");
        string password = Environment.GetEnvironmentVariable("PGPASSWORD");
        string database = Environment.GetEnvironmentVariable("PGDATABASE");
        string port = Environment.GetEnvironmentVariable("PGPORT");

        postgresql_connectionstring =
            $"Host={host};Port={port};Username={username};Password={password};Database={database}";
    }

    public async Task<IActionResult> OnGetSearchRegexPatterns( /*string query_name = "fixme"*/)
    {
        string filename = "ProtocolDroid.Pages.SearchRegexPatterns.sql";
        string query = ReadResourceFile(filename);

        try
        {
            // RunBeerExample();
            // Console.WriteLine(postgresql_connectionstring);
            // return Content($"""conn => {postgresql_connectionstring}""");


            Console.WriteLine(postgresql_connectionstring);

            await using var con = new NpgsqlConnection(postgresql_connectionstring);
            con.Open();

            var sql = """
                      SELECT count(*) from cars
                      """;

            await using var cmd = new NpgsqlCommand(sql, con);

            var version = cmd.ExecuteScalar().ToString();
            Console.WriteLine($"PostgreSQL version: {version}");
            return Content($"<p>PostgreSQL version: {version}</p>");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return Content($"""
                            <sl-alert variant="danger" open>
                              <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
                              <strong>Something failed!</strong><br />
                              {ex}
                            </sl-alert>
                            """);
        }

        return Content($"""<user-profile>{query}</user-profile>""");
    }

    private async void RunBeerExample()
    {
        await using (var connection = new SqlConnection(postgresql_connectionstring))
        {
            var repo = connection.As<IBeerRepository>();
            var beer = new Beer() { Type = "ipa", Description = "Sly Fox 113" };

            repo.InsertBeer(beer);
            IList<Beer> beerList = repo.GetBeerByType("ipa").Dump("beers found");
            repo.UpdateBeerList(beerList);
        }
    }

    public interface IBeerRepository
    {
        void InsertBeer(Beer beer);
        IList<Beer> GetBeerByType(string type);
        void UpdateBeerList(IList<Beer> beerList);
    }

    /// <summary>
    /// Read contents of an embedded resource file
    /// </summary>
    private string ReadResourceFile(string filename)
    {
        var thisAssembly = Assembly.GetExecutingAssembly();
        using (var stream = thisAssembly.GetManifestResourceStream(filename))
        {
            using (var reader = new StreamReader(stream))
            {
                return reader.ReadToEnd();
            }
        }
    }
}

public class Beer
{
    public int ID { get; private set; }
    public string Type { get; set; }
    public string Description { get; set; }
}
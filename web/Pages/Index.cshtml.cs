using System.Reflection;
using CodeMechanic.Diagnostics;
using CodeMechanic.Embeds;
using CodeMechanic.Types;
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
        Console.WriteLine(postgresql_connectionstring);
    }

    public async Task<IActionResult> OnGetSearchRegexPatterns( /*string query_name = "fixme"*/)
    {
        string filename = "ProtocolDroid.Pages.SearchRegexPatterns.sql";
        string query = ReadResourceFile(filename);
        return Content($"""<user-profile>{query}</user-profile>""");
    }


    public async Task<IActionResult> OnGetTotalCars()
    {
        try
        {
            // Thread.Sleep(500);
            string totals_query = ReadResourceFile("ProtocolDroid.Pages.TotalCars.sql");
            string avg_query = ReadResourceFile("ProtocolDroid.Pages.CarAverageCost.sql");

            var totals_result = await PgExecuteScalar(postgresql_connectionstring, totals_query);

            var avg_result = !string.IsNullOrEmpty(avg_query)
                ? await PgExecuteScalar(postgresql_connectionstring, avg_query)
                : "50";

            Console.WriteLine($"total cars: {totals_result}");
            Console.WriteLine($"avg cars: {avg_result}");
            Console.WriteLine(avg_query);
            Console.WriteLine(totals_query);
            // return Content($"<p>total cars: {result}</p>");

            return Partial("_CarStats",
                new CarStats { totalcars = totals_result.ToInt(), averagecost = avg_result.ToDouble() });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return Content(Failure(ex));
        }
    }

    private async Task<string> PgExecuteScalar(string connectionstring, string query)
    {
        await using var connection = new NpgsqlConnection(connectionstring);
        connection.Open();
        await using var cmd = new NpgsqlCommand(query, connection);

        var result = cmd.ExecuteScalar().ToString();
        return result;
    }

    private Func<Exception, string> Failure = ex => $"""
                                                     <sl-alert variant="danger" open>
                                                       <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
                                                       <strong>Something failed!</strong><br />
                                                       {ex}
                                                     </sl-alert>
                                                     """;

    private async Task<IList<Beer>> RunBeerExample()
    {
        await using (var connection = new SqlConnection(postgresql_connectionstring))
        {
            var repo = connection.As<IBeerRepository>();
            var beer = new Beer { Type = "ipa", Description = "Sly Fox 113" };

            repo.InsertBeer(beer);
            IList<Beer> beerList = repo.GetBeerByType("ipa").Dump("beers found");
            repo.UpdateBeerList(beerList);

            return beerList;
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
        using var stream = thisAssembly.GetManifestResourceStream(filename);
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }

    private async void TaskExtensionTests()
    {
        // Task.Run(() =>
        //         Thread.Sleep(60000))
        //     .TimeoutAfter<IndexModel>(new TimeSpan(0, 0,
        //         30));
    }
}

public class CarStats
{
    public double averagecost { get; set; } = -9999.00;
    public int totalcars { get; set; } = -9999;
}

public class Beer
{
    public int ID { get; private set; }
    public string Type { get; set; }
    public string Description { get; set; }
}
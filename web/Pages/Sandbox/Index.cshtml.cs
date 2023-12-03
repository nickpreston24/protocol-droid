using System.Reflection;
using CodeMechanic.Diagnostics;
using CodeMechanic.Embeds;
using CodeMechanic.FileSystem;
using CodeMechanic.Types;
using Insight.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using Npgsql;
using ProtocolDroid.Models;
using ProtocolDroid.Pages.Extensions;

namespace ProtocolDroid.Pages.Sandbox;

[BindProperties]
public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly IEmbeddedResourceQuery embeddedResourceQuery;
    private readonly string azure_sql_connectionstring = string.Empty;

    private string postgresql_connectionstring = string.Empty;
    // public string QueryName { get; set; } = "Test";

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
        // Console.WriteLine(postgresql_connectionstring);
    }

    public async Task<IActionResult> OnGetSearchRegexPatterns()
    {
        // Console.WriteLine("method name :>> " + method_name);
        string filename = "ProtocolDroid.Pages.SearchRegexPatterns.sql";
        string query = ReadResourceFile(filename);
        Console.WriteLine("pattern query :>> " + query);
        // return Content($"""<user-profile>{query}</user-profile>""");
        return Partial("_RegexPatternsTable", new List<RegexPattern>());
    }

    public async Task<IActionResult> OnGetTotalCars()
    {
        try
        {
            string totals_query = ReadResourceFile("ProtocolDroid.Pages.TotalCars.sql");
            string avg_query = ReadResourceFile("ProtocolDroid.Pages.CarAverageCost.sql");

            var totals_result = await postgresql_connectionstring.PgExecuteScalar(totals_query);

            var avg_result = "72721.125";
            // !string.IsNullOrEmpty(avg_query)
            // ? await postgresql_connectionstring.PgExecuteScalar(avg_query)
            // : "50";

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


    private Func<Exception, string> Failure = ex => $"""
                                                     <sl-alert variant="danger" open>
                                                       <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
                                                       <strong>Something failed!</strong><br />
                                                       { ex}   
                                                     </sl-alert>
                                                     """ ;

    private async Task<IList<RegexPattern>> RunInsightExample()
    {
        await using var connection = new NpgsqlConnection(postgresql_connectionstring);
        var repo = connection.As<ICarRepository>();
        var RegexPattern = new RegexPattern
            { Find = "foo", Description = "Find foo, replace with bar", Replacement = "bar" };

        repo.InsertPattern(RegexPattern);
        var regexpList = repo.GetPatternByType("vb").Dump("regexps found");
        repo.UpdatePatternList(regexpList);

        return regexpList;
    }

    public interface ICarRepository
    {
        void InsertPattern(RegexPattern RegexPattern);
        IList<RegexPattern> GetPatternByType(string type);
        void UpdatePatternList(IList<RegexPattern> regexpList);
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

    public async Task<IActionResult> OnGetSeedRegexTableFromJson()
    {
        Console.WriteLine("Starting regex pattern seeding ... ");
        var search = new Grepper
        {
            RootPath = Directory.GetCurrentDirectory().GoUp().Dump("current dir") + "/replacements",
            FileSearchMask = "*.json",
            Recursive = false
        };

        var json_files_found = search.GetFileNames();
        json_files_found.Dump("found these files");

        var all_replacements = json_files_found.Aggregate(new List<RegexPattern>(), (list, filepath) =>
        {
            string json = System.IO.File.ReadAllText(filepath);
            List<ReplacementMap> raw_replacements = JsonConvert.DeserializeObject<List<ReplacementMap>>(
                json
            );

            foreach (var map in raw_replacements)
            {
                foreach (var reps in map.Replacements)
                {
                    list.Add(new RegexPattern()
                        .With(pattern =>
                        {
                            pattern.Extensions = map.Extensions;
                            pattern.TargetExtensions = map.TargetExtension;
                            pattern.Find = reps.TryGetValueOrDefault("find");
                            pattern.Replacement = reps.TryGetValueOrDefault("replacement");
                            pattern.Description = reps.TryGetValueOrDefault("description");
                        }));
                }
            }


            return list;
        });


        // await using var connection = new NpgsqlConnection(postgresql_connectionstring);


        return Partial("_RegexPatternsTable", all_replacements);
    }
}

/// <summary>
/// This is the C# representation of a JSON input file
/// </summary>
internal class ReplacementMap
{
    public string Extensions { get; set; }
    public string TargetExtension { get; set; } = ".cs";

    /* Sections of a JSON input file */

    public List<Dictionary<string, string>> Replacements { get; set; } =
        new List<Dictionary<string, string>>();

    public List<Dictionary<string, string>> Removals { get; set; } =
        new List<Dictionary<string, string>>();
}
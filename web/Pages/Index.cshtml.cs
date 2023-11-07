using System.Diagnostics;
using CodeMechanic.Diagnostics;
using CodeMechanic.Embeds;
using CodeMechanic.RazorHAT;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Neo4j.Driver;

namespace web.Pages;

[BindProperties]
public class IndexModel : HighSpeedPageModel
{
    private readonly ILogger<IndexModel> _logger;
    public string QueryName { get; set; } = "Test";

    public IndexModel(
        IEmbeddedResourceQuery embeddedResourceQuery
        , IDriver driver)
        : base(embeddedResourceQuery, driver)
    {
    }

    public async Task<IActionResult> OnGetProfile(string query_name = "fixme")
    {
        QueryName = query_name;
        // "telephone!".Dump();

        string query = await embeddedResourceQuery.GetQueryAsync<IndexModel>(new StackTrace());

        return Content($"""<user-profile>{query}</user-profile>""");
    }

    public void OnGet()
    {
    }
}
using CodeMechanic.Diagnostics;
using CodeMechanic.Embeds;
using CodeMechanic.RazorHAT.Services;
using CodeMechanic.Sharpify;
using CodeMechanic.Types;

namespace ProtocolDroid.Services;

public interface ISharpifyService
{
    public Task RunAsync(SharpifierOptions options);
}

public class SharpifyService : ISharpifyService
{
    private readonly IEmbeddedResourceQuery embeded_resources;
    private readonly bool debug_mode;

    public SharpifyService(
        IEmbeddedResourceQuery embededResources
    )
    {
        debug_mode = true;
        embeded_resources = embededResources;
    }

    public async Task RunAsync(SharpifierOptions options)
    {
        // string cwd = Environment.GetFolderPath();
        options.With(o =>
        {
            // o.OutputDirectory = 
        });

        options.Dump("options");
        return;

        var content = (await embeded_resources
            .Read<SharpifyService>("refactors.json")
            .ReadAllLinesFromStreamAsync());

        if (debug_mode) content.Length.Dump("json file size");

        var sharpifier = new Sharpifier(options);
        await sharpifier.RunAsync();
    }
}
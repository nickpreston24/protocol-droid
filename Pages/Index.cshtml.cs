using CodeMechanic.Diagnostics;
using CodeMechanic.FileSystem;
using CodeMechanic.RazorHAT.Services;
using CodeMechanic.Types;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProtocolDroid.Models;

namespace ProtocolDroid.Pages;

[BindProperties(SupportsGet = true)]
public class Index : PageModel
{
    private readonly IMarkdownService markdown_service;
    public QuillEditor InputEditor { get; set; }
    public string MarkdownDirectory { get; set; }

    public Index(IMarkdownService md)
    {
        this.markdown_service = md;
        string cwd = Directory.GetCurrentDirectory().Dump("current dir");
        string tpot_sample_markdowns_relpath =
            Path.GetRelativePath(
                    cwd,
                    @"/home/nick/Desktop/projects/tpot/tpot_static_wip/pages/what-the-lord-has-done-with-me")
                .Dump("rel path");

        var md_files = markdown_service.GetAllMarkdownFiles(tpot_sample_markdowns_relpath);
        md_files.TakeFirstRandom().Dump("markdown files");
    }

    public void OnGet()
    {
        InputEditor = new QuillEditor()
        {
            Html = """
                <ul class='grid grid-rows-2 grid-cols-2'>
                    <li>1</li>
                </ul>
            """,
            editor_id = nameof(InputEditor).ToSnakeCase()
        };
    }

    public async Task<IActionResult> OnGetConvert()
    {
        // Console.WriteLine("Converting html :>> " +
        //                   InputEditor.Html.Dump("current html")
        // );

        InputEditor.Html =
            """ 
                  <p>Hello World!</p>
                <p>Some initial <strong>bold</strong> text</p>
                <p>
                    <br>
                </p>
            """
            ;
        return Partial("QuillEditor", InputEditor);
    }
}
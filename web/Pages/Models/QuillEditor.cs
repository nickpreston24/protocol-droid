using CodeMechanic.Types;
using Microsoft.AspNetCore.Mvc;
using NSpecifications;

namespace ProtocolDroid.Models;

public class QuillEditor
{
    // public QuillEditor(string id)
    // {
    //     editor_id = id.ToSnakeCase();
    // }

    public string editor_id { get; set; }
    public string theme { get; set; } = "snow";

    public string Html { get; set; } = string.Empty;
    //     """ 
    //       <p>Hello World!</p>
    //     <p>Some initial <strong>bold</strong> text</p>
    //     <p>
    //         <br>
    //     </p>
    // """;

    public string Greeting { get; set; } = "Hello there!";
}

public static class QuillEditorExtensions
{
    public static bool IsValid(this QuillEditor settings)
    {
        var spec = new Spec<QuillEditor>(
            setting => setting.editor_id.NotEmpty());

        return spec.IsSatisfiedBy(settings);
    }
}
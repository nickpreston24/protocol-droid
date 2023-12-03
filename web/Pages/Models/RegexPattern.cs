namespace ProtocolDroid.Models;

public class RegexPattern
{
    public string Name { get; set; } = string.Empty;
    public string Find { get; set; } = string.Empty;
    public string Replacement { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Languages { get; set; } = string.Empty;
    public string Extensions { get; set; } = ".txt";
    public string TargetLanguage { get; set; } = string.Empty;
    public string TargetExtensions { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
}
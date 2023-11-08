namespace CodeMechanic.Types;

public static class DictionaryExtensions
{
    public static string TryGetValueOrDefault(
        this Dictionary<string, string> pairs
        , string keyname
        , string fallback = "")
    {
        return pairs.TryGetValue(keyname, out string result) ? result : fallback;
    }
}
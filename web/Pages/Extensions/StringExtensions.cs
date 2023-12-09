using System.Text.RegularExpressions;

public static class StringExtensions
{
    public static string ToSnakeCase(this string text)
    {
        var pattern =
            new Regex(@"[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+");

        return text == null
            ? null
            : string
                .Join("_", pattern.Matches(text).Cast<Match>().Select(m => m.Value))
                .ToLower();
    }
}
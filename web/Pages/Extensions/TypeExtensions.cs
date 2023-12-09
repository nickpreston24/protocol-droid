using Newtonsoft.Json;

public static class TypeExtensions
{
    public static string AsJS<T>(this T value) =>
        value != null ? JsonConvert.SerializeObject(value) : "";
}
using System.Reflection;

namespace CodeMechanic.Embeds;

public interface IEmbeddedResourceQuery
{
    Stream? Read<T>(string resource);
    Stream? Read(Assembly assembly, string resource);
    Stream? Read(string assemblyName, string resource);
}
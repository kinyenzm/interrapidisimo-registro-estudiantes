namespace Interrapidisimo.Server.Domain;

/// <summary>Error esperado que se devuelve al cliente con el código HTTP y el mensaje indicados.</summary>
public sealed class AppException(int status, string mensaje) : Exception(mensaje)
{
    public int Status { get; } = status;
}

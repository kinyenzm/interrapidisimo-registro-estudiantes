using Interrapidisimo.Server.DTOs;

namespace Interrapidisimo.Server.Services;

public interface ICatalogoService
{
    Task<CatalogoResponse> ObtenerAsync(CancellationToken ct);
}

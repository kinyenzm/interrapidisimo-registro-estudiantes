using Interrapidisimo.Server.DTOs;

namespace Interrapidisimo.Server.Services;

public interface IEstudianteService
{
    Task<IReadOnlyList<EstudiantePublicoResponse>> ListarAsync(int estudianteId, CancellationToken ct);
    Task<MiRegistroResponse> ObtenerMiRegistroAsync(int estudianteId, CancellationToken ct);
    Task<MiRegistroResponse> ActualizarPerfilAsync(int estudianteId, ActualizarPerfilRequest request, CancellationToken ct);
    Task EliminarAsync(int estudianteId, CancellationToken ct);
    Task<MiRegistroResponse> CambiarMateriasAsync(int estudianteId, IReadOnlyList<int> materiaIds, CancellationToken ct);
    Task<IReadOnlyList<CompanerosPorMateriaResponse>> ObtenerCompanerosAsync(int estudianteId, CancellationToken ct);
}

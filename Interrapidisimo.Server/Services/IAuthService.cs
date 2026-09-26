using Interrapidisimo.Server.DTOs;

namespace Interrapidisimo.Server.Services;

public interface IAuthService
{
    Task<AuthResponse> RegistrarAsync(RegistroRequest request, CancellationToken ct);
    Task<AuthResponse> IniciarSesionAsync(LoginRequest request, CancellationToken ct);
}

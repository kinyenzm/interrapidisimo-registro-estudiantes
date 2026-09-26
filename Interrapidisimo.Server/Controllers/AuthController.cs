using Interrapidisimo.Server.DTOs;
using Interrapidisimo.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Interrapidisimo.Server.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>Registro en línea: crea el estudiante con su programa de créditos y sus 3 materias.</summary>
    /// <remarks>Reglas: exactamente 3 materias (9 créditos) y ningún profesor repetido.</remarks>
    [HttpPost("registro")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Registrar([FromBody] RegistroRequest request, CancellationToken ct)
    {
        var respuesta = await authService.RegistrarAsync(request, ct);
        return Created("/api/estudiantes/me", respuesta);
    }

    /// <summary>Inicia sesión con correo y contraseña y devuelve un JWT.</summary>
    [HttpPost("login")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> IniciarSesion([FromBody] LoginRequest request, CancellationToken ct) =>
        Ok(await authService.IniciarSesionAsync(request, ct));
}

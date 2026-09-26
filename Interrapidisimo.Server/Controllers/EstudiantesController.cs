using System.Security.Claims;
using Interrapidisimo.Server.DTOs;
using Interrapidisimo.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Interrapidisimo.Server.Controllers;

/// <summary>Registros de estudiantes. Las rutas /me operan siempre sobre el estudiante del token.</summary>
[ApiController]
[Authorize]
[Route("api/estudiantes")]
[Produces("application/json")]
public sealed class EstudiantesController(IEstudianteService estudianteService) : ControllerBase
{
    private int EstudianteId => int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

    /// <summary>Registros de todos los estudiantes: nombre, programa, créditos y clases en común contigo.</summary>
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<EstudiantePublicoResponse>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(CancellationToken ct) =>
        Ok(await estudianteService.ListarAsync(EstudianteId, ct));

    /// <summary>Tu registro completo.</summary>
    [HttpGet("me")]
    [ProducesResponseType<MiRegistroResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerMiRegistro(CancellationToken ct) =>
        Ok(await estudianteService.ObtenerMiRegistroAsync(EstudianteId, ct));

    /// <summary>Actualiza tu nombre, correo y programa de créditos.</summary>
    [HttpPut("me")]
    [ProducesResponseType<MiRegistroResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> ActualizarPerfil([FromBody] ActualizarPerfilRequest request, CancellationToken ct) =>
        Ok(await estudianteService.ActualizarPerfilAsync(EstudianteId, request, ct));

    /// <summary>Elimina tu registro y tus inscripciones.</summary>
    [HttpDelete("me")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Eliminar(CancellationToken ct)
    {
        await estudianteService.EliminarAsync(EstudianteId, ct);
        return NoContent();
    }

    /// <summary>Reemplaza tu selección de materias (3 materias sin repetir profesor).</summary>
    [HttpPut("me/materias")]
    [ProducesResponseType<MiRegistroResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> CambiarMaterias([FromBody] SeleccionMateriasRequest request, CancellationToken ct) =>
        Ok(await estudianteService.CambiarMateriasAsync(EstudianteId, request.MateriaIds, ct));

    /// <summary>Por cada una de tus clases, solo los nombres de tus compañeros.</summary>
    [HttpGet("me/companeros")]
    [ProducesResponseType<IReadOnlyList<CompanerosPorMateriaResponse>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> ObtenerCompaneros(CancellationToken ct) =>
        Ok(await estudianteService.ObtenerCompanerosAsync(EstudianteId, ct));
}

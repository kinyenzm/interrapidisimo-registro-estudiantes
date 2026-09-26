using Interrapidisimo.Server.DTOs;
using Interrapidisimo.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Interrapidisimo.Server.Controllers;

[ApiController]
[Route("api/catalogo")]
[Produces("application/json")]
public sealed class CatalogoController(ICatalogoService catalogoService) : ControllerBase
{
    /// <summary>Reglas del programa de créditos, programas y los 5 profesores con sus 10 materias.</summary>
    [HttpGet]
    [ProducesResponseType<CatalogoResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Obtener(CancellationToken ct) =>
        Ok(await catalogoService.ObtenerAsync(ct));
}

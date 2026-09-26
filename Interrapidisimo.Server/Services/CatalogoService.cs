using Interrapidisimo.Server.Data;
using Interrapidisimo.Server.Domain;
using Interrapidisimo.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Interrapidisimo.Server.Services;

public sealed class CatalogoService(AppDbContext db) : ICatalogoService
{
    public async Task<CatalogoResponse> ObtenerAsync(CancellationToken ct)
    {
        var programas = await db.Programas.AsNoTracking()
            .OrderBy(p => p.Id)
            .Select(p => new ProgramaResponse(p.Id, p.Nombre, p.Descripcion, p.CreditosPorPeriodo))
            .ToListAsync(ct);

        var profesores = await db.Profesores.AsNoTracking()
            .OrderBy(p => p.Id)
            .Select(p => new ProfesorResponse(
                p.Id,
                p.Nombre,
                p.Materias.OrderBy(m => m.Id).Select(m => new MateriaResponse(m.Id, m.Nombre, m.Creditos)).ToList()))
            .ToListAsync(ct);

        var reglas = new ReglasResponse(
            ReglasAcademicas.MateriasPorEstudiante,
            ReglasAcademicas.CreditosPorMateria,
            ReglasAcademicas.CreditosPorPeriodo);

        return new CatalogoResponse(reglas, programas, profesores);
    }
}

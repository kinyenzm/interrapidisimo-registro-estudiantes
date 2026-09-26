using Interrapidisimo.Server.Data;
using Interrapidisimo.Server.Domain;
using Interrapidisimo.Server.Domain.Entities;
using Interrapidisimo.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Interrapidisimo.Server.Services;

public sealed class EstudianteService(AppDbContext db) : IEstudianteService
{
    public async Task<IReadOnlyList<EstudiantePublicoResponse>> ListarAsync(int estudianteId, CancellationToken ct)
    {
        var misMaterias = db.Inscripciones.Where(i => i.EstudianteId == estudianteId).Select(i => i.MateriaId);

        // El propio registro primero y el resto por nombre; de los demás solo se ven las materias en común.
        return await db.Estudiantes.AsNoTracking()
            .OrderByDescending(e => e.Id == estudianteId)
            .ThenBy(e => e.Nombre)
            .Select(e => new EstudiantePublicoResponse(
                e.Nombre,
                e.Programa.Nombre,
                e.Inscripciones.Sum(i => i.Materia.Creditos),
                e.Programa.CreditosPorPeriodo,
                e.Id == estudianteId,
                e.Inscripciones
                    .Where(i => misMaterias.Contains(i.MateriaId))
                    .Select(i => i.Materia.Nombre)
                    .OrderBy(nombre => nombre)
                    .ToList()))
            .ToListAsync(ct);
    }

    public async Task<MiRegistroResponse> ObtenerMiRegistroAsync(int estudianteId, CancellationToken ct) =>
        await db.Estudiantes.AsNoTracking()
            .Where(e => e.Id == estudianteId)
            .Select(e => new MiRegistroResponse(
                e.Id,
                e.Nombre,
                e.Email,
                e.ProgramaId,
                e.Programa.Nombre,
                e.Programa.CreditosPorPeriodo,
                e.FechaRegistro,
                e.Inscripciones.Sum(i => i.Materia.Creditos),
                e.Inscripciones
                    .OrderBy(i => i.MateriaId)
                    .Select(i => new MateriaInscritaResponse(i.MateriaId, i.Materia.Nombre, i.Materia.Profesor.Nombre, i.Materia.Creditos, i.FechaInscripcion))
                    .ToList()))
            .SingleOrDefaultAsync(ct)
        ?? throw RegistroInexistente();

    public async Task<MiRegistroResponse> ActualizarPerfilAsync(int estudianteId, ActualizarPerfilRequest request, CancellationToken ct)
    {
        var estudiante = await db.Estudiantes.FindAsync([estudianteId], ct) ?? throw RegistroInexistente();

        if (!await db.Programas.AnyAsync(p => p.Id == request.ProgramaId, ct))
            throw new AppException(StatusCodes.Status400BadRequest, "El programa seleccionado no existe.");

        var email = request.Email.Trim().ToLowerInvariant();
        if (await db.Estudiantes.AnyAsync(e => e.Email == email && e.Id != estudianteId, ct))
            throw new AppException(StatusCodes.Status409Conflict, "Ya existe un registro con ese correo electrónico.");

        estudiante.Nombre = request.Nombre.Trim();
        estudiante.Email = email;
        estudiante.ProgramaId = request.ProgramaId;
        await db.SaveChangesAsync(ct);

        return await ObtenerMiRegistroAsync(estudianteId, ct);
    }

    public async Task EliminarAsync(int estudianteId, CancellationToken ct)
    {
        // Las inscripciones se borran en cascada (ON DELETE CASCADE).
        if (await db.Estudiantes.Where(e => e.Id == estudianteId).ExecuteDeleteAsync(ct) == 0)
            throw RegistroInexistente();
    }

    public async Task<MiRegistroResponse> CambiarMateriasAsync(int estudianteId, IReadOnlyList<int> materiaIds, CancellationToken ct)
    {
        var estudiante = await db.Estudiantes.Include(e => e.Inscripciones).SingleOrDefaultAsync(e => e.Id == estudianteId, ct)
            ?? throw RegistroInexistente();

        ReglasAcademicas.ValidarSeleccion(materiaIds, await db.Materias.AsNoTracking().ToListAsync(ct));

        // Solo se quitan las materias que salen y se agregan las nuevas; las que se conservan mantienen su fecha.
        var actuales = estudiante.Inscripciones.Select(i => i.MateriaId).ToList();
        db.Inscripciones.RemoveRange(estudiante.Inscripciones.Where(i => !materiaIds.Contains(i.MateriaId)));
        db.Inscripciones.AddRange(materiaIds.Where(id => !actuales.Contains(id))
            .Select(id => new Inscripcion { EstudianteId = estudianteId, MateriaId = id, FechaInscripcion = DateTime.Now }));
        await db.SaveChangesAsync(ct);

        return await ObtenerMiRegistroAsync(estudianteId, ct);
    }

    public async Task<IReadOnlyList<CompanerosPorMateriaResponse>> ObtenerCompanerosAsync(int estudianteId, CancellationToken ct) =>
        await db.Inscripciones.AsNoTracking()
            .Where(i => i.EstudianteId == estudianteId)
            .OrderBy(i => i.Materia.Nombre)
            .Select(i => new CompanerosPorMateriaResponse(
                i.MateriaId,
                i.Materia.Nombre,
                i.Materia.Profesor.Nombre,
                i.Materia.Inscripciones
                    .Where(otra => otra.EstudianteId != estudianteId)
                    .Select(otra => otra.Estudiante.Nombre)
                    .OrderBy(nombre => nombre)
                    .ToList()))
            .ToListAsync(ct);

    private static AppException RegistroInexistente() =>
        new(StatusCodes.Status404NotFound, "Tu registro ya no existe.");
}

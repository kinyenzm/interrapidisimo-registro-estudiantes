namespace Interrapidisimo.Server.DTOs;

/// <summary>Catálogo público: reglas del programa de créditos, programas y profesores con sus materias.</summary>
public sealed record CatalogoResponse(
    ReglasResponse Reglas,
    IReadOnlyList<ProgramaResponse> Programas,
    IReadOnlyList<ProfesorResponse> Profesores);

public sealed record ReglasResponse(int MateriasPorEstudiante, int CreditosPorMateria, int CreditosPorPeriodo);

public sealed record ProgramaResponse(int Id, string Nombre, string Descripcion, int CreditosPorPeriodo);

public sealed record ProfesorResponse(int Id, string Nombre, IReadOnlyList<MateriaResponse> Materias);

public sealed record MateriaResponse(int Id, string Nombre, int Creditos);

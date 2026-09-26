using Interrapidisimo.Server.Domain.Entities;

namespace Interrapidisimo.Server.Domain;

/// <summary>Reglas del programa de créditos.</summary>
public static class ReglasAcademicas
{
    public const int MateriasPorEstudiante = 3;
    public const int CreditosPorMateria = 3;
    public const int CreditosPorPeriodo = MateriasPorEstudiante * CreditosPorMateria;

    /// <summary>Valida que se elijan 3 materias distintas del catálogo, cada una con un profesor diferente.</summary>
    /// <exception cref="AppException">422 si la selección no cumple las reglas.</exception>
    public static void ValidarSeleccion(IReadOnlyList<int> materiaIds, IReadOnlyList<Materia> catalogo)
    {
        if (materiaIds.Count != MateriasPorEstudiante || materiaIds.Distinct().Count() != MateriasPorEstudiante)
            throw new AppException(StatusCodes.Status422UnprocessableEntity, "Debes seleccionar 3 materias diferentes.");

        var seleccion = catalogo.Where(m => materiaIds.Contains(m.Id)).ToList();
        if (seleccion.Count != MateriasPorEstudiante)
            throw new AppException(StatusCodes.Status422UnprocessableEntity, "Alguna de las materias seleccionadas no existe.");

        if (seleccion.Select(m => m.ProfesorId).Distinct().Count() != MateriasPorEstudiante)
            throw new AppException(StatusCodes.Status422UnprocessableEntity, "No puedes tener dos materias con el mismo profesor.");
    }
}

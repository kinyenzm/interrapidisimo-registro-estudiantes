namespace Interrapidisimo.Server.Domain.Entities;

/// <summary>Materia seleccionada por un estudiante.</summary>
public sealed class Inscripcion
{
    public int EstudianteId { get; set; }
    public int MateriaId { get; set; }
    public DateTime FechaInscripcion { get; set; }

    public Estudiante Estudiante { get; set; } = null!;
    public Materia Materia { get; set; } = null!;
}

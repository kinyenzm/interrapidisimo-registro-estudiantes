namespace Interrapidisimo.Server.Domain.Entities;

/// <summary>Uno de los 5 profesores; cada uno dicta 2 materias.</summary>
public sealed class Profesor
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    public ICollection<Materia> Materias { get; set; } = [];
}

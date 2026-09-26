namespace Interrapidisimo.Server.Domain.Entities;

/// <summary>Una de las 10 materias del catálogo (3 créditos cada una).</summary>
public sealed class Materia
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int Creditos { get; set; }
    public int ProfesorId { get; set; }

    public Profesor Profesor { get; set; } = null!;
    public ICollection<Inscripcion> Inscripciones { get; set; } = [];
}

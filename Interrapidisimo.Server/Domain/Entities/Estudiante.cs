namespace Interrapidisimo.Server.Domain.Entities;

/// <summary>Registro en línea de un estudiante.</summary>
public sealed class Estudiante
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public int ProgramaId { get; set; }
    public DateTime FechaRegistro { get; set; }

    public Programa Programa { get; set; } = null!;
    public ICollection<Inscripcion> Inscripciones { get; set; } = [];
}

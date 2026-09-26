namespace Interrapidisimo.Server.Domain.Entities;

/// <summary>Programa de créditos al que se adhiere el estudiante.</summary>
public sealed class Programa
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public int CreditosPorPeriodo { get; set; }
}

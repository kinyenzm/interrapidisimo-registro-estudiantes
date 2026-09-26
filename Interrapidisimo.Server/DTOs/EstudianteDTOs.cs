using System.ComponentModel.DataAnnotations;

namespace Interrapidisimo.Server.DTOs;

/// <summary>Registro de un estudiante tal como lo ven los demás: sin id, correo ni fechas.</summary>
public sealed record EstudiantePublicoResponse(
    string Nombre,
    string Programa,
    int CreditosInscritos,
    int CreditosPorPeriodo,
    bool EsPropio,
    IReadOnlyList<string> MateriasEnComun);

/// <summary>Registro completo del propio estudiante.</summary>
public sealed record MiRegistroResponse(
    int Id,
    string Nombre,
    string Email,
    int ProgramaId,
    string Programa,
    int CreditosPorPeriodo,
    DateTime FechaRegistro,
    int CreditosInscritos,
    IReadOnlyList<MateriaInscritaResponse> Materias);

public sealed record MateriaInscritaResponse(int Id, string Nombre, string Profesor, int Creditos, DateTime FechaInscripcion);

/// <summary>Compañeros de una clase: solo sus nombres.</summary>
public sealed record CompanerosPorMateriaResponse(int MateriaId, string Materia, string Profesor, IReadOnlyList<string> Companeros);

public sealed record ActualizarPerfilRequest(
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    string Nombre,

    [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
    [EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
    string Email,

    int ProgramaId);

public sealed record SeleccionMateriasRequest(
    [Required(ErrorMessage = "Selecciona tus materias.")]
    IReadOnlyList<int> MateriaIds);

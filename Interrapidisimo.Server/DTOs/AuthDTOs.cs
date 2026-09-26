using System.ComponentModel.DataAnnotations;

namespace Interrapidisimo.Server.DTOs;

/// <summary>Registro en línea: datos del estudiante, programa de créditos y sus 3 materias.</summary>
public sealed record RegistroRequest(
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    string Nombre,

    [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
    [EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
    string Email,

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")]
    string Password,

    int ProgramaId,

    [Required(ErrorMessage = "Selecciona tus materias.")]
    IReadOnlyList<int> MateriaIds);

/// <summary>Inicio de sesión con correo y contraseña.</summary>
public sealed record LoginRequest(
    [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
    string Email,

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    string Password);

/// <summary>Token emitido tras registrarse o iniciar sesión.</summary>
public sealed record AuthResponse(string Token, DateTime ExpiraEnUtc, UsuarioActual Usuario);

public sealed record UsuarioActual(int Id, string Nombre, string Email);

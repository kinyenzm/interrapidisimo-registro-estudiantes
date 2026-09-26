using System.Text;
using Interrapidisimo.Server.Data;
using Interrapidisimo.Server.Domain;
using Interrapidisimo.Server.Domain.Entities;
using Interrapidisimo.Server.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Interrapidisimo.Server.Services;

public sealed class AuthService(AppDbContext db, IPasswordHasher<Estudiante> hasher, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponse> RegistrarAsync(RegistroRequest request, CancellationToken ct)
    {
        if (!await db.Programas.AnyAsync(p => p.Id == request.ProgramaId, ct))
            throw new AppException(StatusCodes.Status400BadRequest, "El programa seleccionado no existe.");

        var email = request.Email.Trim().ToLowerInvariant();
        if (await db.Estudiantes.AnyAsync(e => e.Email == email, ct))
            throw new AppException(StatusCodes.Status409Conflict, "Ya existe un registro con ese correo electrónico.");

        ReglasAcademicas.ValidarSeleccion(request.MateriaIds, await db.Materias.AsNoTracking().ToListAsync(ct));

        var ahora = DateTime.Now;
        var estudiante = new Estudiante
        {
            Nombre = request.Nombre.Trim(),
            Email = email,
            ProgramaId = request.ProgramaId,
            FechaRegistro = ahora,
            Inscripciones = request.MateriaIds.Select(id => new Inscripcion { MateriaId = id, FechaInscripcion = ahora }).ToList(),
        };
        estudiante.PasswordHash = hasher.HashPassword(estudiante, request.Password);

        // El estudiante y sus 3 inscripciones se guardan juntos.
        db.Estudiantes.Add(estudiante);
        await db.SaveChangesAsync(ct);

        return CrearRespuesta(estudiante);
    }

    public async Task<AuthResponse> IniciarSesionAsync(LoginRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var estudiante = await db.Estudiantes.AsNoTracking().SingleOrDefaultAsync(e => e.Email == email, ct);

        if (estudiante is null ||
            hasher.VerifyHashedPassword(estudiante, estudiante.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            throw new AppException(StatusCodes.Status401Unauthorized, "El correo o la contraseña no son correctos.");

        return CrearRespuesta(estudiante);
    }

    private AuthResponse CrearRespuesta(Estudiante estudiante)
    {
        var jwt = configuration.GetSection("Jwt");
        var expira = DateTime.UtcNow.AddMinutes(jwt.GetValue<int>("ExpiracionMinutos"));

        var token = new JsonWebTokenHandler().CreateToken(new SecurityTokenDescriptor
        {
            Issuer = jwt["Issuer"],
            Audience = jwt["Audience"],
            Expires = expira,
            Claims = new Dictionary<string, object>
            {
                [JwtRegisteredClaimNames.Sub] = estudiante.Id.ToString(),
                [JwtRegisteredClaimNames.Name] = estudiante.Nombre,
            },
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)), SecurityAlgorithms.HmacSha256),
        });

        return new AuthResponse(token, expira, new UsuarioActual(estudiante.Id, estudiante.Nombre, estudiante.Email));
    }
}

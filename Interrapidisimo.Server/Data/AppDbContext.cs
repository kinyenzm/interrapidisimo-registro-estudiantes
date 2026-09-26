using Interrapidisimo.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Interrapidisimo.Server.Data;

/// <summary>Acceso a las tablas creadas por sql/sqlserver/init.sql (no se usan migraciones).</summary>
public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Programa> Programas => Set<Programa>();
    public DbSet<Profesor> Profesores => Set<Profesor>();
    public DbSet<Materia> Materias => Set<Materia>();
    public DbSet<Estudiante> Estudiantes => Set<Estudiante>();
    public DbSet<Inscripcion> Inscripciones => Set<Inscripcion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Inscripcion>().HasKey(i => new { i.EstudianteId, i.MateriaId });
    }
}

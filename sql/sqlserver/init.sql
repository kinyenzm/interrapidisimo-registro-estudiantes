/* Registro de estudiantes - Interrapidísimo (SQL Server / LocalDB)
   Crea la base de datos Interrapidisimo, sus tablas y los datos de ejemplo. Se puede ejecutar varias veces.
   Ejecutar desde la raíz del repositorio:
     sqlcmd -S "(localdb)\MSSQLLocalDB" -E -b -f 65001 -i sql\sqlserver\init.sql
   Contraseña de los estudiantes de ejemplo: Demo123* */

SET NOCOUNT ON;
GO

IF DB_ID(N'Interrapidisimo') IS NULL
    CREATE DATABASE [Interrapidisimo];
GO

USE [Interrapidisimo];
GO

IF OBJECT_ID(N'dbo.Programas') IS NULL
BEGIN
    CREATE TABLE dbo.Programas (
        Id                 INT           NOT NULL PRIMARY KEY,
        Nombre             NVARCHAR(100) NOT NULL,
        Descripcion        NVARCHAR(250) NOT NULL,
        CreditosPorPeriodo INT           NOT NULL
    );

    CREATE TABLE dbo.Profesores (
        Id     INT           NOT NULL PRIMARY KEY,
        Nombre NVARCHAR(100) NOT NULL
    );

    CREATE TABLE dbo.Materias (
        Id         INT           NOT NULL PRIMARY KEY,
        Nombre     NVARCHAR(100) NOT NULL,
        Creditos   INT           NOT NULL,
        ProfesorId INT           NOT NULL REFERENCES dbo.Profesores (Id)
    );

    CREATE TABLE dbo.Estudiantes (
        Id            INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
        Nombre        NVARCHAR(100) NOT NULL,
        Email         NVARCHAR(254) NOT NULL UNIQUE,
        PasswordHash  NVARCHAR(256) NOT NULL,
        ProgramaId    INT           NOT NULL REFERENCES dbo.Programas (Id),
        FechaRegistro DATETIME2     NOT NULL DEFAULT GETDATE()
    );

    CREATE TABLE dbo.Inscripciones (
        EstudianteId     INT       NOT NULL REFERENCES dbo.Estudiantes (Id) ON DELETE CASCADE,
        MateriaId        INT       NOT NULL REFERENCES dbo.Materias (Id),
        FechaInscripcion DATETIME2 NOT NULL DEFAULT GETDATE(),
        PRIMARY KEY (EstudianteId, MateriaId)
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Programas)
BEGIN
    INSERT INTO dbo.Programas (Id, Nombre, Descripcion, CreditosPorPeriodo) VALUES
        (1, N'Ingeniería de Sistemas', N'Plan por créditos: 3 materias × 3 créditos = 9 créditos por periodo.', 9),
        (2, N'Administración',         N'Plan por créditos: 3 materias × 3 créditos = 9 créditos por periodo.', 9),
        (3, N'Contaduría',             N'Plan por créditos: 3 materias × 3 créditos = 9 créditos por periodo.', 9),
        (4, N'Psicología',             N'Plan por créditos: 3 materias × 3 créditos = 9 créditos por periodo.', 9);

    INSERT INTO dbo.Profesores (Id, Nombre) VALUES
        (1, N'Dr. García'),
        (2, N'Dra. López'),
        (3, N'Prof. Martínez'),
        (4, N'Prof. Johnson'),
        (5, N'Ing. Rodríguez');

    -- 10 materias de 3 créditos; cada profesor dicta 2.
    INSERT INTO dbo.Materias (Id, Nombre, Creditos, ProfesorId) VALUES
        ( 1, N'Matemáticas I',      3, 1),
        ( 2, N'Física I',           3, 1),
        ( 3, N'Química General',    3, 2),
        ( 4, N'Biología Celular',   3, 2),
        ( 5, N'Historia Universal', 3, 3),
        ( 6, N'Literatura',         3, 3),
        ( 7, N'Inglés I',           3, 4),
        ( 8, N'Inglés II',          3, 4),
        ( 9, N'Programación I',     3, 5),
        (10, N'Programación II',    3, 5);

    -- Hash PBKDF2 (ASP.NET Core Identity) de la contraseña Demo123*
    INSERT INTO dbo.Estudiantes (Nombre, Email, PasswordHash, ProgramaId) VALUES
        (N'Ana Pérez',         N'ana.perez@example.com',         N'AQAAAAIAAYagAAAAECzCBKQ6vcxYLNk84om1SNykTYgNBX6WRst5Wa0+tUctXM913ig8F8QxC9nMWQiDKA==', 1),
        (N'Carlos Ruiz',       N'carlos.ruiz@example.com',       N'AQAAAAIAAYagAAAAECzCBKQ6vcxYLNk84om1SNykTYgNBX6WRst5Wa0+tUctXM913ig8F8QxC9nMWQiDKA==', 2),
        (N'María González',    N'maria.gonzalez@example.com',    N'AQAAAAIAAYagAAAAECzCBKQ6vcxYLNk84om1SNykTYgNBX6WRst5Wa0+tUctXM913ig8F8QxC9nMWQiDKA==', 3),
        (N'Luis Torres',       N'luis.torres@example.com',       N'AQAAAAIAAYagAAAAECzCBKQ6vcxYLNk84om1SNykTYgNBX6WRst5Wa0+tUctXM913ig8F8QxC9nMWQiDKA==', 4),
        (N'Sofía Ramírez',     N'sofia.ramirez@example.com',     N'AQAAAAIAAYagAAAAECzCBKQ6vcxYLNk84om1SNykTYgNBX6WRst5Wa0+tUctXM913ig8F8QxC9nMWQiDKA==', 1),
        (N'Andrés Castro',     N'andres.castro@example.com',     N'AQAAAAIAAYagAAAAECzCBKQ6vcxYLNk84om1SNykTYgNBX6WRst5Wa0+tUctXM913ig8F8QxC9nMWQiDKA==', 2),
        (N'Valentina Herrera', N'valentina.herrera@example.com', N'AQAAAAIAAYagAAAAECzCBKQ6vcxYLNk84om1SNykTYgNBX6WRst5Wa0+tUctXM913ig8F8QxC9nMWQiDKA==', 4),
        (N'Julián Moreno',     N'julian.moreno@example.com',     N'AQAAAAIAAYagAAAAECzCBKQ6vcxYLNk84om1SNykTYgNBX6WRst5Wa0+tUctXM913ig8F8QxC9nMWQiDKA==', 3);

    INSERT INTO dbo.Inscripciones (EstudianteId, MateriaId)
    SELECT e.Id, v.MateriaId
    FROM (VALUES
        (N'ana.perez@example.com', 1),         (N'ana.perez@example.com', 3),         (N'ana.perez@example.com', 5),
        (N'carlos.ruiz@example.com', 2),       (N'carlos.ruiz@example.com', 4),       (N'carlos.ruiz@example.com', 7),
        (N'maria.gonzalez@example.com', 1),    (N'maria.gonzalez@example.com', 6),    (N'maria.gonzalez@example.com', 9),
        (N'luis.torres@example.com', 3),       (N'luis.torres@example.com', 8),       (N'luis.torres@example.com', 10),
        (N'sofia.ramirez@example.com', 1),     (N'sofia.ramirez@example.com', 4),     (N'sofia.ramirez@example.com', 9),
        (N'andres.castro@example.com', 2),     (N'andres.castro@example.com', 5),     (N'andres.castro@example.com', 10),
        (N'valentina.herrera@example.com', 3), (N'valentina.herrera@example.com', 5), (N'valentina.herrera@example.com', 7),
        (N'julian.moreno@example.com', 6),     (N'julian.moreno@example.com', 8),     (N'julian.moreno@example.com', 9)
    ) AS v (Email, MateriaId)
    INNER JOIN dbo.Estudiantes e ON e.Email = v.Email;
END
GO

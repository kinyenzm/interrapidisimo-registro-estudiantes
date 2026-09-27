# Registro de Estudiantes — Prueba técnica Interrapidísimo

Aplicación web cliente-servidor para el registro de estudiantes en un programa de créditos: **Angular 22**, **.NET 10** y **SQL Server**.

## Requisitos

- .NET 10 SDK
- Node.js `^22.22.3 || ^24.15.0 || >=26`
- SQL Server LocalDB (incluido con Visual Studio) o SQL Server 2017+, y `sqlcmd`

## Base de datos

```bash
sqllocaldb start MSSQLLocalDB
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -b -f 65001 -i sql\sqlserver\init.sql
```

El script crea la base de datos `Interrapidisimo` con las 10 materias, los 5 profesores y estudiantes de ejemplo. La cadena de conexión está en `Interrapidisimo.Server/appsettings.json`.

## Ejecución

```bash
cd interrapidisimo.client
npm ci
cd ..
dotnet run --project Interrapidisimo.Server
```

Abrir `http://localhost:5190` (inicia Angular en `http://localhost:4200`). En Visual Studio: abrir `Interrapidisimo.slnx` y ejecutar `Interrapidisimo.Server`.

Usuarios de ejemplo: `ana.perez@example.com`, `carlos.ruiz@example.com`, `maria.gonzalez@example.com`, … con la contraseña `Demo123*`.

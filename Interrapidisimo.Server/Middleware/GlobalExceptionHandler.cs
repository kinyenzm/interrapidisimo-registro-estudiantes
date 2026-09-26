using Interrapidisimo.Server.Domain;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Interrapidisimo.Server.Middleware;

/// <summary>Convierte las excepciones en respuestas ProblemDetails.</summary>
public sealed class GlobalExceptionHandler(
    IProblemDetailsService problemDetailsService,
    ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (status, detalle) = exception is AppException app
            ? (app.Status, app.Message)
            : (StatusCodes.Status500InternalServerError, "Ocurrió un error inesperado.");

        if (status == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Error no controlado en {Metodo} {Ruta}", httpContext.Request.Method, httpContext.Request.Path);

        httpContext.Response.StatusCode = status;
        return problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails
            {
                Status = status,
                Title = status switch
                {
                    StatusCodes.Status400BadRequest => "Solicitud inválida",
                    StatusCodes.Status401Unauthorized => "No autenticado",
                    StatusCodes.Status404NotFound => "No encontrado",
                    StatusCodes.Status409Conflict => "Conflicto",
                    StatusCodes.Status422UnprocessableEntity => "Regla incumplida",
                    _ => "Error del servidor",
                },
                Detail = detalle,
            },
        });
    }
}

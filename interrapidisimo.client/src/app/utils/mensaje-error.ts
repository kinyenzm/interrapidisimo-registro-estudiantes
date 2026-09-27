import { HttpErrorResponse } from '@angular/common/http';

/** Cuerpo de error de la API (ProblemDetails). */
interface ProblemDetails {
  readonly title?: string;
  readonly detail?: string;
}

/** Mensaje legible para el usuario a partir de cualquier error. */
export function mensajeError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Ocurrió un error inesperado.';
  }
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que la API esté en ejecución.';
  }
  const problema = error.error as ProblemDetails | null;
  return problema?.detail || problema?.title || 'Ocurrió un error inesperado.';
}

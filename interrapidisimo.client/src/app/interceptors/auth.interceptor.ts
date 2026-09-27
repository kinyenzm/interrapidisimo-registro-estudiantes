import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Añade el Bearer a las llamadas a /api/ si hay sesión vigente. Un 401 fuera de /api/auth/ significa que el
 * token expiró o es inválido: se cierra la sesión y se va al login.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = request.url.startsWith('/api/') ? auth.token() : null;
  const conToken = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(conToken).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !request.url.startsWith('/api/auth/')
      ) {
        auth.cerrarSesion();
        void router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};

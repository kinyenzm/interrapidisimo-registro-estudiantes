import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Rutas privadas: sin sesión vigente se va al login. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.sesionVigente()) {
    return true;
  }
  auth.cerrarSesion(); // descarta una sesión expirada para que la barra no siga mostrando al usuario
  return inject(Router).createUrlTree(['/login']);
};

/** Login y registro: con sesión vigente se va a "Mi registro". */
export const invitadoGuard: CanActivateFn = () =>
  inject(AuthService).sesionVigente() ? inject(Router).createUrlTree(['/mi-registro']) : true;

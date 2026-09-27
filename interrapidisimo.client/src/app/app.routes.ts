import { Routes } from '@angular/router';
import { authGuard, invitadoGuard } from './guards/auth.guard';

const titulo = (pagina: string): string => `${pagina} · Registro de Estudiantes`;

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'mi-registro' },
  {
    path: 'login',
    title: titulo('Iniciar sesión'),
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: titulo('Crear mi registro'),
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'mi-registro',
    title: titulo('Mi registro'),
    canActivate: [authGuard],
    loadComponent: () => import('./pages/mi-registro/mi-registro').then((m) => m.MiRegistro),
  },
  {
    path: 'mi-registro/materias',
    title: titulo('Cambiar materias'),
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cambiar-materias/cambiar-materias').then((m) => m.CambiarMaterias),
  },
  {
    path: 'estudiantes',
    title: titulo('Estudiantes'),
    canActivate: [authGuard],
    loadComponent: () => import('./pages/estudiantes/estudiantes').then((m) => m.Estudiantes),
  },
  {
    path: 'companeros',
    title: titulo('Mis compañeros'),
    canActivate: [authGuard],
    loadComponent: () => import('./pages/companeros/companeros').then((m) => m.Companeros),
  },
  { path: '**', redirectTo: '' },
];

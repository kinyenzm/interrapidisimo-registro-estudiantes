import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegistroRequest, UsuarioActual } from '../models/auth.model';

const CLAVE_SESION = 'interrapidisimo.sesion';

function vigente(sesion: AuthResponse | null): sesion is AuthResponse {
  return sesion !== null && Date.now() < Date.parse(sesion.expiraEnUtc);
}

/** Lee la sesión guardada; descarta la que esté dañada o ya haya expirado. */
function leerSesion(): AuthResponse | null {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) ?? 'null') as AuthResponse | null;
    if (vigente(sesion)) {
      return sesion;
    }
    localStorage.removeItem(CLAVE_SESION);
  } catch {
    // JSON inválido o localStorage no disponible: se empieza sin sesión.
  }
  return null;
}

/** Sesión del estudiante: un signal persistido en localStorage. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sesion = signal<AuthResponse | null>(leerSesion());

  readonly usuario = computed<UsuarioActual | null>(() => this.sesion()?.usuario ?? null);

  sesionVigente(): boolean {
    return vigente(this.sesion());
  }

  token(): string | null {
    const sesion = this.sesion();
    return vigente(sesion) ? sesion.token : null;
  }

  iniciarSesion(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/login', request)
      .pipe(tap((sesion) => this.guardar(sesion)));
  }

  registrar(request: RegistroRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/registro', request)
      .pipe(tap((sesion) => this.guardar(sesion)));
  }

  cerrarSesion(): void {
    this.guardar(null);
  }

  /** Refleja en la sesión los cambios de nombre o correo hechos en "Mi registro". */
  actualizarUsuario(usuario: UsuarioActual): void {
    const sesion = this.sesion();
    if (sesion) {
      this.guardar({ ...sesion, usuario });
    }
  }

  private guardar(sesion: AuthResponse | null): void {
    this.sesion.set(sesion);
    try {
      if (sesion) {
        localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
      } else {
        localStorage.removeItem(CLAVE_SESION);
      }
    } catch {
      // Sin localStorage la sesión vive solo en memoria.
    }
  }
}

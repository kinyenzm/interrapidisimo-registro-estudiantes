/** Datos del propio usuario que devuelve la API al autenticarse (el JWT no lleva el correo). */
export interface UsuarioActual {
  readonly id: number;
  readonly nombre: string;
  readonly email: string;
}

export interface AuthResponse {
  readonly token: string;
  /** Fecha ISO 8601 en UTC. */
  readonly expiraEnUtc: string;
  readonly usuario: UsuarioActual;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegistroRequest {
  readonly nombre: string;
  readonly email: string;
  readonly password: string;
  readonly programaId: number;
  readonly materiaIds: readonly number[];
}

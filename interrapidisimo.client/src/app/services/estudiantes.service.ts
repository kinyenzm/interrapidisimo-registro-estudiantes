import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActualizarPerfilRequest,
  CompanerosPorMateria,
  EstudiantePublico,
  MiRegistro,
} from '../models/estudiante.model';

/** Registros de estudiantes. Las rutas /me siempre operan sobre el estudiante del token. */
@Injectable({ providedIn: 'root' })
export class EstudiantesService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/estudiantes';

  listar(): Observable<EstudiantePublico[]> {
    return this.http.get<EstudiantePublico[]>(this.base);
  }

  obtenerMiRegistro(): Observable<MiRegistro> {
    return this.http.get<MiRegistro>(`${this.base}/me`);
  }

  actualizarPerfil(request: ActualizarPerfilRequest): Observable<MiRegistro> {
    return this.http.put<MiRegistro>(`${this.base}/me`, request);
  }

  cambiarMaterias(materiaIds: readonly number[]): Observable<MiRegistro> {
    return this.http.put<MiRegistro>(`${this.base}/me/materias`, { materiaIds });
  }

  eliminar(): Observable<void> {
    return this.http.delete<void>(`${this.base}/me`);
  }

  companeros(): Observable<CompanerosPorMateria[]> {
    return this.http.get<CompanerosPorMateria[]>(`${this.base}/me/companeros`);
  }
}

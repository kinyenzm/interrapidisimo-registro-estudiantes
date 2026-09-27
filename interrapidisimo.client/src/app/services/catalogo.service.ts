import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Catalogo } from '../models/catalogo.model';

/** Catálogo público (programas, profesores y materias). Es fijo: se pide una vez y se reutiliza. */
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly catalogo$ = this.http.get<Catalogo>('/api/catalogo').pipe(shareReplay(1));

  obtener(): Observable<Catalogo> {
    return this.catalogo$;
  }
}

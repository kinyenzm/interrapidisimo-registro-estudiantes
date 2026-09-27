import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { EstudiantePublico } from '../../models/estudiante.model';
import { EstudiantesService } from '../../services/estudiantes.service';
import { mensajeError } from '../../utils/mensaje-error';

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/** Registros de todos los estudiantes (sin correos ni ids), con las clases en común contigo. */
@Component({
  selector: 'app-estudiantes',
  imports: [DatePipe],
  templateUrl: './estudiantes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Estudiantes implements OnInit {
  private readonly servicio = inject(EstudiantesService);

  protected readonly estudiantes = signal<readonly EstudiantePublico[]>([]);
  protected readonly filtro = signal('');
  protected readonly cargando = signal(false);
  protected readonly cargadoEn = signal<Date | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly filtrados = computed(() => {
    const filtro = normalizar(this.filtro());
    const todos = this.estudiantes();
    return filtro === ''
      ? todos
      : todos.filter((e) => normalizar(`${e.nombre} ${e.programa}`).includes(filtro));
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    if (this.cargando()) {
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.servicio
      .listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (estudiantes) => {
          this.estudiantes.set(estudiantes);
          this.cargadoEn.set(new Date());
        },
        error: (error: unknown) => this.error.set(mensajeError(error)),
      });
  }

  protected buscar(evento: Event): void {
    this.filtro.set(evento.target instanceof HTMLInputElement ? evento.target.value : '');
  }
}

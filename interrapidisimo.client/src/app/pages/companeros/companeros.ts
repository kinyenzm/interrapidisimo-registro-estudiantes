import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CompanerosPorMateria } from '../../models/estudiante.model';
import { EstudiantesService } from '../../services/estudiantes.service';
import { mensajeError } from '../../utils/mensaje-error';

/** Por cada una de tus clases, solo los nombres de tus compañeros. */
@Component({
  selector: 'app-companeros',
  imports: [DatePipe],
  templateUrl: './companeros.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Companeros implements OnInit {
  private readonly servicio = inject(EstudiantesService);

  protected readonly clases = signal<readonly CompanerosPorMateria[] | null>(null);
  protected readonly cargando = signal(false);
  protected readonly cargadoEn = signal<Date | null>(null);
  protected readonly error = signal<string | null>(null);

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
      .companeros()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (clases) => {
          this.clases.set(clases);
          this.cargadoEn.set(new Date());
        },
        error: (error: unknown) => this.error.set(mensajeError(error)),
      });
  }
}

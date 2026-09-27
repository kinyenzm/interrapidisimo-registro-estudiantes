import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { SelectorMaterias, textoFaltante } from '../../components/selector-materias/selector-materias';
import { Catalogo } from '../../models/catalogo.model';
import { CatalogoService } from '../../services/catalogo.service';
import { EstudiantesService } from '../../services/estudiantes.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { mensajeError } from '../../utils/mensaje-error';

@Component({
  selector: 'app-cambiar-materias',
  imports: [RouterLink, SelectorMaterias],
  templateUrl: './cambiar-materias.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CambiarMaterias implements OnInit {
  private readonly catalogoService = inject(CatalogoService);
  private readonly estudiantes = inject(EstudiantesService);
  private readonly notificaciones = inject(NotificacionesService);
  private readonly router = inject(Router);

  protected readonly catalogo = signal<Catalogo | null>(null);
  protected readonly seleccion = signal<readonly number[]>([]);
  protected readonly guardando = signal(false);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly puedeGuardar = computed(
    () => this.seleccion().length === this.catalogo()?.reglas.materiasPorEstudiante && !this.guardando(),
  );
  protected readonly faltante = computed(() => {
    const catalogo = this.catalogo();
    return catalogo ? textoFaltante(this.seleccion().length, catalogo.reglas.materiasPorEstudiante) : '';
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.errorCarga.set(null);
    forkJoin({ catalogo: this.catalogoService.obtener(), registro: this.estudiantes.obtenerMiRegistro() }).subscribe({
      next: ({ catalogo, registro }) => {
        this.catalogo.set(catalogo);
        this.seleccion.set(registro.materias.map((m) => m.id));
      },
      error: (error: unknown) => this.errorCarga.set(mensajeError(error)),
    });
  }

  protected guardar(): void {
    if (!this.puedeGuardar()) {
      return;
    }
    this.guardando.set(true);
    this.error.set(null);
    this.estudiantes
      .cambiarMaterias(this.seleccion())
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => {
          this.notificaciones.exito('Tus materias se actualizaron.');
          void this.router.navigate(['/mi-registro']);
        },
        error: (error: unknown) => this.error.set(mensajeError(error)),
      });
  }
}

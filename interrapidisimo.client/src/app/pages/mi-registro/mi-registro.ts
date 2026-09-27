import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Programa } from '../../models/catalogo.model';
import { MiRegistro as Registro } from '../../models/estudiante.model';
import { AuthService } from '../../services/auth.service';
import { CatalogoService } from '../../services/catalogo.service';
import { EstudiantesService } from '../../services/estudiantes.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { mensajeError } from '../../utils/mensaje-error';

type Campo = 'nombre' | 'email' | 'programaId';

@Component({
  selector: 'app-mi-registro',
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './mi-registro.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiRegistro implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly estudiantes = inject(EstudiantesService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly notificaciones = inject(NotificacionesService);
  private readonly router = inject(Router);

  protected readonly registro = signal<Registro | null>(null);
  protected readonly programas = signal<readonly Programa[]>([]);
  protected readonly error = signal<string | null>(null);

  protected readonly editando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly errorEdicion = signal<string | null>(null);

  protected readonly confirmandoEliminar = signal(false);
  protected readonly eliminando = signal(false);

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    nombre: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    programaId: [0, [Validators.min(1)]],
  });

  ngOnInit(): void {
    this.cargar();
    this.catalogoService.obtener().subscribe({
      next: (catalogo) => this.programas.set(catalogo.programas),
      error: () => this.programas.set([]),
    });
  }

  protected cargar(): void {
    this.error.set(null);
    this.estudiantes.obtenerMiRegistro().subscribe({
      next: (registro) => this.registro.set(registro),
      error: (error: unknown) => this.error.set(mensajeError(error)),
    });
  }

  protected editar(): void {
    const r = this.registro();
    if (!r) {
      return;
    }
    this.formulario.reset({ nombre: r.nombre, email: r.email, programaId: r.programaId });
    this.errorEdicion.set(null);
    this.editando.set(true);
  }

  protected cancelarEdicion(): void {
    this.editando.set(false);
  }

  protected invalido(campo: Campo): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  protected guardar(): void {
    if (this.guardando()) {
      return;
    }
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const datos = this.formulario.getRawValue();
    this.guardando.set(true);
    this.errorEdicion.set(null);
    this.estudiantes
      .actualizarPerfil({
        nombre: datos.nombre.trim(),
        email: datos.email.trim(),
        programaId: datos.programaId,
      })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (registro) => {
          this.registro.set(registro);
          this.auth.actualizarUsuario({ id: registro.id, nombre: registro.nombre, email: registro.email });
          this.editando.set(false);
          this.notificaciones.exito('Tus datos se actualizaron.');
        },
        error: (error: unknown) => this.mostrarError(error),
      });
  }

  protected eliminar(): void {
    if (this.eliminando()) {
      return;
    }
    this.eliminando.set(true);
    this.estudiantes
      .eliminar()
      .pipe(finalize(() => this.eliminando.set(false)))
      .subscribe({
        next: () => {
          this.auth.cerrarSesion();
          this.notificaciones.info('Tu registro fue eliminado.');
          void this.router.navigate(['/registro']);
        },
        error: (error: unknown) => {
          this.confirmandoEliminar.set(false);
          this.notificaciones.error(mensajeError(error));
        },
      });
  }

  /** 409: el correo ya lo usa otro estudiante. */
  private mostrarError(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === 409) {
      const email = this.formulario.controls.email;
      email.setErrors({ servidor: mensajeError(error) });
      email.markAsTouched();
    } else {
      this.errorEdicion.set(mensajeError(error));
    }
  }
}

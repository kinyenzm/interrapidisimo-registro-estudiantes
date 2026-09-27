import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SelectorMaterias, textoFaltante } from '../../components/selector-materias/selector-materias';
import { Catalogo } from '../../models/catalogo.model';
import { AuthService } from '../../services/auth.service';
import { CatalogoService } from '../../services/catalogo.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { mensajeError } from '../../utils/mensaje-error';

type Campo = 'nombre' | 'email' | 'password' | 'confirmacion' | 'programaId';

const passwordsIguales: ValidatorFn = (grupo) =>
  grupo.get('password')?.value === grupo.get('confirmacion')?.value ? null : { noCoinciden: true };

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, SelectorMaterias],
  templateUrl: './registro.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registro implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly notificaciones = inject(NotificacionesService);
  private readonly router = inject(Router);

  protected readonly formulario = inject(NonNullableFormBuilder).group(
    {
      nombre: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmacion: [''],
      programaId: [0, [Validators.min(1)]],
    },
    { validators: passwordsIguales },
  );

  protected readonly catalogo = signal<Catalogo | null>(null);
  protected readonly errorCatalogo = signal<string | null>(null);
  protected readonly seleccion = signal<readonly number[]>([]);
  protected readonly guardando = signal(false);
  protected readonly errorGeneral = signal<string | null>(null);
  protected readonly errorSeleccion = signal<string | null>(null);
  protected readonly verPassword = signal(false);

  private readonly programaId = toSignal(this.formulario.controls.programaId.valueChanges, {
    initialValue: 0,
  });

  /** Programa elegido, para mostrar su descripción. */
  protected readonly programa = computed(
    () => this.catalogo()?.programas.find((p) => p.id === this.programaId()) ?? null,
  );
  protected readonly faltante = computed(() => {
    const catalogo = this.catalogo();
    return catalogo ? textoFaltante(this.seleccion().length, catalogo.reglas.materiasPorEstudiante) : '';
  });

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  protected cargarCatalogo(): void {
    this.errorCatalogo.set(null);
    this.catalogoService.obtener().subscribe({
      next: (catalogo) => this.catalogo.set(catalogo),
      error: (error: unknown) => this.errorCatalogo.set(mensajeError(error)),
    });
  }

  protected cambiarSeleccion(seleccion: readonly number[]): void {
    this.seleccion.set(seleccion);
    this.errorSeleccion.set(null);
  }

  protected invalido(campo: Campo): boolean {
    const control = this.formulario.controls[campo];
    const noCoinciden = campo === 'confirmacion' && this.formulario.hasError('noCoinciden');
    return (control.invalid || noCoinciden) && (control.touched || control.dirty);
  }

  protected crear(): void {
    if (this.guardando()) {
      return;
    }
    const faltante = this.faltante();
    if (this.formulario.invalid || faltante) {
      this.formulario.markAllAsTouched();
      this.errorSeleccion.set(faltante ? `${faltante} para completar tu registro.` : null);
      return;
    }

    const datos = this.formulario.getRawValue();
    this.guardando.set(true);
    this.errorGeneral.set(null);
    this.errorSeleccion.set(null);
    this.auth
      .registrar({
        nombre: datos.nombre.trim(),
        email: datos.email.trim(),
        password: datos.password,
        programaId: datos.programaId,
        materiaIds: this.seleccion(),
      })
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (respuesta) => {
          this.notificaciones.exito(`¡Registro creado! Bienvenido, ${respuesta.usuario.nombre}.`);
          void this.router.navigate(['/mi-registro']);
        },
        error: (error: unknown) => this.mostrarError(error),
      });
  }

  /** 409: el correo ya está registrado. 422: la selección de materias no cumple las reglas. */
  private mostrarError(error: unknown): void {
    const status = error instanceof HttpErrorResponse ? error.status : 0;
    if (status === 409) {
      const email = this.formulario.controls.email;
      email.setErrors({ servidor: mensajeError(error) });
      email.markAsTouched();
    } else if (status === 422) {
      this.errorSeleccion.set(mensajeError(error));
    } else {
      this.errorGeneral.set(mensajeError(error));
    }
  }
}

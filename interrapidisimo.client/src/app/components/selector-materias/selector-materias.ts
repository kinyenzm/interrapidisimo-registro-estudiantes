import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { Catalogo, Profesor } from '../../models/catalogo.model';

/** "Te falta 1 materia", "Te faltan 2 materias" o cadena vacía si la selección está completa. */
export function textoFaltante(cantidad: number, maximo: number): string {
  const faltan = maximo - cantidad;
  if (faltan <= 0) {
    return '';
  }
  return faltan === 1 ? 'Te falta 1 materia' : `Te faltan ${faltan} materias`;
}

/** Selector de materias agrupadas por profesor, con el contador de materias y créditos. */
@Component({
  selector: 'app-selector-materias',
  templateUrl: './selector-materias.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorMaterias {
  readonly catalogo = input.required<Catalogo>();
  readonly seleccion = model<readonly number[]>([]);
  readonly deshabilitado = input(false);

  protected readonly creditos = computed(() =>
    this.catalogo()
      .profesores.flatMap((p) => p.materias)
      .filter((m) => this.seleccion().includes(m.id))
      .reduce((total, m) => total + m.creditos, 0),
  );
  protected readonly completa = computed(
    () => this.seleccion().length === this.catalogo().reglas.materiasPorEstudiante,
  );

  protected elegida(id: number): boolean {
    return this.seleccion().includes(id);
  }

  /** Motivo por el que no se puede elegir la materia, o null si se puede (o ya está elegida). */
  protected motivo(profesor: Profesor, id: number): string | null {
    const seleccion = this.seleccion();
    if (seleccion.includes(id)) {
      return null;
    }
    const otraDelProfesor = profesor.materias.find((m) => seleccion.includes(m.id));
    if (otraDelProfesor) {
      return `Ya elegiste ${otraDelProfesor.nombre} con ${profesor.nombre}`;
    }
    const maximo = this.catalogo().reglas.materiasPorEstudiante;
    return seleccion.length >= maximo ? `Ya elegiste ${maximo} materias` : null;
  }

  /** Clases de la opción (literales completos para que Tailwind las detecte). */
  protected claseOpcion(elegida: boolean, bloqueada: boolean): string {
    if (elegida) {
      return 'border-primary bg-primary/10 cursor-pointer';
    }
    return bloqueada
      ? 'border-base-300 bg-base-200 text-base-content/60 cursor-not-allowed'
      : 'border-base-300 hover:border-primary cursor-pointer';
  }

  protected alternar(id: number): void {
    const seleccion = this.seleccion();
    this.seleccion.set(seleccion.includes(id) ? seleccion.filter((m) => m !== id) : [...seleccion, id]);
  }
}

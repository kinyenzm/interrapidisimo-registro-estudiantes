export interface Reglas {
  readonly materiasPorEstudiante: number;
  readonly creditosPorMateria: number;
  readonly creditosPorPeriodo: number;
}

export interface Programa {
  readonly id: number;
  readonly nombre: string;
  readonly descripcion: string;
  readonly creditosPorPeriodo: number;
}

export interface Materia {
  readonly id: number;
  readonly nombre: string;
  readonly creditos: number;
}

export interface Profesor {
  readonly id: number;
  readonly nombre: string;
  readonly materias: readonly Materia[];
}

export interface Catalogo {
  readonly reglas: Reglas;
  readonly programas: readonly Programa[];
  readonly profesores: readonly Profesor[];
}

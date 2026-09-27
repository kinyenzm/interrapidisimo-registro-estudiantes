/** Registro de otro estudiante tal como se ve en el listado: sin id, correo ni fechas. */
export interface EstudiantePublico {
  readonly nombre: string;
  readonly programa: string;
  readonly creditosInscritos: number;
  readonly creditosPorPeriodo: number;
  readonly esPropio: boolean;
  /** Solo las materias que comparte contigo; en tu propia fila, las tuyas. */
  readonly materiasEnComun: readonly string[];
}

export interface MateriaInscrita {
  readonly id: number;
  readonly nombre: string;
  readonly profesor: string;
  readonly creditos: number;
  readonly fechaInscripcion: string;
}

export interface MiRegistro {
  readonly id: number;
  readonly nombre: string;
  readonly email: string;
  readonly programaId: number;
  readonly programa: string;
  readonly creditosPorPeriodo: number;
  readonly fechaRegistro: string;
  readonly creditosInscritos: number;
  readonly materias: readonly MateriaInscrita[];
}

/** Compañeros de una de tus clases: solo nombres. */
export interface CompanerosPorMateria {
  readonly materiaId: number;
  readonly materia: string;
  readonly profesor: string;
  readonly companeros: readonly string[];
}

export interface ActualizarPerfilRequest {
  readonly nombre: string;
  readonly email: string;
  readonly programaId: number;
}

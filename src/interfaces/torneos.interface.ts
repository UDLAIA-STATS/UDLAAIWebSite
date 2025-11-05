export interface Temporada {
    idtemporada: number;
    nombretemporada: string;
    descripciontemporada: string;
    tipotemporada: 'Amistosa' | 'Oficial';
    fechainiciotemporada: string;
    fechafintemporada: string;
    temporadaactiva: boolean;
}

export interface Torneo {
    idtorneo: number;
    idtemporada: number;
    nombretorneo: string;
    descripciontorneo: string;
    fechainiciotorneo: string;
    fechafintorneo: string;
    torneoactivo: boolean;
}

export interface Institucion {
    idinstitucion: number;
    nombreinstitucion: string;
    institucionactiva: boolean;
}

export interface Equipo {
    idequipo: number;
    idinstitucion: number;
    nombreequipo: string;
    imagenequipo?: string | null;
    equipoactivo: boolean;
}

export interface Partido {
  idpartido: number;
  fechapartido: string;
  marcadorequipolocal?: number | null;
  marcadorequipovisitante?: number | null;

  // --- Equipos ---
  idequipolocal: number;
  idequipovisitante: number;
  equipo_local?: string;
  equipo_visitante?: string;

  // --- Torneo ---
  idtorneo: number;
  torneo_nombre?: string;
  torneo_descripcion?: string;
  torneo_fechainicio?: string;
  torneo_fechafin?: string;
  torneo_activo?: boolean;

  // --- Temporada ---
  idtemporada: number;
  temporada_nombre?: string;
  temporada_descripcion?: string;
  temporada_tipo?: "Amistosa" | "Oficial";
  temporada_fechainicio?: string;
  temporada_fechafin?: string;
  temporada_activa?: boolean;
}

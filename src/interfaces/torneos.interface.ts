export interface Temporada {
  idtemporada: number;
  nombretemporada: string;
  descripciontemporada: string;
  tipotemporada: "Amistosa" | "Oficial";
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
  institucion_nombre: string;
  nombreequipo: string;
  imagenequipo?: string | null;
  equipoactivo: boolean;
}

export interface Partido {
  idpartido: number;
  fechapartido: string;
  marcadorequipolocal?: number | null;
  marcadorequipovisitante?: number | null;
  partidosubido: boolean;

  // --- Equipos ---
  idequipolocal: number;
  idequipovisitante: number;
  equipo_local_nombre?: string;
  equipo_visitante_nombre?: string;

  // --- Torneo ---
  idtorneo: number;
  torneo_nombre?: string;

  // --- Temporada ---
  idtemporada: number;
  temporada_nombre?: string;
}

export interface Equipo {
    idequipo: number;
    nombreequipo: string;
    logoequipo?: string;
}

export interface Partido {
    idpartido: number;
    marcadorequipolocal?: number;
    marcadorequipovisitante?: number;
    fechapartido: string; // ISO date string
    tipopartido: boolean; // True = oficial, False = amistoso
    idequipolocal: number;
    idequipovisitante: number;
    equipo_local: string;
    equipo_visitante: string;
}

export interface Torneo {
    idtorneo: number;
    nombretorneo: string;
    descripciontorneo?: string;
}

export interface Temporada {
    idtemporada: number;
    nombretemporada: string;
    tipotemporada: boolean; // True = Oficial / False = Amistoso
    idtorneo: number;
    torneo_nombre: string;
}

export interface TorneoPartido {
    idtorneo: number;
    idpartido: number;
}




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
    idequipolocal: Equipo;
    idequipovisitante: Equipo;
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
    idtorneo: Torneo;
}

export interface TorneoPartido {
    idtorneo: Torneo;
    idpartido: Partido;
}




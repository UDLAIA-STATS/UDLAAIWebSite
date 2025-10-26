import type { Torneo, Partido, Temporada, Equipo, TableActions } from "@interfaces/index";
import {
  highlightedButtonClass,
  disabledButtonClass,
} from "@consts/index";
import { privateRoutesMap } from "@consts/routes"
export enum matchOptions {
  torneos = "Torneos",
  partidos = "Partidos",
  temporadas = "Temporadas",
  equipos = "Equipos",
}
import EditIcon from "@assets/edit_icon_black.svg";
import DeleteIcon from "@assets/delete_icon_black.svg";

export const getHeaders = (filter: matchOptions) => {
  switch (filter) {
    case matchOptions.torneos:
      return ["ID", "Nombre", "Descripción", "Editar", "Eliminar"];
    case matchOptions.partidos:
      return [
        "ID",
        "Fecha",
        "Local",
        "Visitante",
        "Marcador",
        "Tipo",
        "Editar",
        "Eliminar",
      ];
    case matchOptions.temporadas:
      return ["ID", "Nombre", "Tipo", "Torneo", "Editar", "Eliminar"];
    case matchOptions.equipos:
      return ["ID", "Nombre", "Editar", "Eliminar"];
  }
};

export const getRows = (
  filter: matchOptions,
  torneos?: Torneo[],
  partidos?: Partido[],
  temporadas?: Temporada[],
  equipos?: Equipo[]
) => {
  switch (filter) {
    case matchOptions.torneos:
      return torneos!.map((t) => [
        t.idtorneo,
        t.nombretorneo,
        t.descripciontorneo ?? "-",
      ]);
    case matchOptions.partidos:
      return partidos!.map((p) => [
        p.idpartido,
        new Date(p.fechapartido).toLocaleDateString(),
        p.idequipolocal.nombreequipo,
        p.idequipovisitante.nombreequipo,
        `${p.marcadorequipolocal ?? 0} - ${p.marcadorequipovisitante ?? 0}`,
        p.tipopartido ? "Oficial" : "Amistoso",
      ]);
    case matchOptions.temporadas:
      return temporadas!.map((t) => [
        t.idtemporada,
        t.nombretemporada,
        t.tipotemporada ? "Oficial" : "Amistoso",
        t.idtorneo.nombretorneo,
      ]);
    case matchOptions.equipos:
      return equipos!.map((e) => [e.idequipo, e.nombreequipo]);
  }
};


export const getActions = (
    filter: matchOptions,
    handleDelete: (argument: any) => void
  ) => {
    const deleteAction: TableActions = {
    action: handleDelete,
    icon: DeleteIcon.src,
    alt: "Eliminar",
    type: "button",
  };
    switch (filter) {
      case matchOptions.torneos:
        return [
          {
            href: `${privateRoutesMap.EDITAR_TORNEOS}`,
            icon: EditIcon.src,
            alt: "Editar",
            type: "link",
          },
          deleteAction,
        ];
      case matchOptions.partidos:
        return [
          {
            href: `${privateRoutesMap.EDITAR_PARTIDOS}`,
            icon: EditIcon.src,
            alt: "Editar",
            type: "link",
          },
          deleteAction,
        ];
      case matchOptions.temporadas:
        return [
          {
            href: `${privateRoutesMap.EDITAR_TEMPORADAS}`,
            icon: EditIcon.src,
            alt: "Editar",
            type: "link",
          },
          deleteAction,
        ];
      case matchOptions.equipos:
        return [
          {
            href: `${privateRoutesMap.EDITAR_EQUIPOS}`,
            icon: EditIcon.src,
            alt: "Editar",
            type: "link",
          },
          deleteAction,
        ];
    }
  };

export const getAddLabel = (currentFilter: matchOptions) => {
    switch (currentFilter) {
      case matchOptions.torneos:
        return "Agregar Torneo";
      case matchOptions.partidos:
        return "Agregar Partido";
      case matchOptions.temporadas:
        return "Agregar Temporada";
      case matchOptions.equipos:
        return "Agregar Equipo";
    }
  };

export const getAddHref = (currentFilter: matchOptions) => {
    switch (currentFilter) {
      case matchOptions.torneos:
        return privateRoutesMap.CREAR_TORNEOS;
      case matchOptions.partidos:
        return privateRoutesMap.CREAR_PARTIDOS;
      case matchOptions.temporadas:
        return privateRoutesMap.CREAR_TEMPORADAS;
      case matchOptions.equipos:
        return privateRoutesMap.CREAR_EQUIPOS;
    }
  };
import type {
  Torneo,
  Partido,
  Temporada,
  Equipo,
  TableActions,
  TableContent,
} from "@interfaces/index";
import { privateRoutesMap } from "@consts/routes";
import EditIcon from "@assets/edit_icon_black.svg";
import DeleteIcon from "@assets/delete_icon_black.svg";

export enum matchOptions {
  torneos = "Torneos",
  partidos = "Partidos",
  temporadas = "Temporadas",
  equipos = "Equipos",
}

export const getHeaders = (filter: matchOptions): TableContent[] => {
  switch (filter) {
    case matchOptions.torneos:
      return [
        { data: "ID", isVisible: false },
        { data: "Nombre" },
        { data: "Fecha Inicio" },
        { data: "Fecha Fin" },
        { data: "Activo" },
        { data: "Editar" },
        { data: "Eliminar" },
      ];

    case matchOptions.partidos:
      return [
        { data: "ID", isVisible: false },
        { data: "Fecha" },
        { data: "Local" },
        { data: "Visitante" },
        { data: "Marcador" },
        { data: "Torneo" },
        { data: "Temporada" },
        { data: "Editar" },
        { data: "Eliminar" },
      ];

    case matchOptions.temporadas:
      return [
        { data: "ID", isVisible: false },
        { data: "Nombre" },
        { data: "Tipo" },
        { data: "Fecha Inicio" },
        { data: "Fecha Fin" },
        { data: "Activo" },
        { data: "Editar" },
        { data: "Eliminar" },
      ];

    case matchOptions.equipos:
      return [
        { data: "ID", isVisible: false },
        { data: "Nombre" },
        { data: "Institución" },
        { data: "Activo" },
        { data: "Editar" },
        { data: "Eliminar" },
      ];

    default:
      return [];
  }
};

export const getRows = (
  filter: matchOptions,
  torneos?: Torneo[] | null,
  partidos?: Partido[] | null,
  temporadas?: Temporada[] | null,
  equipos?: Equipo[] | null
): TableContent[][] => {
  const capitalize = (value?: string | null) => {
    if (!value) return "-";
    const lower = value.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  switch (filter) {
    case matchOptions.torneos:
      if (!Array.isArray(torneos)) return [];
      return torneos.map((t) => [
        { data: String(t.idtorneo ?? "-"), isVisible: false },
        { data: t.nombretorneo ?? "-" },
        { data: t.fechainiciotorneo.split("T")[0] ?? "-" },
        { data: t.fechafintorneo.split("T")[0] ?? "-" },
        { data: capitalize(t.torneoactivo ? "Sí" : "No") },
      ]);

    case matchOptions.partidos:
      if (!Array.isArray(partidos)) return [];
      return partidos.map((p) => [
        { data: String(p.idpartido ?? "-"), isVisible: false },
        {
          data: new Date(p.fechapartido).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) ??
             "-",
        },
        { data: p.equipo_local_nombre ?? "-" },
        { data: p.equipo_visitante_nombre ?? "-" },
        {
          data: `${p.marcadorequipolocal ?? 0} - ${p.marcadorequipovisitante ?? 0}`,
        },
        { data: p.torneo_nombre ?? "-" },
        { data: p.temporada_nombre ?? "-" },
      ]);

    case matchOptions.temporadas:
      if (!Array.isArray(temporadas)) return [];
      return temporadas.map((t) => [
        { data: String(t.idtemporada ?? "-"), isVisible: false },
        { data: t.nombretemporada ?? "-" },
        { data: capitalize(t.tipotemporada) },
        { data: t.fechainiciotemporada.split("T")[0] ?? "-" },
        { data: t.fechafintemporada.split("T")[0] ?? "-" },
        { data: capitalize(t.temporadaactiva ? "Sí" : "No") },
      ]);

    case matchOptions.equipos:
      if (!Array.isArray(equipos)) return [];
      return equipos.map((e) => [
        { data: String(e.idequipo ?? "-"), isVisible: false },
        { data: e.nombreequipo ?? "-" },
        { data: e.institucion_nombre ?? "-" },
        { data: capitalize(e.equipoactivo ? "Sí" : "No") },
      ]);

    default:
      return [];
  }
};

export const getActions = (
  filter: matchOptions,
  handleDelete: (argument: any) => void
): TableActions[] => {
  const deleteAction: TableActions = {
    action: handleDelete,
    icon: DeleteIcon.src,
    alt: "Eliminar",
    type: "button",
  };

  const editAction = (href: string): TableActions => ({
    href,
    icon: EditIcon.src,
    alt: "Editar",
    type: "link",
  });

  switch (filter) {
    case matchOptions.torneos:
      return [editAction(privateRoutesMap.EDITAR_TORNEOS), deleteAction];
    case matchOptions.partidos:
      return [editAction(privateRoutesMap.EDITAR_PARTIDOS), deleteAction];
    case matchOptions.temporadas:
      return [editAction(privateRoutesMap.EDITAR_TEMPORADAS), deleteAction];
    case matchOptions.equipos:
      return [editAction(privateRoutesMap.EDITAR_EQUIPOS), deleteAction];
    default:
      return [];
  }
};

export const getAddLabel = (currentFilter: matchOptions): string => {
  switch (currentFilter) {
    case matchOptions.torneos:
      return "Agregar Torneo";
    case matchOptions.partidos:
      return "Agregar Partido";
    case matchOptions.temporadas:
      return "Agregar Temporada";
    case matchOptions.equipos:
      return "Agregar Equipo";
    default:
      return "";
  }
};

export const getAddHref = (currentFilter: matchOptions): string => {
  switch (currentFilter) {
    case matchOptions.torneos:
      return privateRoutesMap.CREAR_TORNEOS;
    case matchOptions.partidos:
      return privateRoutesMap.CREAR_PARTIDOS;
    case matchOptions.temporadas:
      return privateRoutesMap.CREAR_TEMPORADAS;
    case matchOptions.equipos:
      return privateRoutesMap.CREAR_EQUIPOS;
    default:
      return "";
  }
};

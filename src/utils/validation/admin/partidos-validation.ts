import type { Partido } from "@interfaces/torneos.interface";

export const validatePartidos = (formData: FormData): string => {
  const idTorneo = formData.get("idtorneo")?.toString().trim() ?? "";
  const idEquipoLocal = formData.get("idequipolocal")?.toString().trim() ?? "";
  const idEquipoVisitante = formData
    .get("idequipovisitante")
    ?.toString()
    .trim() ?? "";
  const marcadorLocal = formData
    .get("marcadorequipolocal")
    ?.toString()
    .trim() ?? "";
  const marcadorVisitante = formData
    .get("marcadorequipovisitante")
    ?.toString()
    .trim() ?? "";
  const fechaPartido = formData.get("fechapartido")?.toString().trim() ?? "";

  const validationsErrors: Record<string, string> = {
    idTorneo:
      idTorneo === "" || idTorneo === "Selecciona un torneo"
        ? "Debe seleccionar un torneo."
        : "",

    equipos:
      idEquipoLocal === ""
        ? "Debe seleccionar un equipo local."
        : idEquipoVisitante === ""
          ? "Debe seleccionar un equipo visitante."
          : "",

    equiposIguales:
      idEquipoLocal !== "" &&
      idEquipoVisitante !== "" &&
      idEquipoLocal === idEquipoVisitante
        ? "El equipo local y el visitante no pueden ser el mismo."
        : "",

    marcadorLocal:
      marcadorLocal === ""
        ? "El marcador del equipo local es obligatorio."
        : isNaN(Number(marcadorLocal)) || Number(marcadorLocal) < 0
          ? "El marcador del equipo local debe ser un número mayor o igual a 0."
          : "",

    marcadorVisitante:
      marcadorVisitante === ""
        ? "El marcador del equipo visitante es obligatorio."
        : isNaN(Number(marcadorVisitante)) || Number(marcadorVisitante) < 0
          ? "El marcador del equipo visitante debe ser un número mayor o igual a 0."
          : "",

    fecha:
      fechaPartido === ""
        ? "La fecha del partido es obligatoria."
        : isNaN(new Date(fechaPartido).getTime())
          ? "La fecha del partido no es válida."
          : "",
  };

  const errorMessages = Object.values(validationsErrors).filter((msg) => msg !== "");

  return errorMessages.length > 0 ? errorMessages.join("<br/>") : "";
};

/**
 * Compara un partido existente con los valores del formulario.
 * Retorna true si hubo alguna modificación.
 */
export const isPartidoUpdated = (partido: Partido, formData: FormData): boolean => {
  const idTorneo = Number(formData.get("idtorneo")) || 0;
  const idEquipoLocal = Number(formData.get("idequipolocal")) || 0;
  const idEquipoVisitante = Number(formData.get("idequipovisitante")) || 0;
  const marcadorLocal = Number(formData.get("marcadorequipolocal")) || 0;
  const marcadorVisitante = Number(formData.get("marcadorequipovisitante")) || 0;
  const fechaStr = (formData.get("fechapartido") as string)?.trim() ?? "";
  const fechaIso = fechaStr ? new Date(fechaStr).toISOString() : "";

  const cambiosDetectados =
    idTorneo !== partido.idtorneo ||
    idEquipoLocal !== partido.idequipolocal ||
    idEquipoVisitante !== partido.idequipovisitante ||
    marcadorLocal !== partido.marcadorequipolocal ||
    marcadorVisitante !== partido.marcadorequipovisitante ||
    fechaIso !== new Date(partido.fechapartido).toISOString();

  return cambiosDetectados;
};

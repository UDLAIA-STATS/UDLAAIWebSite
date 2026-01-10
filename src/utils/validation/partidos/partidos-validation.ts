import type { Partido } from "@interfaces/torneos.interface";
import { setFieldError, clearFieldError } from "@utils/validation/validation-utils";

export const validatePartidos = (formData: FormData): boolean => {
  const idTorneo = formData.get("idtorneo")?.toString().trim() ?? "";
  const idEquipoLocal = formData.get("idequipolocal")?.toString().trim() ?? "";
  const idEquipoVisitante =
    formData.get("idequipovisitante")?.toString().trim() ?? "";
  const marcadorLocal =
    formData.get("marcadorequipolocal")?.toString().trim() ?? "";
  const marcadorVisitante =
    formData.get("marcadorequipovisitante")?.toString().trim() ?? "";
  const fechaPartido = formData.get("fechapartido")?.toString().trim() ?? "";

  // limpiar errores previos
  clearFieldError("idtorneo");
  clearFieldError("idequipolocal");
  clearFieldError("idequipovisitante");
  clearFieldError("marcadorequipolocal");
  clearFieldError("marcadorequipovisitante");
  clearFieldError("fechapartido");

  let hasErrors = false;

  if (idTorneo === "" || idTorneo === "Selecciona un torneo") {
    setFieldError("idtorneo", "Debe seleccionar un torneo.");
    hasErrors = true;
  }

  if (idEquipoLocal === "") {
    setFieldError("idequipolocal", "Debe seleccionar un equipo local.");
    hasErrors = true;
  } else if (idEquipoVisitante === "") {
    setFieldError("idequipovisitante", "Debe seleccionar un equipo visitante.");
    hasErrors = true;
  }

  if (marcadorLocal === "") {
    setFieldError(
      "marcadorequipolocal",
      "El marcador del equipo local es obligatorio.",
    );
    hasErrors = true;
  }

  if (marcadorVisitante === "") {
    setFieldError(
      "marcadorequipovisitante",
      "El marcador del equipo visitante es obligatorio.",
    );
    hasErrors = true;
  }

  if (fechaPartido === "") {
    setFieldError("fechapartido", "La fecha del partido es obligatoria.");
    hasErrors = true;
  } else if (isNaN(new Date(fechaPartido).getTime())) {
    setFieldError("fechapartido", "La fecha del partido no es válida.");
    hasErrors = true;
  }

  return hasErrors;
};

/**
 * Compara un partido existente con los valores del formulario.
 * Retorna true si hubo alguna modificación.
 */
export const isPartidoUpdated = (
  partido: Partido,
  formData: FormData,
): boolean => {
  const idTorneo = Number(formData.get("idtorneo")) || 0;
  const idEquipoLocal = Number(formData.get("idequipolocal")) || 0;
  const idEquipoVisitante = Number(formData.get("idequipovisitante")) || 0;
  const marcadorLocal = Number(formData.get("marcadorequipolocal")) || 0;
  const marcadorVisitante =
    Number(formData.get("marcadorequipovisitante")) || 0;
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

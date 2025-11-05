import type { Torneo } from "@interfaces/index";

export const validateTorneo = (formData: FormData): string => {
  const nombreTorneo = (formData.get("nombretorneo") as string)?.trim() ?? "";
  const descripcionTorneo =
    (formData.get("descripciontorneo") as string)?.trim() ?? "";
  const idTemporada = (formData.get("idtemporada") as string)?.trim() ?? "";
  const fechaInicioStr = (formData.get("fechainiciotorneo") as string)?.trim() ?? "";
  const fechaFinStr = (formData.get("fechafintorneo") as string)?.trim() ?? "";
  const torneoActivoStr = (formData.get("torneoactivo") as string)?.trim() ?? "";

  const fechaInicio = fechaInicioStr ? new Date(fechaInicioStr) : null;
  const fechaFin = fechaFinStr ? new Date(fechaFinStr) : null;

  const torneoActivo =
    torneoActivoStr === "true" || torneoActivoStr === "false"
      ? torneoActivoStr
      : "";

  const validationsErrors: Record<string, string> = {
    nombreTorneo:
      nombreTorneo.length === 0
        ? "El nombre del torneo es obligatorio."
        : nombreTorneo.length < 5
          ? "El nombre del torneo es muy corto (mínimo 5 caracteres)."
          : nombreTorneo.length > 100
            ? "El nombre del torneo no puede superar los 100 caracteres."
            : "",
    descripcionTorneo:
      descripcionTorneo.length === 0
        ? "La descripción del torneo es obligatoria."
        : descripcionTorneo.length < 10
          ? "La descripción del torneo es muy corta (mínimo 10 caracteres)."
          : descripcionTorneo.length > 250
            ? "La descripción del torneo no puede superar los 250 caracteres."
            : "",
    idTemporada:
      idTemporada.length === 0 || idTemporada === "Selecciona una temporada"
        ? "Debe seleccionar una temporada."
        : "",
    fechaInicio:
      !fechaInicioStr
        ? "La fecha de inicio del torneo es obligatoria."
        : "",
    fechaFin:
      !fechaFinStr
        ? "La fecha de fin del torneo es obligatoria."
        : "",
    fechasInvalidas:
      fechaInicio && fechaFin && fechaFin < fechaInicio
        ? "La fecha de fin no puede ser anterior a la fecha de inicio."
        : fechaInicio && fechaFin && fechaFin.getTime() === fechaInicio.getTime()
          ? "La fecha de inicio y fin no pueden ser iguales."
          : "",
    torneoActivo:
      torneoActivo === ""
        ? "Debe indicar si el torneo estará activo o no."
        : ""
  };

  const errorMessages = Object.values(validationsErrors).filter(Boolean);
  return errorMessages.length > 0 ? errorMessages.join("<br/>") : "";
};

/**
 * Compara un torneo existente con los valores del formulario.
 * Retorna true si hubo alguna modificación.
 */
export const isTorneoUpdated = (torneo: Torneo, formData: FormData): boolean => {
  const nombreTorneo = (formData.get("nombretorneo") as string)?.trim() ?? "";
  const descripcionTorneo = (formData.get("descripciontorneo") as string)?.trim() ?? "";
  const idTemporada = Number(formData.get("idtemporada")) || 0;
  const fechaInicioStr = (formData.get("fechainiciotorneo") as string)?.trim() ?? "";
  const fechaFinStr = (formData.get("fechafintorneo") as string)?.trim() ?? "";
  const torneoActivo =
    (formData.get("torneoactivo") as string) === "true" ||
    (formData.get("torneoactivo") as string) === "on";

  const fechaInicioIso = fechaInicioStr ? new Date(fechaInicioStr).toISOString() : "";
  const fechaFinIso = fechaFinStr ? new Date(fechaFinStr).toISOString() : "";

  const cambiosDetectados =
    nombreTorneo !== torneo.nombretorneo ||
    descripcionTorneo !== torneo.descripciontorneo ||
    idTemporada !== torneo.idtemporada ||
    fechaInicioIso !== new Date(torneo.fechainiciotorneo).toISOString() ||
    fechaFinIso !== new Date(torneo.fechafintorneo).toISOString() ||
    torneoActivo !== Boolean(torneo.torneoactivo);

  return cambiosDetectados;
};

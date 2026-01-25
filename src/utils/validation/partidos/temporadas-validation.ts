import type { Temporada } from "@interfaces/index";
import {
  setFieldError,
  clearFieldError,
} from "@utils/validation/validation-utils";

export const validateTemporadas = (formData: FormData): boolean => {
  // Extraer valores del formulario
  const nombreTemporada =
    (formData.get("nombretemporada") as string)?.trim() ?? "";
  const descripcionTemporada =
    (formData.get("descripciontemporada") as string)?.trim() ?? "";
  const tipoTemporada = (formData.get("tipotemporada") as string)?.trim() ?? "";
  const fechaInicio =
    (formData.get("fechainiciotemporada") as string)?.trim() ?? "";
  const fechaFin = (formData.get("fechafintemporada") as string)?.trim() ?? "";
  const temporadaActiva =
    (formData.get("temporadaactiva") as string)?.trim() ?? "";

  // limpiar errores previos
  clearFieldError("nombretemporada");
  clearFieldError("descripciontemporada");
  clearFieldError("tipotemporada");
  clearFieldError("fechainiciotemporada");
  clearFieldError("fechafintemporada");
  clearFieldError("idtorneo");
  clearFieldError("temporadaactiva");

  // Validaciones individuales
  let hasErrors = false;

  if (nombreTemporada.length === 0) {
    setFieldError(
      "nombretemporada",
      "El nombre de la temporada es obligatorio.",
    );
    hasErrors = true;
  } else if (nombreTemporada.length < 5) {
    setFieldError(
      "nombretemporada",
      "El nombre de la temporada es muy corto (mínimo 5 caracteres).",
    );
    hasErrors = true;
  } else {
    clearFieldError("nombretemporada");
  }

  if (descripcionTemporada.length === 0) {
    setFieldError(
      "descripciontemporada",
      "La descripción de la temporada es obligatoria.",
    );
    hasErrors = true;
  } else if (descripcionTemporada.length < 10) {
    setFieldError(
      "descripciontemporada",
      "La descripción de la temporada es muy corta (mínimo 10 caracteres).",
    );
    hasErrors = true;
  } else {
    clearFieldError("descripciontemporada");
  }

  if (tipoTemporada.length === 0) {
    setFieldError("tipotemporada", "El tipo de temporada es obligatorio.");
    hasErrors = true;
  } else if (!["oficial", "amistosa"].includes(tipoTemporada.toLowerCase())) {
    setFieldError("tipotemporada", "Tipo de temporada inválido.");
    hasErrors = true;
  } else {
    clearFieldError("tipotemporada");
  }

  if (fechaInicio.length === 0) {
    setFieldError("fechainiciotemporada", "La fecha de inicio es obligatoria.");
    hasErrors = true;
  } else {
    clearFieldError("fechainiciotemporada");
  }

  if (fechaFin.length === 0) {
    setFieldError("fechafintemporada", "La fecha de fin es obligatoria.");
    hasErrors = true;
  } else {
    clearFieldError("fechafintemporada");
  }

  if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
    setFieldError(
      "fechafintemporada",
      "La fecha de fin no puede ser anterior a la fecha de inicio.",
    );
    hasErrors = true;
  }

  if (temporadaActiva.length === 0) {
    setFieldError(
      "temporadaactiva",
      "Debe indicar si la temporada está activa o no.",
    );
    hasErrors = true;
  } else {
    clearFieldError("temporadaactiva");
  }

  return hasErrors;
};

export const isTemporadaUpdated = (
  temporada: Temporada,
  formData: FormData,
): boolean => {
  // Extraer valores del formulario con normalización
  const nombreTemporada =
    (formData.get("nombretemporada") as string)?.trim() ?? "";
  const descripcionTemporada =
    (formData.get("descripciontemporada") as string)?.trim() ?? "";
  const tipoTemporadaRaw =
    (formData.get("tipotemporada") as string)?.trim() ?? "";
  const tipoTemporada =
    tipoTemporadaRaw.charAt(0).toUpperCase() +
    tipoTemporadaRaw.slice(1).toLowerCase();

  const fechaInicio =
    (formData.get("fechainiciotemporada") as string)?.trim() ?? "";
  const fechaFin = (formData.get("fechafintemporada") as string)?.trim() ?? "";
  const temporadaActiva =
    (formData.get("temporadaactiva") as string) === "true" ||
    (formData.get("temporadaactiva") as string) === "on";

  // Normalización de fechas para evitar diferencias por formato
  const fechaInicioIso = fechaInicio ? new Date(fechaInicio).toISOString() : "";
  const fechaFinIso = fechaFin ? new Date(fechaFin).toISOString() : "";

  // Comparaciones campo por campo
  const cambiosDetectados =
    nombreTemporada !== temporada.nombretemporada ||
    descripcionTemporada !== temporada.descripciontemporada ||
    tipoTemporada !== temporada.tipotemporada ||
    fechaInicioIso !== new Date(temporada.fechainiciotemporada).toISOString() ||
    fechaFinIso !== new Date(temporada.fechafintemporada).toISOString() ||
    temporadaActiva !== Boolean(temporada.temporadaactiva);

  return cambiosDetectados;
};

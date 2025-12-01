import type { Temporada } from "@interfaces/torneos.interface";

export const validateTemporadas = (formData: FormData): string => {
  // Extraer valores del formulario
  const nombreTemporada =
    (formData.get("nombretemporada") as string)?.trim() ?? "";
  const descripcionTemporada =
    (formData.get("descripciontemporada") as string)?.trim() ?? "";
  const tipoTemporada = (formData.get("tipotemporada") as string)?.trim() ?? "";
  const fechaInicio =
    (formData.get("fechainiciotemporada") as string)?.trim() ?? "";
  const fechaFin = (formData.get("fechafintemporada") as string)?.trim() ?? "";
  const torneo = (formData.get("idtorneo") as string)?.trim() ?? "";
  const temporadaActiva =
    (formData.get("temporadaactiva") as string)?.trim() ?? "";

  // Validaciones individuales
  const validationsErrors: Record<string, string> = {
    nombreTemporada:
      nombreTemporada.length === 0
        ? "El nombre de la temporada es obligatorio."
        : nombreTemporada.length < 5
          ? "El nombre de la temporada es muy corto (mínimo 5 caracteres)."
          : "",
    descripcionTemporada:
      descripcionTemporada.length === 0
        ? "La descripción de la temporada es obligatoria."
        : descripcionTemporada.length < 10
          ? "La descripción de la temporada es muy corta (mínimo 10 caracteres)."
          : "",
    tipoTemporada:
      tipoTemporada.length === 0
        ? "El tipo de temporada es obligatorio."
        : !["oficial", "amistosa"].includes(tipoTemporada.toLowerCase())
          ? "Tipo de temporada inválido."
          : "",
    fechaInicio:
      fechaInicio.length === 0 ? "La fecha de inicio es obligatoria." : "",
    fechaFin: fechaFin.length === 0 ? "La fecha de fin es obligatoria." : "",
    fechasInvalidas:
      fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)
        ? "La fecha de fin no puede ser anterior a la fecha de inicio."
        : "",
    temporadaActiva:
      temporadaActiva.length === 0
        ? "Debe indicar si la temporada está activa o no."
        : "",
  };

  // Filtrar errores no vacíos
  const errorMessages = Object.values(validationsErrors).filter(
    (msg) => msg !== ""
  );

  // Retornar errores concatenados
  return errorMessages.length > 0 ? errorMessages.join("<br/>") : "";
};

/**
 * Compara una temporada existente con los valores actuales del formulario.
 * Retorna true si hubo alguna modificación.
 */
export const isTemporadaUpdated = (
  temporada: Temporada,
  formData: FormData
): boolean => {
  // Extraer valores del formulario con normalización
  const nombreTemporada = (formData.get("nombretemporada") as string)?.trim() ?? "";
  const descripcionTemporada = (formData.get("descripciontemporada") as string)?.trim() ?? "";
  const tipoTemporadaRaw = (formData.get("tipotemporada") as string)?.trim() ?? "";
  const tipoTemporada =
    tipoTemporadaRaw.charAt(0).toUpperCase() + tipoTemporadaRaw.slice(1).toLowerCase();

  const fechaInicio = (formData.get("fechainiciotemporada") as string)?.trim() ?? "";
  const fechaFin = (formData.get("fechafintemporada") as string)?.trim() ?? "";
  const temporadaActiva = (formData.get("temporadaactiva") as string) === "true" ||
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


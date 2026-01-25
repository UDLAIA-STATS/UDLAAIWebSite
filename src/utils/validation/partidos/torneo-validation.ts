import type { Torneo } from "@interfaces/index";
import { actions } from "astro:actions";
import {
  setFieldError,
  clearFieldError,
} from "@utils/validation/validation-utils";

export const validateTorneo = (formData: FormData): boolean => {
  const nombreTorneo = (formData.get("nombretorneo") as string)?.trim() ?? "";
  const descripcionTorneo =
    (formData.get("descripciontorneo") as string)?.trim() ?? "";
  const idTemporada = (formData.get("idtemporada") as string)?.trim() ?? "";
  const fechaInicioStr =
    (formData.get("fechainiciotorneo") as string)?.trim() ?? "";
  const fechaFinStr = (formData.get("fechafintorneo") as string)?.trim() ?? "";
  const torneoActivoStr =
    (formData.get("torneoactivo") as string)?.trim() ?? "";

  clearFieldError("nombretorneo");
  clearFieldError("descripciontorneo");
  clearFieldError("idtemporada");
  clearFieldError("fechainiciotorneo");
  clearFieldError("fechafintorneo");
  clearFieldError("torneoactivo");

  const torneoActivo =
    torneoActivoStr === "true" || torneoActivoStr === "false"
      ? torneoActivoStr
      : "";

  let hasErrors = false;

  if (nombreTorneo.length === 0) {
    setFieldError("nombretorneo", "El nombre del torneo es obligatorio.");
    hasErrors = true;
  }

  if (descripcionTorneo.length === 0) {
    setFieldError(
      "descripciontorneo",
      "La descripción del torneo es obligatoria.",
    );
    hasErrors = true;
  }

  if (idTemporada.length === 0 || idTemporada === "Selecciona una temporada") {
    setFieldError("idtemporada", "Debe seleccionar una temporada.");
    hasErrors = true;
  }

  if (!fechaInicioStr) {
    setFieldError(
      "fechainiciotorneo",
      "La fecha de inicio del torneo es obligatoria.",
    );
    hasErrors = true;
  }

  if (!fechaFinStr) {
    setFieldError(
      "fechafintorneo",
      "La fecha de fin del torneo es obligatoria.",
    );
    hasErrors = true;
  }

  if (torneoActivo === "") {
    setFieldError(
      "torneoactivo",
      "Debe indicar si el torneo estará activo o no.",
    );
    hasErrors = true;
  }

  return hasErrors;
};

/**
 * Compara un torneo existente con los valores del formulario.
 * Retorna true si hubo alguna modificación.
 */
export const isTorneoUpdated = (
  torneo: Torneo,
  formData: FormData,
): boolean => {
  const nombreTorneo = (formData.get("nombretorneo") as string)?.trim() ?? "";
  const descripcionTorneo =
    (formData.get("descripciontorneo") as string)?.trim() ?? "";
  const idTemporada = Number(formData.get("idtemporada")) || 0;
  const fechaInicioStr =
    (formData.get("fechainiciotorneo") as string)?.trim() ?? "";
  const fechaFinStr = (formData.get("fechafintorneo") as string)?.trim() ?? "";
  const torneoActivo =
    (formData.get("torneoactivo") as string) === "true" ||
    (formData.get("torneoactivo") as string) === "on";

  const fechaInicioIso = fechaInicioStr
    ? new Date(fechaInicioStr).toISOString()
    : "";
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

export const setLimitDatesTorneo = async (temporalidadId: number) => {
  const data = await actions.getTemporadaById.orThrow({
    id: Number(temporalidadId),
  });
  const temporada = data.data;
  const fechaInicioInput = document.getElementById(
    "fechainiciotorneo",
  ) as HTMLInputElement;
  const fechaFinInput = document.getElementById(
    "fechafintorneo",
  ) as HTMLInputElement;

  fechaInicioInput.value = temporada.fechainiciotemporada.split("T")[0];
  fechaInicioInput.min = temporada.fechainiciotemporada.split("T")[0];
  fechaInicioInput.max = temporada.fechafintemporada.split("T")[0];
  fechaFinInput.value = temporada.fechafintemporada.split("T")[0];
  fechaFinInput.min = temporada.fechainiciotemporada.split("T")[0];
  fechaFinInput.max = temporada.fechafintemporada.split("T")[0];
};

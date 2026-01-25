import type { Equipo } from "@interfaces/torneos.interface";
import {
  setFieldError,
  clearFieldError,
} from "@utils/validation/validation-utils";

export const validateEquipos = (formData: FormData): boolean => {
  const nombre = (formData.get("nombreequipo") as string)?.trim() ?? "";
  const idInstitucion = (formData.get("idinstitucion") as string)?.trim() ?? "";
  const equipoActivo = (formData.get("equipoactivo") as string)?.trim() ?? "";
  const logo = formData.get("imagenequipo") as File | null;

  // limpiar errores previos
  clearFieldError("nombreequipo");
  clearFieldError("idinstitucion");
  clearFieldError("equipoactivo");
  clearFieldError("imagenequipo");

  let hasErrors = false;

  if (nombre.length === 0) {
    setFieldError("nombreequipo", "El nombre del equipo es obligatorio.");
    hasErrors = true;
  }

  if (idInstitucion.length === 0) {
    setFieldError("idinstitucion", "Debe seleccionar una institución.");
    hasErrors = true;
  }

  if (equipoActivo !== "true" && equipoActivo !== "false") {
    setFieldError(
      "equipoactivo",
      "Debe indicar si el equipo está activo o no.",
    );
    hasErrors = true;
  }

  if (logo && logo.size > 0 && !logo.type.startsWith("image/")) {
    setFieldError(
      "imagenequipo",
      "El logo debe ser una imagen válida (PNG, JPG, etc.).",
    );
    hasErrors = true;
  }

  return hasErrors;
};

/**
 * Compara un equipo existente con los valores del formulario.
 * Retorna true si hubo alguna modificación.
 */
export const isEquipoUpdated = (
  equipo: Equipo,
  formData: FormData,
): boolean => {
  const nombreEquipo = (formData.get("nombreequipo") as string)?.trim() ?? "";
  const idInstitucion = Number(formData.get("idinstitucion")) || 0;
  const equipoActivo =
    (formData.get("equipoactivo") as string) === "true" ||
    (formData.get("equipoactivo") as string) === "on";
  const logo = formData.get("imagenequipo") as File | null;

  const cargoLogo = (logo && logo.size > 0) ?? false;

  const cambiosDetectados =
    nombreEquipo !== equipo.nombreequipo ||
    idInstitucion !== equipo.idinstitucion ||
    equipoActivo !== Boolean(equipo.equipoactivo) ||
    cargoLogo;

  return cambiosDetectados;
};

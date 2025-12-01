import type { Equipo } from "@interfaces/torneos.interface";

export const validateEquipos = (formData: FormData): string => {
  const nombre = (formData.get("nombreequipo") as string)?.trim() ?? "";
  const idInstitucion = (formData.get("idinstitucion") as string)?.trim() ?? "";
  const equipoActivo = (formData.get("equipoactivo") as string)?.trim() ?? "";
  const logo = formData.get("imagenequipo") as File | null;

  const validations: Record<string, string> = {
    nombre:
      nombre.length === 0
        ? "El nombre del equipo es obligatorio."
        : nombre.length < 5
          ? "El nombre del equipo es muy corto (mínimo 5 caracteres)."
          : nombre.length > 100
            ? "El nombre del equipo es demasiado largo (máximo 100 caracteres)."
            : "",
    idInstitucion:
      idInstitucion.length === 0
        ? "Debe seleccionar una institución."
        : "",
    equipoActivo:
      equipoActivo !== "true" && equipoActivo !== "false"
        ? "Debe indicar si el equipo está activo o no."
        : "",
    logo:
      logo && logo.size > 0 && !logo.type.startsWith("image/")
        ? "El logo debe ser una imagen válida (PNG, JPG, etc.)."
        : "",
  };

  const errorMessages = Object.values(validations).filter(Boolean);
  return errorMessages.length > 0 ? errorMessages.join("<br/>") : "";
};

/**
 * Compara un equipo existente con los valores del formulario.
 * Retorna true si hubo alguna modificación.
 */
export const isEquipoUpdated = (equipo: Equipo, formData: FormData): boolean => {
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

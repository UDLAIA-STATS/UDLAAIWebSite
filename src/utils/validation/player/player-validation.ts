import type { Player } from "@interfaces/index";
import {
  setFieldError,
  clearFieldError,
} from "@utils/validation/validation-utils";

export const validateJugador = (formData: FormData) => {
  const idbanner = formData.get("idbanner")?.toString().trim() ?? "";
  const nombre = formData.get("nombrejugador")?.toString().trim() ?? "";
  const apellido = formData.get("apellidojugador")?.toString().trim() ?? "";
  const posicion = formData.get("posicionjugador")?.toString().trim() ?? "";
  const numero = Number(formData.get("numerocamisetajugador")) || 0;
  const activo = formData.get("jugadoractivo")?.toString().trim() ?? "";

  // limpiar errores previos
  clearFieldError("idbanner");
  clearFieldError("nombrejugador");
  clearFieldError("apellidojugador");
  clearFieldError("posicionjugador");
  clearFieldError("numerocamisetajugador");
  clearFieldError("jugadoractivo");

  // Expresión regular: 1 letra seguida de 8 dígitos (A00088850)
  const idBannerRegex = new RegExp(/^[A-Za-z]\d{8}$/);

  let hasErrors = false;

  if (nombre.length === 0) {
    setFieldError("nombrejugador", "El nombre del jugador es obligatorio.");
    hasErrors = true;
  }
  if (apellido.length === 0) {
    setFieldError("apellidojugador", "El apellido del jugador es obligatorio.");
    hasErrors = true;
  }
  if (idbanner.length === 0) {
    setFieldError("idbanner", "El ID Banner es obligatorio.");
    hasErrors = true;
  } else if (!idBannerRegex.test(idbanner)) {
    setFieldError("idbanner", "El ID Banner debe tener el formato A00088850.");
    hasErrors = true;
  }
  if (posicion.length === 0) {
    setFieldError("posicionjugador", "La posición del jugador es obligatoria.");
    hasErrors = true;
  }
  if (numero === 0) {
    setFieldError(
      "numerocamisetajugador",
      "El número del jugador es obligatorio.",
    );
    hasErrors = true;
  }
  if (activo.length === 0) {
    setFieldError("jugadoractivo", "El estado del jugador es obligatorio.");
    hasErrors = true;
  }

  return hasErrors;
};

export const isJugadorUpdated = (
  jugador: Player,
  formData: FormData,
): boolean => {
  const idbanner = formData.get("idbanner")?.toString().trim() ?? "";
  const nombre = formData.get("nombrejugador")?.toString().trim() ?? "";
  const apellido = formData.get("apellidojugador")?.toString().trim() ?? "";
  const posicion = formData.get("posicionjugador")?.toString().trim() ?? "";
  const numero = Number(formData.get("numerocamisetajugador")) || 0;
  const activo = formData.get("jugadoractivo")?.toString().trim() ?? "";
  const activoBool = activo === "true" || activo === "on";
  const imagenjugador = formData.get("imagenjugador")?.toString().trim() ?? "";
  return (
    idbanner !== jugador.idbanner ||
    nombre !== jugador.nombrejugador ||
    apellido !== jugador.apellidojugador ||
    posicion !== jugador.posicionjugador ||
    numero !== jugador.numerocamisetajugador ||
    imagenjugador !== (jugador.imagenjugador ?? "") ||
    activoBool !== jugador.jugadoractivo
  );
};

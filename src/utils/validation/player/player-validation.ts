import type { Player } from "@interfaces/index";

export const validateJugador = (formData: FormData) => {
  const idbanner = (formData.get("idbanner")?.toString().trim()) ?? "";
  const nombre = (formData.get("nombrejugador")?.toString().trim()) ?? "";
  const apellido = (formData.get("apellidojugador")?.toString().trim()) ?? "";
  const posicion = (formData.get("posicionjugador")?.toString().trim()) ?? "";
  const numero = Number(formData.get("numerocamisetajugador")) || 0;
  const activo = (formData.get("jugadoractivo")?.toString().trim()) ?? "";
  const imagenjugador = formData.get("imagenjugador") as File | null;

  // Expresión regular: 1 letra seguida de 8 dígitos (A00088850)
  const idBannerRegex = new RegExp(/^[A-Za-z]\d{8}$/);

  const validations = {
    idbanner:
      idbanner.length !== 9
        ? "El ID Banner debe tener exactamente 9 caracteres."
        : !idBannerRegex.test(idbanner)
          ? "El ID Banner debe comenzar con una letra seguida de 8 números (ejemplo: A00088850)."
          : "",
    nombre:
      nombre.length === 0
        ? "El nombre es obligatorio."
        : nombre.length < 2
          ? "El nombre es muy corto (mínimo 2 caracteres)."
          : nombre.length > 100
            ? "El nombre es demasiado largo (máximo 100 caracteres)."
            : "",
    apellido:
      apellido.length === 0
        ? "El apellido es obligatorio."
        : apellido.length < 2
          ? "El apellido es muy corto (mínimo 2 caracteres)."
          : apellido.length > 100
            ? "El apellido es demasiado largo (máximo 100 caracteres)."
            : "",
    numero:
      numero <= 0
        ? "Debe ingresar un número de camiseta válido."
        : numero > 99
          ? "El número de camiseta no puede superar 99."
          : "",
    posicion:
      !["Delantero", "Mediocampista", "Defensa", "Portero"].includes(posicion)
        ? "Debe seleccionar una posición válida."
        : "",
    activo:
      activo !== "true" && activo !== "false"
        ? "Debe indicar si el jugador está activo o no."
        : "",
    imagenjugador:
      imagenjugador && imagenjugador.size > 2 * 1024 * 1024
        ? "La imagen del jugador no debe superar los 2MB."
        : "",
    imagejugadorTipo: 
      imagenjugador && imagenjugador.size > 0 && !imagenjugador.type.startsWith("image/")
        ? "El archivo seleccionado debe ser una imagen."
        : "",
    imagenVacia:
      !imagenjugador || imagenjugador.size === 0
        ? "La imagen del jugador es obligatoria."
        : "",
  };

  const errors = Object.values(validations).filter(Boolean);
  return errors.length > 0 ? errors.join("<br/>") : "";
};

  export const isJugadorUpdated = (jugador: Player, formData: FormData): boolean => {
    const idbanner = (formData.get("idbanner")?.toString().trim()) ?? "";
    const nombre = (formData.get("nombrejugador")?.toString().trim()) ?? "";
    const apellido = (formData.get("apellidojugador")?.toString().trim()) ?? "";
    const posicion = (formData.get("posicionjugador")?.toString().trim()) ?? "";
    const numero = Number(formData.get("numerocamisetajugador")) || 0;
    const activo = (formData.get("jugadoractivo")?.toString().trim()) ?? "";
    const activoBool = activo === "true" || activo === "on";
    const imagenjugador = (formData.get("imagenjugador")?.toString().trim()) ?? "";
    return (
      idbanner !== jugador.idbanner ||
      nombre !== jugador.nombrejugador ||
      apellido !== jugador.apellidojugador ||
      posicion !== jugador.posicionjugador ||
      numero !== jugador.numerocamisetajugador ||
      imagenjugador !== (jugador.imagenjugador ?? "") ||
      activoBool !== jugador.jugadoractivo);
  };
import type { Player } from "@interfaces/index";

export const validateJugador = (formData: FormData) => {
  const idbanner = (formData.get("idbanner")?.toString().trim()) ?? "";
  const nombre = (formData.get("nombrejugador")?.toString().trim()) ?? "";
  const apellido = (formData.get("apellidojugador")?.toString().trim()) ?? "";
  const posicion = (formData.get("posicionjugador")?.toString().trim()) ?? "";
  const numero = Number(formData.get("numerocamisetajugador")) || 0;
  const activo = (formData.get("jugadoractivo")?.toString().trim()) ?? "";
  const imagenjugador = formData.get("imagenjugador") as File | null;
  
  console.log("Apellido:", apellido);
  console.log("Número:", numero);
  console.log("Posición:", posicion);
  console.log("Estado:", activo);
  

  // Expresión regular: 1 letra seguida de 8 dígitos (A00088850)
  const idBannerRegex = new RegExp(/^[A-Za-z]\d{8}$/);

  const validations = {
    nombreVacio: nombre.length === 0 ? "El nombre del jugador es obligatorio." : "",
    apellidoVacio: apellido.length === 0 ? "El apellido del jugador es obligatorio." : "",
    idbannerVacio: idbanner.length === 0 ? "El ID Banner es obligatorio." : "",
    idbannerFormato: !idBannerRegex.test(idbanner) ? "El ID Banner debe tener el formato A00088850." : "",
    posicionVacio: posicion.length === 0 ? "La posición del jugador es obligatoria." : "",
    numeroVacio: numero === 0 ? "El número del jugador es obligatorio." : "",
    activoVacio: activo.length === 0 ? "El estado del jugador es obligatorio." : "",
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
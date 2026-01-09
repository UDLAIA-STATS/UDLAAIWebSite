export const jugadorSerializer = (error: any) => {
  if (!error) {
    return "";
  }
  const messages: string[] = [
    ...(error.idbanner ? error.idbanner : ""),
    ...(error.nombrejugador ? error.nombrejugador : ""),
    ...(error.apellidojugador ? error.apellidojugador : ""),
    ...(error.posicionjugador ? error.posicionjugador : ""),
    ...(error.numerocamisetajugador ? error.numerocamisetajugador : ""),
    ...(error.imagenjugador ? error.imagenjugador : ""),
    ...(error.jugadoractivo ? error.jugadoractivo : ""),
    ...(error.non_field_errors ? error.non_field_errors : ""),
  ];
  console.log("Jugador Serializer Messages:", messages);
  return messages.join("");
};

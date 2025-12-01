export const equipoSerializer = (error: any) => {
  if (!error) {
    return "";
  }
  const messages: string[] = [
    ...(error.idinstitucion ? error.idinstitucion : ""),
    ...(error.nombreequipo ? error.nombreequipo : ""),
    ...(error.imagenequipo ? error.imagenequipo : ""),
    ...(error.equipoactivo ? error.equipoactivo : ""),
    ...(error.non_field_errors ? error.non_field_errors : ""),
  ];
  return messages.join("\n");
};

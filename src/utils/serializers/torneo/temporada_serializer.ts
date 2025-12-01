export const temporadaSerializer = (error: any) => {
  if (!error) {
    return "";
  }
  const messages: string[] = [
    ...(error.nombretemporada ? error.nombretemporada : ""),
    ...(error.descripciontemporada ? error.descripciontemporada : ""),
    ...(error.tipotemporada ? error.tipotemporada : ""),
    ...(error.fechainiciotemporada ? error.fechainiciotemporada : ""),
    ...(error.fechafintemporada ? error.fechafintemporada : ""),
    ...(error.temporadaactiva ? error.temporadaactiva : ""),
    ...(error.non_field_errors ? error.non_field_errors : ""),
  ];
  return messages.join("\n");
};

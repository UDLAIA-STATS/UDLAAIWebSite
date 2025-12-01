export const torneoSerializer = (error: any) => {
  if (!error) {
    return "";
  }

  const messages: string[] = [
    ...(error.nombretorneo ? error.nombretorneo : ""),
    ...(error.descripciontorneo ? error.descripciontorneo : ""),
    ...(error.fechainiciotorneo ? error.fechainiciotorneo : ""),
    ...(error.fechafintorneo ? error.fechafintorneo : ""),
    ...(error.torneoactivo ? error.torneoactivo : ""),
    ...(error.non_field_errors ? error.non_field_errors : ""),
  ];
  return messages.join("\n");
};

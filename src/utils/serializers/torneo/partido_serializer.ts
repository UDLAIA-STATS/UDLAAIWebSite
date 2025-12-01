export const partidoSerializer = (error: any) => {
  if (!error) {
    return "";
  }
    const messages: string[] = [
    ...(error.fechapartido ? error.fechapartido : ""),
    ...(error.marcadorequipolocal ? error.marcadorequipolocal : ""),
    ...(error.marcadorequipovisitante ? error.marcadorequipovisitante : ""),
    ...(error.partidosubido ? error.partidosubido : ""),
    ...(error.non_field_errors ? error.non_field_errors : ""),
  ];
  return messages.join("\n");
};
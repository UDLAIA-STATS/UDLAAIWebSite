export const jugadorSerializer = (error: any) => {
  if (!error) {
    return "";
  }
  const messages: string[] = [
    ...(error.nombre_usuario ? error.nombre_usuario : "" ),
    ...(error.email_usuario ? error.email_usuario : "" ),
    ...(error.rol ? error.rol : "" ),
    ...(error.is_active ? error.is_active : "" )
  ];

  return messages.join("\n");
}

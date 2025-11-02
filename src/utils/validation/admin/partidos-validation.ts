const validatePartidos = (formData: FormData): string => {
  const tipoPartido = formData.get("tipopartido")?.toString().trim() ?? "";
  const nombreTorneo = formData.get("idtorneo")?.toString().trim() ?? "";
  const nombreLocal = formData.get("idequipolocal")?.toString().trim() ?? "";
  const nombreVisitante =
    formData.get("idequipovisitante")?.toString().trim() ?? "";
  const marcadorLocal =
    formData.get("marcadorequipolocal")?.toString().trim() ?? "";
  const marcadorVisitante =
    formData.get("marcadorequipovisitante")?.toString().trim() ?? "";
  const date = formData.get("fechapartido")?.toString().trim() ?? "";
  const validationsErrors: Record<string, string> = {
    torneo:
      nombreLocal === "" || nombreVisitante === ""
        ? "Debe seleccionar un equipo local."
        : "",
    torneosIguales:
      nombreLocal !== "" &&
      nombreVisitante !== "" &&
      nombreLocal === nombreVisitante
        ? "El equipo local y el equipo visitante no pueden ser el mismo."
        : "",
    marcadorLocal:
      marcadorLocal === ""
        ? "El marcador del equipo local es obligatorio."
        : "",
    marcadorVisitante:
      marcadorVisitante === ""
        ? "El marcador del equipo visitante es obligatorio."
        : "",
    nombreTorneo:
      nombreTorneo === "" || nombreLocal === "Selecciona un torneo"
        ? "Seleccione un torneo."
        : "",
    fecha: date === "" ? "La fecha del partido es obligatoria." : "",
  };

  if (Object.values(validationsErrors).some((msg) => msg !== "")) {
    const errorMessages = Object.values(validationsErrors).filter(
      (msg) => msg !== ""
    );
    return errorMessages.join("<br/>");
  }
  return "";
};

export default validatePartidos;

const validateTemporadas = (formData: FormData): string => {
  const nombreTemporada =
    formData.get("nombretemporada")?.toString().trim() ?? "";
  const tipoTemporada = formData.get("tipotemporada")?.toString().trim() ?? "";
  const nombreTorneo = formData.get("idtorneo")?.toString().trim() ?? "";
  const validationsErrors: Record<string, string> = {
    nombreTemporada:
      nombreTemporada.length === 0
        ? "El nombre de la temporada es obligatorio."
        : "",
    tipoTemporada:
      tipoTemporada.length === 0 ? "El tipo de temporada es obligatorio." : "",
    nombreTorneo:
      nombreTorneo.length === 0 || nombreTorneo === "Selecciona un torneo"
        ? "El torneo es obligatorio."
        : "",
    nombreMuyCorto:
      nombreTemporada != "" && nombreTemporada.length < 5
        ? "El nombre de la temporada es muy corto."
        : "",
  };

  if (Object.values(validationsErrors).some((msg) => msg !== "")) {
    const errorMessages = Object.values(validationsErrors).filter(
      (msg) => msg !== ""
    );
    return errorMessages.join("<br/>");
  }
  return "";
};

export default validateTemporadas;

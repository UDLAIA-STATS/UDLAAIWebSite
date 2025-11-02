const validateTorneo = (formData: FormData): string => {
  const nombreTorneo = formData.get("nombretorneo")?.toString().trim() ?? "";
  const descripcionTorneo =
    formData.get("descripciontorneo")?.toString().trim() ?? "";
  const validaciones = {
    nombreMuyCorto:
      nombreTorneo != "" && nombreTorneo.length < 5
        ? "El nombre del torneo es muy corto"
        : "",
    nombreTorneoFaltante:
      nombreTorneo.length === 0 ? "El nombre del torneo es obligatorio" : "",
  };

  if (Object.values(validaciones).some((msg) => msg !== "")) {
    const errorMessages = Object.values(validaciones).filter(
      (msg) => msg !== ""
    );
    return errorMessages.join("<br/>");
  }
  return "";
};

export default validateTorneo;

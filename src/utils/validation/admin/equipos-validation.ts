const validateEquipos = (formData: FormData): string => {
  const nombre = formData.get("nombreequipo") as string;
  const validations: Record<string, string> = {
    nombre: nombre.trim().length === 0 ? "El nombre es obligatorio" : "",
    nombreMuyCorto:
      nombre.trim().length > 0 && nombre.trim().length < 5
        ? "El nombre es muy corto"
        : "",
  };
  if (Object.values(validations).some((msg) => msg !== "")) {
    const errorMessages = Object.values(validations).filter(
      (msg) => msg !== ""
    );
    return errorMessages.join("<br/>");
  }
  return "";
};

export default validateEquipos;

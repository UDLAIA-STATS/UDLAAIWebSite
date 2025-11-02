const validateLogin = (formData: FormData): string => {
  const username = formData.get("name")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";

  const validationErrors: Record<string, string> = {
    username:
      username.length === 0 && password.length > 0
        ? "El nombre de usuario es obligatorio."
        : "",
    password:
      password.length === 0 && username.length > 0
        ? "La contraseña es obligatoria."
        : "",
    emptyFields:
      username.length === 0 && password.length === 0
        ? "Por favor, complete todos los campos requeridos."
        : "",
  };

  if (Object.values(validationErrors).some((msg) => msg !== "")) {
    const errorMessages = Object.values(validationErrors).filter(
      (msg) => msg !== ""
    );
    return errorMessages.join("<br/>");
  }
  return "";
};

export default validateLogin;

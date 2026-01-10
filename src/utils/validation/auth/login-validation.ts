import { setFieldError, clearFieldError } from "@utils/validation/validation-utils";

const validateLogin = (formData: FormData): boolean => {
  const username = formData.get("name")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";

  // limpiar errores previos
  clearFieldError("name");
  clearFieldError("password");
  clearFieldError("form");

  let hasErrors = false;

  if (username.length === 0 && password.length > 0) {
    setFieldError("name", "El nombre de usuario es obligatorio.");
    hasErrors = true;
  }

  if (password.length === 0 && username.length > 0) {
    setFieldError("password", "La contraseña es obligatoria.");
    hasErrors = true;
  }

  if (username.length === 0 && password.length === 0) {
    // mensaje global del formulario (si existe un span con id 'form-error')
    setFieldError("form", "Por favor, complete todos los campos requeridos.");
    hasErrors = true;
  }

  return hasErrors;
};

export default validateLogin;

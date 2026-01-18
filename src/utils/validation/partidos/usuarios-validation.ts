import type { User } from "@interfaces/user.interface";
import { setFieldError, clearFieldError } from "@utils/validation/validation-utils";

export const validateUsers = (formData: FormData, isUpdate = false) => {
  const username = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";
  const rol = formData.get("rol")?.toString().trim() ?? "";

  // limpiar errores previos
  clearFieldError("name");
  clearFieldError("email");
  clearFieldError("password");
  clearFieldError("rol");

  let hasErrors = false;

  if (username.length === 0) {
    setFieldError("name", "El nombre de usuario es obligatorio.");
    hasErrors = true;
  } else {
    clearFieldError("name");
  }

  if (rol.length === 0) {
    setFieldError("rol", "El rol de usuario es obligatorio.");
    hasErrors = true;
  } else {
    clearFieldError("rol");
  }

  if (email.length === 0) {
    setFieldError("email", "El correo electrónico es obligatorio.");
    hasErrors = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError("email", "El correo electrónico no tiene un formato válido.");
    hasErrors = true;
  } else {
    clearFieldError("email");
  }

  if (!isUpdate && password.length === 0) {
    setFieldError("password", "La contraseña es obligatoria.");
    hasErrors = true;
  } else if (!isUpdate && password.length > 0 && password.length < 6) {
    setFieldError(
      "password",
      "La contraseña debe tener al menos 6 caracteres.",
    );
    hasErrors = true;
  } else {
    clearFieldError("password");
  }

  return hasErrors;
};

export const validateChanges = (formData: FormData, originalData: User) => {
  const newName = formData.get("name")?.toString().trim() ?? "";
  const newEmail = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const newRol = formData.get("rol")?.toString().trim() ?? "";
  const newPassword = formData.get("password")?.toString().trim() ?? "";
  const is_active = (formData.get("is_active")?.toString().trim() ?? "") === "true" ? true : false;

  if (newName === originalData.nombre_usuario && 
    newEmail === originalData.email_usuario && 
    newRol.trim() === originalData.rol.trim() && 
    is_active === originalData.is_active) {
      return "No se han realizado cambios. Modifique al menos un campo para continuar." 
    }

  return "";
};
import type { User } from "@interfaces/user.interface";
import { setFieldError, clearFieldError } from "@utils/validation/validation-utils";

export const validateUsers = (formData: FormData, isUpdate = false) => {
  const username = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";
  const rol = formData.get("rol")?.toString().trim() ?? "";
  const emailRegexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
  const usernameRegexp = new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/);
  const passwordRegexp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,50}$/);

  // limpiar errores previos
  clearFieldError("name");
  clearFieldError("email");
  clearFieldError("password");
  clearFieldError("rol");

  let hasErrors = false;

  if (!usernameRegexp.test(username)) {
    setFieldError(
      "name",
      "El nombre debe tener entre 3 y 100 caracteres y solo puede contener letras y espacios.",
    );
    hasErrors = true;
  } else {
    clearFieldError("name");
  }

  if (!emailRegexp.test(email)) {
    setFieldError("email", "Por favor, ingresa un correo electrónico válido.");
    hasErrors = true;
  } else {
    clearFieldError("email");
  }

  if (!passwordRegexp.test(password) && !isUpdate) {
    setFieldError(
      "password",
      "La contraseña debe tener entre 8 y 50 caracteres, al menos una letra y un número.",
    );
    hasErrors = true;
  } else {
    clearFieldError("password");
  }

  if (rol !== "superuser" && rol !== "profesor") {
    setFieldError("rol", "Por favor, selecciona un rol válido.");
    hasErrors = true;
  } else {
    clearFieldError("rol");
  }

  return hasErrors;
};

export const validateChanges = (formData: FormData, originalData: User) => {
  const newName = formData.get("name")?.toString().trim() ?? "";
  const newEmail = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const newRol = formData.get("rol")?.toString().trim() ?? "";
  const newPassword = formData.get("password")?.toString().trim() ?? "";
  const is_active =
    (formData.get("is_active")?.toString().trim() ?? "") === "true"
      ? true
      : false;

  // limpiar mensaje global previo
  clearFieldError("form");

  if (
    newName === originalData.nombre_usuario &&
    newEmail === originalData.email_usuario &&
    newRol.trim() === originalData.rol.trim() &&
    is_active === originalData.is_active &&
    (newPassword === "" || newPassword === null)
  ) {
    setFieldError(
      "form",
      "No se han realizado cambios. Modifique al menos un campo para continuar.",
    );
    return true;
  }

  clearFieldError("form");
  return false;
};

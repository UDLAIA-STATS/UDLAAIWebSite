import type { User } from "@interfaces/user.interface";

export const validateUsers = (formData: FormData, isUpdate = false) => {
  const username = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";
  const rol = formData.get("rol")?.toString().trim() ?? "";

  const validationErrors: Record<string, string> = {
    nombreVacio: username.length === 0 ? "El nombre de usuario es obligatorio." : "",
    rolVacio: rol.length === 0 ? "El rol de usuario es obligatorio." : "",
    emailVacio: email.length === 0 ? "El correo electrónico es obligatorio." : "",
    emailFormato: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "El correo electrónico no tiene un formato válido." : "",
    passwordVacio: !isUpdate && password.length === 0 ? "La contraseña es obligatoria." : "",
    passwordCorto: !isUpdate && password.length > 0 && password.length < 6 ? "La contraseña debe tener al menos 6 caracteres." : "",    
  };

  if (Object.values(validationErrors).some((msg) => msg !== "")) {
    const errorMessages = Object.values(validationErrors).filter(
      (msg) => msg !== ""
    );
    return errorMessages.join("<br/>");
  }
  return "";
};

export const validateChanges = (formData: FormData, originalData: User) => {
  const newName = formData.get("name")?.toString().trim() ?? "";
  const newEmail = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const newRol = formData.get("rol")?.toString().trim() ?? "";
  const newPassword = formData.get("password")?.toString().trim() ?? "";
  const is_active = (formData.get("is_active")?.toString().trim() ?? "") === "true" ? true : false;

  const validationErrors: Record<string, string> = {
    noChanges:
      newName == originalData.nombre_usuario && newEmail == originalData.email_usuario && 
      newPassword == "" && newRol == originalData.rol && is_active == originalData.is_active &&
      (newPassword === "" || newPassword === null)
        ? "No se han realizado cambios. Modifique al menos un campo para continuar."
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

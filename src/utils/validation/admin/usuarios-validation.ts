export const validateUsers = (formData: FormData, isUpdate = false) => {
  const username = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString().trim() ?? "";
  const emailRegexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const usernameRegexp = new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,100}$/);
  const passwordRegexp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,50}$/);

  const validationErrors: Record<string, string> = {
    username: !usernameRegexp.test(username)
      ? "El nombre debe tener entre 3 y 100 caracteres y solo puede contener letras y espacios."
      : "",
    email: !emailRegexp.test(email)
      ? "Por favor, ingresa un correo electrónico válido."
      : "",
    password: !passwordRegexp.test(password) && !isUpdate
      ? "La contraseña debe tener entre 8 y 50 caracteres, al menos una letra y un número."
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


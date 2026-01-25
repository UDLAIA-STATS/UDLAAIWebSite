import validateLogin from "@utils/validation/auth/login-validation";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form") as HTMLFormElement;
  form.addEventListener("submit", (e) => e.preventDefault());
  const btnSubmit = form.querySelector(
    "button[type='button']",
  ) as HTMLButtonElement;

  document.addEventListener("astro:page-load", async () => {
    btnSubmit.addEventListener("click", async () => {
      btnSubmit.disabled = true;
      btnSubmit.classList.add("opacity-50", "cursor-not-allowed");

      const formData = new FormData(form);
      const username = formData.get("name")?.toString().trim() ?? "";
      const password = formData.get("password")?.toString().trim() ?? "";

      const errorMessages = validateLogin(formData);
      if (errorMessages) {
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Se detectaron errores en el formulario, corrige los campos y vuelve a intentarlo",
        });
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      formData.set("name", username);
      formData.set("password", password);

      const { error } = await actions.login(formData);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: "Usuario o contraseña incorrectos.",
        });
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      navigate("/");
    });
  });
});

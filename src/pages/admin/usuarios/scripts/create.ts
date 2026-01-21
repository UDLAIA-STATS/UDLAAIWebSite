import { privateRoutesMap } from "@consts/routes";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { activateButton, disableButton, validateUsers } from "@utils/index"
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form") as HTMLFormElement;
  const btnSubmit = form!.querySelector(
    "button[type='submit']"
  ) as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", (e) => {
    navigate(privateRoutesMap.ADMINS_USERS);
  });

  form.addEventListener("submit", (e) => e.preventDefault());

  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    disableButton(btnSubmit);
    const formData = new FormData(form);

    const validationErrors = validateUsers(formData);
    if (validationErrors) {
      await Swal.fire({
        icon: "error",
        title: "Error de validación",
        html: "Se detectaron errores en el formulario, corrige los campos y vuelve a intentarlo",
      });
      activateButton(btnSubmit);
      return;
    }

    try {
      const { data, error } = await actions.registerUser(formData);

      if (error) {
        console.error("Error:", error);
          await Swal.fire({
            icon: "error",
            title: "Error al registrar el usuario",
            html: error.message,
          });
          activateButton(btnSubmit);
          return;
      }

      if (data) {
        console.log("Success:", data);
        await Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: data.mensaje,
        });
      }
      activateButton(btnSubmit);
      form.reset();
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      navigate(privateRoutesMap.ADMINS_USERS);
    } catch (error) {
      console.error("Error inesperado:", error);
      await Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.",
      });
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

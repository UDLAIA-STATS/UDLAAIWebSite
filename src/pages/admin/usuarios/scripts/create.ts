import { privateRoutesMap } from "@consts/routes";
import { validateUsers } from "@utils/validation/admin/usuarios-validation";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form") as HTMLFormElement;
  const btnSubmit = form!.querySelector(
    "button[type='submit']"
  ) as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    navigate(privateRoutesMap.ADMINS_USERS);
  });

  form.addEventListener("submit", (e) => e.preventDefault());

  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");
    const formData = new FormData(form);
    // const errorMessage = validateUsers(formData);

    // if (errorMessage.length > 0) {
    //   Swal.fire("Error", errorMessage, "error");
    //   btnSubmit.disabled = false;
    //   btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    //   return;
    // }

    const { value: userCredential } = await Swal.fire({
      title: "Ingrese su contraseña",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async (userCredential) => {
        if (!userCredential) {
          Swal.showValidationMessage("La contraseña es requerida");
          return;
        }
        return userCredential;
      },
    });

    formData.append("userCredential", userCredential);
    try {
      const { data, error } = await actions.registerUser(formData);

      if (error) {
        console.error("Error:", error);
        if (error.message.toString().includes("validation")) {
          await Swal.fire({
            icon: "error",
            title: "Error al registrar el usuario",
            text: "Uno de los campos no es válido. Por favor, verifica e intenta nuevamente.",
          });
          btnSubmit.disabled = false;
          btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
          return;
        }
        // const nameError = error.
        await Swal.fire({
          icon: "error",
          title: "Error al registrar el usuario",
          text: error.message,
        });
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      if (data) {
        console.log("Success:", data);
        await Swal.fire({
          icon: "success",
          title: "Registro de usuario exitoso",
        });
      }
      btnSubmit.removeAttribute("disabled");
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

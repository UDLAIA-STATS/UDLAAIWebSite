import { privateRoutesMap } from "@consts/index";
import { activateButton, disableButton, fileToBase64 } from "@utils/index";
import { validateJugador } from "@utils/validation/player/player-validation";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const btnSubmit = document.getElementById("btn-submit") as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", () => {
    navigate(privateRoutesMap.ADMIN_JUGADORES);
  });

  btnSubmit.addEventListener("click", async () => {
    disableButton(btnSubmit);
    const form = document.getElementById("formJugador") as HTMLFormElement;
    const formData = new FormData(form);

    const validationErrors = validateJugador(formData);
    if (validationErrors) {
      await Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Se detectaron errores en el formulario, corrige los campos y vuelve a intentarlo",
      });
      activateButton(btnSubmit);
      return;
    }

    try {
      const logo = formData.get("imagenjugador");
      if (logo) {
        const file = logo as File;
        const base64 = await fileToBase64(file);
        formData.set("imagenjugador", base64);
      } else {
        formData.delete("imagenjugador");
      }
      const { data, error } = await actions.createJugador(formData);

      if (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error al crear el jugador",
          html: error.message,
        });
        activateButton(btnSubmit);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Jugador registrado",
        text: data.mensaje,
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(privateRoutesMap.ADMIN_JUGADORES);
          activateButton(btnSubmit);
        }
      });

      form.reset();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text:
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
      });
      activateButton(btnSubmit);
    } finally {
      activateButton(btnSubmit);
    }
  });
});

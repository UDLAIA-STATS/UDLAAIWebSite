import { privateRoutesMap } from "@consts/index";
import { fileToBase64 } from "@utils/index";
import { validateJugador } from "@utils/validation/player/player-validation";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const btnSubmit = document.getElementById("btnSubmit") as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", () => {
    navigate(privateRoutesMap.ADMIN_JUGADORES);
  });

  btnSubmit.addEventListener("click", async () => {
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");
    const form = document.getElementById("formJugador") as HTMLFormElement;
    const formData = new FormData(form);

    // Validar antes de enviar
    const validationErrors = validateJugador(formData);
    if (validationErrors) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        html: validationErrors,
      });
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    const jugadoresData = await actions.getJugadores.orThrow({
      pageSize: 1000,
    });
    const jugadores = jugadoresData.data;
    const camisetaOcupada = jugadores.some((j) => {
      return (
        j.numerocamisetajugador.toString() ===
          formData.get("numerocamisetajugador")?.toString() && j.jugadoractivo
      );
    });

    if (camisetaOcupada) {
      Swal.fire({
        icon: "error",
        title: "Número de camiseta no disponible",
        text: "El número de camiseta ya está asignado a otro jugador activo.",
      });
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
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
          text: "Los datos son incorrectos o el jugador ya existe.",
        });
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Jugador registrado",
        text: "El jugador ha sido agregado exitosamente.",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(privateRoutesMap.ADMIN_JUGADORES);
          btnSubmit.disabled = false;
          btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
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
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

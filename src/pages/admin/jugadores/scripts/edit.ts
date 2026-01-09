import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  validateJugador,
  isJugadorUpdated,
} from "@utils/validation/player/player-validation";
import type { Player } from "@interfaces/index";
import { privateRoutesMap } from "@consts/routes";
import { fileToBase64 } from "@utils/index";

document.addEventListener("DOMContentLoaded", () => {
  const btnSubmit = document.getElementById("btn-submit") as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", () => {
    navigate(privateRoutesMap.ADMIN_JUGADORES);
  });

  btnSubmit.addEventListener("click", async () => {
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");
    const form = document.getElementById("formJugador") as HTMLFormElement;
    const formData = new FormData(form);

    // Validación
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

    const idJugador = Number(formData.get("idjugador"));

    // Verificar cambios
    const jugadorData = await actions.getJugadorById.orThrow({
      idjugador: idJugador,
    });
    const jugador = jugadorData.data as Player;

    if (!isJugadorUpdated(jugador, formData)) {
      Swal.fire({
        icon: "info",
        title: "Sin cambios detectados",
        text: "No se han modificado los datos del jugador.",
      });
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    const jugadoresData = await actions.getJugadores.orThrow({
      pageSize: 1000,
    });
    const jugadores = jugadoresData.results as Player[];
    const camisetaOcupada = jugadores.some((j) => {
      return (
        j.numerocamisetajugador.toString() ===
          formData.get("numerocamisetajugador")?.toString() &&
        j.jugadoractivo &&
        j.idjugador !== idJugador
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
      const { data, error } = await actions.updateJugador(formData);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: error.message,
        });
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Jugador actualizado",
        text: "Los datos del jugador se han actualizado correctamente.",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(privateRoutesMap.ADMIN_JUGADORES);
          btnSubmit.disabled = false;
          btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        }
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text:
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
      });
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

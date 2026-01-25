import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { privateRoutesMap } from "@consts/routes";
import { navigate } from "astro:transitions/client";
import {
  validateEquipos,
  isEquipoUpdated,
} from "@utils/validation/partidos/equipos-validation";
import { fileToBase64 } from "@utils/index";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-equipo") as HTMLFormElement;
  const btnSubmit = document.querySelector("#btn-submit") as HTMLButtonElement;
  const btnCancel = document.querySelector("#btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", () =>
    navigate(privateRoutesMap.VER_EQUIPOS),
  );

  form.addEventListener("submit", (e) => e.preventDefault());

  btnSubmit.addEventListener("click", async () => {
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");

    const formData = new FormData(form);
    const errorMessage = validateEquipos(formData);

    if (errorMessage) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Se detectaron errores en el formulario, corrige los campos y vuelve a intentarlo",
      });
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    const equipoOriginalData = await actions.getEquipoById.orThrow({
      id: Number(formData.get("idequipo")),
    });
    const equipoOriginal = equipoOriginalData.data;

    const equipoChanged = isEquipoUpdated(equipoOriginal, formData);
    if (!equipoChanged) {
      await Swal.fire(
        "Información",
        "No se han detectado cambios en el equipo.",
        "info",
      );
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    // Normalizar datos
    const activo = formData.get("equipoactivo") === "true";
    formData.set("equipoactivo", activo.toString());

    const logo = formData.get("imagenequipo");

    try {
      if (logo) {
        const file = logo as File;
        const base64 = await fileToBase64(file);
        formData.set("imagenequipo", base64);
      }

      const { error } = await actions.updateEquipo(formData);
      if (error) {
        await Swal.fire("Error", error.message, "error");
      } else {
        await Swal.fire(
          "Equipo actualizado",
          "Equipo actualizado correctamente",
          "success",
        );
        navigate(privateRoutesMap.VER_EQUIPOS);
      }
    } catch (err) {
      console.error("Error al actualizar equipo:", err);
      await Swal.fire("Error", "No se pudo actualizar el equipo", "error");
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

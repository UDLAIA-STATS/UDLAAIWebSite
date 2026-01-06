import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { privateRoutesMap } from "@consts/routes";
import { navigate } from "astro:transitions/client";
import { validateEquipos } from "@utils/validation/partidos/equipos-validation";
import { fileToBase64 } from "@utils/index";

const form = document.querySelector("#form-equipo") as HTMLFormElement;
const btnSubmit = document.querySelector("#btn-submit") as HTMLButtonElement;
const btnCancel = document.querySelector("#btn-cancel") as HTMLButtonElement;

document.addEventListener("DOMContentLoaded", () => {
  btnCancel.addEventListener("click", () =>
    navigate(privateRoutesMap.VER_EQUIPOS)
  );

  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");

    const formData = new FormData(form);
    const errorMessage = validateEquipos(formData);

    if (errorMessage.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        html: errorMessage,
      });
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
      } else {
        formData.delete("imagenequipo");
      }
      const { data, error } = await actions.createEquipo(formData);
      if (error) {
        await Swal.fire("Error", error.message, "error");
      } else {
        await Swal.fire("Éxito", "Equipo creado correctamente", "success");
        navigate(privateRoutesMap.VER_EQUIPOS);
        form.reset();
      }
    } catch (err) {
      console.error("Error al crear equipo:", err);
      Swal.fire("Error", "No se pudo crear el equipo", "error");
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

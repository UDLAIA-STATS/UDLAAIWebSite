import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { privateRoutesMap } from "@consts/routes";
import { navigate } from "astro:transitions/client";
import { validateEquipos } from "@utils/validation/partidos/equipos-validation";
import { fileToBase64, activateButton, disableButton } from "@utils/index";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-equipo") as HTMLFormElement;
  const btnSubmit = document.querySelector("#btn-submit") as HTMLButtonElement;
  const btnCancel = document.querySelector("#btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", () =>
    navigate(privateRoutesMap.VER_EQUIPOS),
  );

  form.addEventListener("submit", (e) => e.preventDefault());

  btnSubmit.addEventListener("click", async () => {
    disableButton(btnSubmit);

    const formData = new FormData(form);
    const errorMessage = validateEquipos(formData);

    if (errorMessage) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Se detectaron errores en el formulario, corrige los campos y vuelve a intentarlo",
      });
      activateButton(btnSubmit);
      return;
    }

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
        await Swal.fire("Equipo registrado", data.mensaje, "success");
        navigate(privateRoutesMap.VER_EQUIPOS);
        form.reset();
      }
    } catch (err) {
      console.error("Error al crear equipo:", err);
      await Swal.fire("Error", "No se pudo crear el equipo", "error");
      activateButton(btnSubmit);
    } finally {
      activateButton(btnSubmit);
    }
  });
});

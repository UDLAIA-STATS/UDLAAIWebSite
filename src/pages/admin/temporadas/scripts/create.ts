import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { privateRoutesMap } from "@consts/routes";
import { validateTemporadas } from "@utils/validation/partidos/temporadas-validation";
import { activateButton, disableButton } from "@utils/index";

document.addEventListener("DOMContentLoaded", async () => {
  const btnSubmit = document.getElementById("btn-submit") as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;
  const form = document.getElementById("form-temporada") as HTMLFormElement;

  btnCancel.addEventListener("click", () => {
    navigate(privateRoutesMap.VER_TEMPORADAS);
  });

  btnSubmit.addEventListener("click", async () => {
    disableButton(btnSubmit);

    const formData = new FormData(form);
    const errorMessage = validateTemporadas(formData);

    if (errorMessage) {
      Swal.fire(
        "Error",
        "Se detectaron errores en el formulario, corrige los campos y vuelve a intentarlo",
        "error"
      ).then(() => {
        activateButton(btnSubmit);
      });
      return;
    }

    // 🧠 Normalización de datos antes de enviar
    const tipo = formData.get("tipotemporada")?.toString() ?? "";
    const fechaInicio = formData.get("fechainiciotemporada")?.toString();
    const fechaFin = formData.get("fechafintemporada")?.toString();

    // Convertimos fechas a formato ISO si existen
    const fechaInicioISO = fechaInicio
      ? new Date(fechaInicio).toISOString()
      : "";
    const fechaFinISO = fechaFin ? new Date(fechaFin).toISOString() : "";

    // Creamos un nuevo FormData limpio con los tipos correctos
    formData.set(
      "nombretemporada",
      formData.get("nombretemporada")?.toString().trim() ?? ""
    );
    formData.set(
      "descripciontemporada",
      formData.get("descripciontemporada")?.toString().trim() ?? ""
    );
    formData.set("tipotemporada", tipo);
    formData.set("fechainiciotemporada", fechaInicioISO);
    formData.set("fechafintemporada", fechaFinISO);
    formData.set(
      "temporadaactiva",
      formData.get("temporadaactiva")?.toString() ?? ""
    );

    try {
      const { data, error } = await actions.createTemporada(formData);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error al crear temporada",
          html: error.message,
        });
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      Swal.fire("Éxito", data.mensaje, "success").then(() => {
        navigate(privateRoutesMap.VER_TEMPORADAS);
      });

      form.reset();
    } catch (err) {
      console.error("Error al crear temporada:", err);
      Swal.fire("Error", "Ocurrió un problema al crear la temporada", "error");
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { privateRoutesMap } from "@consts/routes";
import { setLimitDatesTorneo, validateTorneo } from "@utils/validation/partidos/torneo-validation";

document.addEventListener("DOMContentLoaded", async () => {
  const btnSubmit = document.getElementById("btn-submit") as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;
  const form = document.getElementById("form-torneo") as HTMLFormElement;
  const temporadasSelect = document.getElementById(
    "idtemporada"
  ) as HTMLSelectElement;

  temporadasSelect.addEventListener("change", async () => {
    const selectedValue = temporadasSelect.value;
    await setLimitDatesTorneo(Number(selectedValue));
  });

  btnCancel.addEventListener("click", () => {
    navigate(privateRoutesMap.VER_TORNEOS);
  });

  form.addEventListener("submit", (e) => e.preventDefault());

  btnSubmit.addEventListener("click", async () => {
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");

    const formData = new FormData(form);
    const errorMessage = validateTorneo(formData);

    if (errorMessage) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Se detectaron errores en el formulario, corrige los campos y vuelve a intentarlo",
      });
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    // Normalización de datos antes de enviar
    console.log("torneo Activo" + formData.get("torneoactivo"));
    const torneoActivo = formData.get("torneoactivo") === "true" ? true : false;

    const fechaInicio = new Date(formData.get("fechainiciotorneo") as string);
    const fechaFin = new Date(formData.get("fechafintorneo") as string);

    formData.set("fechainiciotorneo", fechaInicio.toISOString());
    formData.set("fechafintorneo", fechaFin.toISOString());
    formData.set("torneoactivo", torneoActivo.toString());

    try {
      const { data, error } = await actions.createTorneo(formData);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error al crear torneo",
          html: error.message,
        });
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      Swal.fire("Torneo creado", data.mensaje, "success").then(() => {
        navigate(privateRoutesMap.VER_TORNEOS);
      });

      form.reset();
    } catch (err) {
      console.error("Error al crear torneo:", err);
      Swal.fire("Error", "Ocurrió un problema al crear el torneo", "error");
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

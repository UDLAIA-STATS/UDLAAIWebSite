import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { privateRoutesMap } from "@consts/routes";
import {
  validateTorneo,
  isTorneoUpdated,
  setLimitDatesTorneo,
} from "@utils/validation/partidos/torneo-validation";
import type { Torneo } from "@interfaces/index";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-torneo") as HTMLFormElement;
  const btnSubmit = document.getElementById("btn-submit") as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;
  const temporadasSelect = document.getElementById(
    "idtemporada"
  ) as HTMLSelectElement;

  const selectedValue = temporadasSelect.value;
  await setLimitDatesTorneo(Number(selectedValue));

  form.addEventListener("submit", (e) => e.preventDefault());

  temporadasSelect.addEventListener("change", async () => {
    const selectedValue = temporadasSelect.value;
    await setLimitDatesTorneo(Number(selectedValue));
  });
  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    navigate(privateRoutesMap.VER_TORNEOS);
  });

  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");

    const formData = new FormData(form);
    const errorMessage = validateTorneo(formData);

    if (errorMessage) {
      Swal.fire(
        "Error",
        "Se detectaron errores en el formulario, corrige los campos y vuelve a intentarlo",
        "error"
      );
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    const torneoData = await actions.getTorneoById.orThrow({
      id: Number.parseInt(formData.get("idtorneo")?.toString() ?? "0"),
    });
    const torneoActual = torneoData.data as Torneo;
    const cambiosDetectados = isTorneoUpdated(torneoActual, formData);

    if (!cambiosDetectados) {
      Swal.fire(
        "Información",
        "No se han detectado cambios en el torneo.",
        "info"
      );
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    // Normalización de datos antes de actualizar
    const torneoActivo = formData.get("torneoactivo") === "true";
    const fechaInicio = new Date(formData.get("fechainiciotorneo") as string);
    const fechaFin = new Date(formData.get("fechafintorneo") as string);

    formData.set("fechainiciotorneo", fechaInicio.toISOString());
    formData.set("fechafintorneo", fechaFin.toISOString());
    formData.set("torneoactivo", torneoActivo.toString());

    try {
      const { data, error } = await actions.updateTorneo(formData);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar torneo",
          html: error.message,
        });
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      Swal.fire("Torneo actualizado", data.mensaje, "success").then(() => {
        navigate(privateRoutesMap.VER_TORNEOS);
      });
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        "Ocurrió un problema al actualizar el torneo",
        "error"
      );
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { privateRoutesMap } from "@consts/routes";
import {
  isTemporadaUpdated,
  validateTemporadas,
} from "@utils/validation/partidos/temporadas-validation";
import type { Temporada } from "@interfaces/torneos.interface";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("form-temporada") as HTMLFormElement;
  const btnSubmit = document.getElementById("btn-submit") as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", () => {
    navigate(privateRoutesMap.VER_TEMPORADAS);
  });

  btnSubmit.addEventListener("click", async () => {
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");

    const formData = new FormData(form);
    const errorMessage = validateTemporadas(formData);
    const data = await actions.getTemporadaById.orThrow({
      id: Number.parseInt(formData.get("idtemporada")?.toString() ?? "0"),
    });
    const temporadaActual = data.data as Temporada;
    const cambiosDetectados = isTemporadaUpdated(temporadaActual, formData);

    if (!cambiosDetectados) {
      Swal.fire(
        "Información",
        "No se han detectado cambios en la temporada.",
        "info"
      ).then(() => {
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      });
      return;
    }

    if (errorMessage) {
      Swal.fire("Error", errorMessage, "error").then(() => {
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      });
      return;
    }

    // 🧠 Normalización de datos (solo ajuste de formato)
    const tipo = formData.get("tipotemporada")?.toString().trim() ?? "";
    const fechaInicio = formData.get("fechainiciotemporada")?.toString();
    const fechaFin = formData.get("fechafintemporada")?.toString();

    const fechaInicioISO = fechaInicio
      ? new Date(fechaInicio).toISOString()
      : "";
    const fechaFinISO = fechaFin ? new Date(fechaFin).toISOString() : "";

    formData.set("idtemporada", formData.get("idtemporada")?.toString() ?? "");
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
      const { data, error } = await actions.updateTemporada(formData);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar temporada",
          html: error.message,
        });
      } else {
        Swal.fire(
          "Éxito",
          "Temporada actualizada correctamente",
          "success"
        ).then(() => {
          navigate(privateRoutesMap.VER_TEMPORADAS);
        });
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
      Swal.fire(
        "Error",
        "Ocurrió un problema al actualizar la temporada",
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

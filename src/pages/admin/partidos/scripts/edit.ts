import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { privateRoutesMap } from "@consts/index";
import {
  validatePartidos,
  isPartidoUpdated,
} from "@utils/validation/partidos/partidos-validation";
import type { Torneo } from "@interfaces/index";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("#form-partido") as HTMLFormElement;
  const btnSubmit = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  const torneosData = await actions.getTorneos.orThrow({ pageSize: 1000 });
  const torneos: Torneo[] = torneosData.data ?? [];

  const selectTemporada = document.getElementById(
    "idtemporada"
  ) as HTMLSelectElement;
  const selectTorneo = document.getElementById("idtorneo") as HTMLSelectElement;

  // === Filtrar torneos por temporada ===
  selectTemporada.addEventListener("change", () => {
    const temporadaSeleccionada = selectTemporada.value;

    selectTorneo.innerHTML =
      '<option value="" disabled selected>Selecciona un torneo</option>';

    const torneosFiltrados = torneos.filter(
      (torneo) => torneo.idtemporada === Number(temporadaSeleccionada)
    );

    if (torneosFiltrados.length === 0) {
      selectTorneo.innerHTML = "";
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No hay torneos para esta temporada";
      selectTorneo.appendChild(option);
      return;
    }

    torneosFiltrados.forEach((torneo) => {
      const option = document.createElement("option");
      option.value = String(torneo.idtorneo);
      option.textContent = torneo.nombretorneo;
      selectTorneo.appendChild(option);
    });
  });

  // === Acciones de los botones ===
  btnCancel.addEventListener("click", () =>
    navigate(privateRoutesMap.VER_PARTIDOS)
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  btnSubmit.addEventListener("click", async () => {
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");
    const formData = new FormData(form);
    const errorMessage = validatePartidos(formData);

    if (errorMessage) {
      Swal.fire("Error", errorMessage, "error");
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }
    const partidoData = await actions.getPartidoById.orThrow({
      id: Number.parseInt(formData.get("idpartido")?.toString() ?? "0"),
    });
    const partido = partidoData.data ?? {};
    const isChanged = isPartidoUpdated(partido, formData);

    if (!isChanged) {
      await Swal.fire(
        "Información",
        "No se han detectado cambios en el partido.",
        "info"
      );
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    formData.set(
      "fechapartido",
      new Date(formData.get("fechapartido") as string).toISOString()
    );

    try {
      const { data, error } = await actions.updatePartido(formData);

      if (error || !data) {
        Swal.fire("Error", "No se pudo actualizar el partido", "error");
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      Swal.fire("Éxito", "Partido actualizado correctamente", "success").then(
        (result) => {
          if (result.isConfirmed) {
            navigate(privateRoutesMap.VER_PARTIDOS);
          }
        }
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error inesperado al actualizar el partido", "error");
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

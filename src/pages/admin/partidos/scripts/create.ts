import Swal from "sweetalert2";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { privateRoutesMap } from "@consts/index";
import { validatePartidos } from "@utils/validation/partidos/partidos-validation";
import type { Torneo } from "@interfaces/torneos.interface";
import { activateButton, disableButton } from "@utils/index";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("#form-partido") as HTMLFormElement;
  const btnSubmit = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  const data = await actions.getTorneos.orThrow({ pageSize: 1000 });
  const torneos: Torneo[] = (data.results as Torneo[]) ?? [];

  const selectTemporada = document.getElementById(
    "idtemporada"
  ) as HTMLSelectElement;
  const selectTorneo = document.getElementById("idtorneo") as HTMLSelectElement;
  const fechaInput = document.getElementById(
    "fechapartido"
  ) as HTMLInputElement;

  selectTorneo.addEventListener("change", async (e) => {
    const torneoSeleccionado = (e.target as HTMLSelectElement).value;

    if (!torneoSeleccionado) {
      fechaInput.min = "";
      fechaInput.max = "";
      return;
    }

    const data = await actions.getTorneoById.orThrow({
      id: Number(torneoSeleccionado),
    });
    const torneo = data.data;

    fechaInput.min = new Date(torneo.fechainiciotorneo)
      .toISOString()
      .slice(0, 16);
    fechaInput.max = new Date(torneo.fechafintorneo).toISOString().slice(0, 16);
  });

  // === Evento: Filtrar torneos al cambiar la temporada ===
  selectTemporada.addEventListener("change", (e) => {
    const temporadaSeleccionada = (e.target as HTMLSelectElement).value;
    selectTorneo.value = "";
    fechaInput.value = "";
    fechaInput.min = "";
    fechaInput.max = "";

    // Limpiar torneos actuales
    selectTorneo.innerHTML =
      '<option value="" disabled selected>Selecciona un torneo</option>';

    if (!temporadaSeleccionada) return;

    // Filtrar torneos según la temporada
    const torneosFiltrados = torneos.filter(
      (torneo) => torneo.idtemporada === Number(temporadaSeleccionada)
    );

    if (torneosFiltrados.length === 0) {
      selectTorneo.innerHTML = "";
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No hay torneos disponibles";
      option.disabled = true;
      option.selected = true;
      selectTorneo.appendChild(option);
      return;
    }

    // Agregar opciones filtradas
    torneosFiltrados.forEach((torneo) => {
      const option = document.createElement("option");
      option.value = String(torneo.idtorneo);
      option.textContent = torneo.nombretorneo;
      selectTorneo.appendChild(option);
    });
  });

  form.addEventListener("submit", (e) => e.preventDefault());

  // === Botones y envío del formulario ===
  btnCancel.addEventListener("click", () =>
    navigate(privateRoutesMap.VER_PARTIDOS)
  );

  btnSubmit.addEventListener("click", async () => {
    disableButton(btnSubmit);
    const formData = new FormData(form);
    const errorMessage = validatePartidos(formData);

    if (errorMessage) {
      Swal.fire("Error", errorMessage, "error");
      activateButton(btnSubmit);
      return;
    }

    formData.set(
      "fechapartido",
      new Date(formData.get("fechapartido") as string).toISOString()
    );

    try {
      const { data, error } = await actions.createPartido(formData);

      if (error || !data) {
        Swal.fire("Error", error.message, "error");
        activateButton(btnSubmit);
        return;
      }

      Swal.fire("Éxito", data.mensaje, "success").then((result) => {
        if (result.isConfirmed) {
          navigate(privateRoutesMap.VER_PARTIDOS);
          form.reset();
          activateButton(btnSubmit);
        }
      });
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err instanceof Error
          ? err.message
          : "Error inesperado al crear el partido",
        "error"
      );
      activateButton(btnSubmit);
    } finally {
      activateButton(btnSubmit);
    }
  });
});

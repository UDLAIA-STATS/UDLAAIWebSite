import { updateUrl } from "@utils/index";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;

  searchBox.addEventListener("input", (e) => {
    window.setTimeout(() => {
      console.log("Search box value:", searchBox.value);
      const url = updateUrl(new URL(globalThis.location.href), "search", searchBox.value)
      navigate(url.toString());
    }, 1500);
  });

  document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-delete-user]")) {
      const button = target.closest("[data-delete-user]") as HTMLButtonElement;
      const banner = button.value;
      if (banner) {
        console.log(`Jugador ${banner} desactivado`);
        Swal.fire({
          title: "¿Estás seguro?",
          text: `Esta acción desactivará al jugador con banner ${banner}.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Desactivar",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const { data, error } = await actions.deleteJugador({
              idJugador: banner,
            });
            if (error) {
              console.error(error.message, error);
              Swal.fire("Error", error.message, "error");
            } else {
              Swal.fire("Éxito", data.mensaje, "success").then(
                async (result) => {
                  if (result.isConfirmed) {
                    window.location.reload();
                  }
                }
              );
            }
          }
        });
      }
    }
  });
});

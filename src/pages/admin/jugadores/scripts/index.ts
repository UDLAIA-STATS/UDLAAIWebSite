import { actions } from "astro:actions";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;

  searchBox.addEventListener("input", (e) => {
    const query = searchBox.value.trim();
    const rows = document.querySelectorAll("tr[id^='user-row-']");
    rows.forEach((row) => {
      const banner = row.children[0];
      const nombre = row.children[1];
      const apellido = row.children[2];
      if (banner && nombre && apellido) {
        const bannerText = banner.textContent || "";
        const nombreText = nombre.textContent || "";
        const apellidoText = apellido.textContent || "";

        if (
          bannerText.toLowerCase().includes(query.toLowerCase()) ||
          nombreText.toLowerCase().includes(query.toLowerCase()) ||
          apellidoText.toLowerCase().includes(query.toLowerCase())
        ) {
          row.classList.remove("hidden");
        } else {
          row.classList.add("hidden");
        }
      }
    });
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

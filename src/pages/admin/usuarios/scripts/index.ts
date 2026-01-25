import Swal from "sweetalert2";
import { deleteUser } from "@services/delete_user";

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;

  document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-delete-user]")) {
      const button = target.closest("[data-delete-user]") as HTMLButtonElement;
      const username = button.getAttribute("data-username");
      console.log("Eliminar usuario:", username);

      if (!username) {
        await Swal.fire({
          icon: "error",
          title: "No se pudo desactivar el usuario",
          text: "No se pudo obtener el nombre de usuario.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("nickname", username.trim());

      Swal.fire({
        title: `¿Estás seguro de desactivar al usuario ${username}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Desactivar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteUser(formData);
          } catch (error) {
            console.error("Error al desactivar el usuario:", error);
            await Swal.fire(
              "Error",
              (error as Error).message ||
                "Ocurrió un error al desactivar el usuario",
              "error",
            );
            return;
          }
        }
      });
    }
  });

  searchBox.addEventListener("input", async () => {
    const search = searchBox.value;
    const rows = document.querySelectorAll("tr[id^='user-row-']");
    rows.forEach((row) => {
      const usernameCell = row.querySelector("td:first-child");
      const emailCell = row.querySelector("td:nth-child(2)");
      if (usernameCell || emailCell) {
        const username = usernameCell?.textContent ?? "";
        const email = emailCell?.textContent ?? "";
        if (
          username.toLowerCase().includes(search.toLowerCase()) ||
          email.toLowerCase().includes(search.toLowerCase())
        ) {
          row.classList.remove("hidden");
        } else {
          row.classList.add("hidden");
        }
      }
    });
  });
});

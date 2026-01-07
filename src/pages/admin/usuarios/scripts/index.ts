import { actions } from "astro:actions";
import Swal from "sweetalert2";
import { navigate } from "astro:transitions/client";
import { privateRoutesMap } from "@consts/routes";

document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;

  document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-delete-user]")) {
      const button = target.closest("[data-delete-user]") as HTMLButtonElement;
      const username = button.getAttribute("data-username");
      console.log("Eliminar usuario:", username);
      const isActive = button.getAttribute("data-is-active");

      if (username && isActive === "false") {
        await Swal.fire({
          icon: "error",
          title: "No se pudo eliminar el usuario",
          text: "El usuario no está activo y no puede ser eliminado.",
        });
        return;
      }

      if (username) {
        const formData = new FormData();
        formData.append("nickname", username);
        formData.append(
          "userCredential",
          import.meta.env.DEFAULT_ADMIN_PASSWORD
        );
        Swal.fire({
          title: `¿Estás seguro de eliminar al usuario ${username}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const { data, error } = await actions.deleteUser(formData);
            if (error) {
              Swal.fire({
                icon: "error",
                title: "Error al eliminar el usuario",
                text: error.message,
              });
            } else {
              Swal.fire(
                "Éxito",
                `Usuario ${username} eliminado`,
                "success"
              ).then(() => {
                navigate(privateRoutesMap.ADMINS_USERS);
              });
            }
          }
        });
      }
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

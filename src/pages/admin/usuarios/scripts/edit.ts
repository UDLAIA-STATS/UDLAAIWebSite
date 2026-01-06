import Swal from "sweetalert2/dist/sweetalert2.js";
import { actions } from "astro:actions";
import { privateRoutesMap } from "@consts/routes";
import { navigate } from "astro:transitions/client";
import type { User } from "@interfaces/user.interface";
import {
  validateUsers,
  validateChanges,
} from "@utils/validation/admin/usuarios-validation";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("#form-usuario") as HTMLFormElement;
  const userCredential = "123456789";
  const btnSubmit = form!.querySelector(
    "button[type='submit']"
  ) as HTMLButtonElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;

  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    navigate(privateRoutesMap.ADMINS_USERS);
  });

  form.addEventListener("submit", (e) => e.preventDefault());

  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    btnSubmit.classList.add("opacity-50", "cursor-not-allowed");
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim() ?? "";
    const rol = formData.get("rol")?.toString().trim();

    const errorMessage = validateUsers(formData, true);

    if (errorMessage.length > 0) {
      Swal.fire("Error", errorMessage, "error");
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      return;
    }

    formData.set("name", name ?? "");
    formData.set("email", email ?? "");
    formData.set("password", password ?? "");
    formData.set("rol", rol ?? "");

    const originalName = formData.get("originalName")?.toString().trim() ?? "";
    try {
      console.log(originalName);
      const { data: dataActual, error: errorActual } =
        await actions.getUserByUsername({
          username: originalName,
          userCredential: "Administrador123",
        });
      const user: User = dataActual?.data as User;
      console.log("user actual:", user);

      if (errorActual || !user) {
        Swal.fire(
          "Error",
          "Error al obtener los datos del usuario actual",
          "error"
        );
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }
      const validationChanges = validateChanges(formData, user);
      console.log("validationChanges:", validationChanges);
      if (validationChanges != "") {
        Swal.fire("Error", validationChanges, "error");
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      if (password === "") {
        formData.delete("password");
      }

      formData.append("userCredential", userCredential);
      try {
        const { data, error } = await actions.updateUser(formData);

        if (error) {
          console.error("Error:", error);
          if (error.message.toString().includes("validation")) {
            await Swal.fire({
              icon: "error",
              title: "Error de validación",
              text: error.message,
            });
          } else {
            await Swal.fire("Error", "Error al actualizar el usuario", "error");
          }
          btnSubmit.disabled = false;
          btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
          return;
        }
        Swal.fire(
          "Éxito",
          `El usuario ${formData.get("originalName")} ha sido actualizado exitósamente.`,
          "success"
        ).then((result) => {
          if (result.isConfirmed) {
            navigate(privateRoutesMap.ADMINS_USERS);
          }
        });
        form.reset();
      } catch (err) {
        Swal.fire("Error", "Error al actualizar el usuario", "error");
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
      }
    } catch (err) {
      console.error(err as Error);
      Swal.fire("Error", "Error al actualizar el usuario", "error");
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
    }
  });
});

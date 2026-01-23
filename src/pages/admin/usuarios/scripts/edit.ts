import Swal from "sweetalert2/dist/sweetalert2.js";
import { ActionError, actions } from "astro:actions";
import { privateRoutesMap } from "@consts/routes";
import { navigate } from "astro:transitions/client";
import type { User } from "@interfaces/user.interface";
import {
  validateUsers,
  validateChanges,
  disableButton,
  activateButton,
} from "@utils/index";
import { getActualUser } from "@services/index";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("#form-usuario") as HTMLFormElement;
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
    disableButton(btnSubmit);
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim() ?? "";
    const rol = formData.get("rol")?.toString().trim();

    const errorMessage = validateUsers(formData, true);

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

    formData.set("name", name ?? "");
    formData.set("email", email ?? "");
    formData.set("password", password ?? "");
    formData.set("rol", rol ?? "");

    const originalName = formData.get("originalName")?.toString().trim() ?? "";
    let user: User;

    try {
      user = await getActualUser(originalName);
    } catch (err) {
      await Swal.fire(
        "Error",
        "Error al obtener los datos del usuario",
        "error"
      );
      activateButton(btnSubmit);
      return;
    }

    try {
      const validationChanges = validateChanges(formData, user);
      console.log("validationChanges:", validationChanges);
      if (validationChanges != "") {
        Swal.fire("Error", validationChanges, "error");
        btnSubmit.disabled = false;
        btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
        return;
      }

      console.log("Password before check:", password);

      if (password === "") {
        formData.delete("password");
        console.log("Password field removed from formData");
      }

      try {
        const { data, error } = await actions.updateUser(formData);

        if (error) {
          console.error("Error:", error);
          await Swal.fire({
            icon: "error",
            title: "Error al actualizar el usuario",
            html: error.message,
          });
          activateButton(btnSubmit);
          return;
        }
        Swal.fire("Usuario actualizado", data.mensaje, "success").then((result) => {
          if (result.isConfirmed) {
            navigate(privateRoutesMap.ADMINS_USERS);
          }
        });
        form.reset();
      } catch (err) {
        Swal.fire("Error", (err as Error).message, "error");
        activateButton(btnSubmit);
      }
    } catch (err) {
      console.error(err as Error);
      Swal.fire("Error", (err as Error).message, "error");
      activateButton(btnSubmit);
    } finally {
      activateButton(btnSubmit);
    }
  });
});

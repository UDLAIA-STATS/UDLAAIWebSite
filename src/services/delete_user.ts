import { privateRoutesMap } from "@consts/routes";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import Swal from "sweetalert2";

export const deleteUser = async (formData: FormData) => {
  const { data, error } = await actions.deleteUser(formData);
  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("No se recibió la respuesta del servidor.");
  }
  await Swal.fire("Usuario desactivado", data.mensaje, "success");
  navigate(privateRoutesMap.ADMINS_USERS);
  return data;
};

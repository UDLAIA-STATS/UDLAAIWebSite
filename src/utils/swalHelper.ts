import Swal from "sweetalert2";
import type { SweetAlertResult } from "sweetalert2";
import SwalCRUDMessages from "../constants/swalMessages";

export interface AskPasswordOptions {
  title?: string;
  placeholder?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export interface AskPasswordResult {
  confirmed: boolean;
  value: string | null;
}

export interface ConfirmDeleteOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const DEFAULTS = {
  confirmButtonText: "Aceptar",
  cancelButtonText: "Cancelar",
  allowOutsideClick: () => !Swal.isLoading(),
  customClass: {
    popup: "swal-popup",
    title: "swal-title",
    confirmButton: "swal-confirm",
    cancelButton: "swal-cancel",
  },
};

export async function askPassword(
  options: AskPasswordOptions = {},
): Promise<AskPasswordResult> {
  const { title, placeholder, confirmButtonText, cancelButtonText } = options;

  const result: SweetAlertResult<string> = await Swal.fire({
    title: title || "Ingrese su contraseña",
    input: "password",
    inputAttributes: {
      autocapitalize: "off",
      autocomplete: "current-password",
    },
    inputPlaceholder: placeholder || "",
    showCancelButton: true,
    confirmButtonText: confirmButtonText || DEFAULTS.confirmButtonText,
    cancelButtonText: cancelButtonText || DEFAULTS.cancelButtonText,
    showLoaderOnConfirm: true,
    allowOutsideClick: DEFAULTS.allowOutsideClick,
    preConfirm: async (pwd: string) => {
      if (!pwd) {
        Swal.showValidationMessage(SwalCRUDMessages.REQUIRED_FIELD);
        return false as any;
      }

      try {
        await new Promise((res) => setTimeout(res, 300));
        return pwd;
      } catch (err: any) {
        Swal.showValidationMessage(err?.message || "Error");
        return false as any;
      }
    },
    customClass: DEFAULTS.customClass,
  });

  if (result.isConfirmed) {
    return { confirmed: true, value: result.value ?? null };
  }

  return { confirmed: false, value: null };
}

export async function confirmDelete(
  options: ConfirmDeleteOptions = {},
): Promise<boolean> {
  const { title, text, confirmButtonText, cancelButtonText } = options;

  const result = await Swal.fire({
    title: title || SwalCRUDMessages.DELETE_CONFIRM_TITLE,
    text: text || SwalCRUDMessages.DELETE_CONFIRM_TEXT,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmButtonText || DEFAULTS.confirmButtonText,
    cancelButtonText: cancelButtonText || DEFAULTS.cancelButtonText,
    customClass: DEFAULTS.customClass,
  });

  return Boolean(result.isConfirmed);
}

export function toastSuccess(message?: string) {
  return Swal.fire({
    position: "top-end",
    icon: "success",
    title: message || SwalCRUDMessages.CREATE_SUCCESS,
    showConfirmButton: false,
    timer: 2000,
    customClass: DEFAULTS.customClass,
  });
}

export function toastError(message?: string) {
  return Swal.fire({
    position: "top-end",
    icon: "error",
    title: message || SwalCRUDMessages.CREATE_ERROR,
    showConfirmButton: false,
    timer: 3000,
    customClass: DEFAULTS.customClass,
  });
}

const swalHelper = {
  askPassword,
  confirmDelete,
  toastSuccess,
  toastError,
};

export default swalHelper;

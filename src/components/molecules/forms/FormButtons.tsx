import { buttonClass } from "@consts/index";
import type { Component } from "solid-js";
import arrowNext from "@assets/icons/arrow-next.svg";

interface Props {
  label: string;
}

export const FormButtons: Component<Props> = ({ label}: Props) => {
  return (
    <div class="flex justify-center text-center mt-5 mx-5 pt-2 gap-5">
      <button class={buttonClass} type="button" id="btn-cancel">
        Cancelar
      </button>
      <button class={buttonClass} type="submit" id="btn-submit">
        {label}
        <img src={arrowNext.src} class="size-7 rotate-180" alt="" />
      </button>
    </div>
  );
};

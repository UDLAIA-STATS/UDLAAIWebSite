import { inputClass } from "@consts/index";
import type { Component } from "solid-js";

interface Props {
  label: string;
  id: string;
  maxlength?: number;
  minlength?: number;
  required?: boolean;
  value?: string | number;
  hidden?: boolean;
  rows?: number;
}

export const TextArea: Component<Props> = ({
  label,
  id,
  maxlength = 100,
  minlength = 0,
  required = false,
  value = "",
  hidden = false,
  rows = 1
 }: Props) => {
  return (
    <div class="flex flex-col gap-2 mb-4">
      <label for={id} class="text-base font-medium">{label}</label>
      <textarea
        id={id}
        name={id}
        maxlength={maxlength}
        rows={rows}
        class={`${inputClass} resize-none`}
      >{value}</textarea>
    </div>
  );
};

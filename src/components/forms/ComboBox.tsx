import { inputClass } from "@consts/index";
import type { Component, JSX } from "solid-js";

interface Props {
  label: string;
  id: string;
  required?: boolean;
  children: JSX.Element[];
}

export const ComboBox: Component<Props> = ({ label, id, required = false, children }: Props) => {
  return (
    <div class="flex gap-2 flex-col mb-4">
      <label for={id} class="text-base font-medium">
        {label}
      </label>
      <select id={id} name={id} class={inputClass} required={required}>
        {children}
      </select>
    </div>
  );
};

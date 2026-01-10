import { inputClass } from "@consts/index";
import type { Component, JSX } from "solid-js";

interface Props {
  label: string;
  id: string;
  required?: boolean;
  children: JSX.Element[];
}

export const ComboBox: Component<Props> = ({
  label,
  id,
  required = false,
  children,
}: Props) => {
  const errorId = `${id}-error`;

  return (
    <div class="flex flex-col mb-2">
      <div class="flex gap-2 flex-col">
        <label for={id} class="text-base font-medium">
          {label}
        </label>
        <select
          id={id}
          name={id}
          class={inputClass}
          required={required}
          aria-describedby={errorId}
        >
          {children}
        </select>
        <span id={errorId} class="text-white text-sm" aria-live="polite"></span>
      </div>
    </div>
  );
};

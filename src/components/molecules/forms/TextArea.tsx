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
  rows = 1,
}: Props) => {
  const errorId = `${id}-error`;

  return (
    <div class="flex flex-col mb-2">
      <div class="flex flex-col gap-2">
        <label for={id} class="text-base font-medium">
          {label}
        </label>
        <textarea
          id={id}
          name={id}
          maxlength={maxlength}
          rows={rows}
          class={`${inputClass} resize-none`}
          aria-describedby={errorId}
          hidden={hidden}
          minlength={minlength}
          required={required}
        >
          {value}
        </textarea>
        <span id={errorId} class="text-white text-sm" aria-live="polite"></span>
      </div>
    </div>
  );
};

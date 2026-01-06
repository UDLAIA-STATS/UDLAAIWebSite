import { inputClass } from "@consts/index";
import type { Component } from "solid-js";

interface Props {
  label: string;
  id: string;
  maxlength?: number;
  minlength?: number;
  min?: string;
  max?: string;
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "date"
    | "checkbox"
    | "radio"
    | "select"
    | "textarea"
    | "file"
    | "color"
    | "range"
    | "search"
    | "tel"
    | "url"
    | "time"
    | "datetime-local"
    | "month"
    | "week";
  required?: boolean;
  accept?: string;
  value?: string | number;
  hidden?: boolean;
  placecholder?: string;
}

export const Input: Component<Props> = ({
  label,
  id,
  maxlength = 100,
  minlength = 0,
  type = "text",
  required = false,
  accept = "",
  value = "",
  hidden = false,
  min = "",
  max = "",
  placecholder = ""
}: Props) => {
  return (
    <div class="flex gap-2 flex-col mb-4" hidden={hidden}>
      <label for={id} class="text-base font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        maxlength={`${maxlength}`}
        minlength={`${minlength}`}
        min={min}
        max={max}
        type={type}
        class={inputClass}
        required={required}
        accept={accept}
        value={value}
        placeholder={placecholder}
      />
    </div>
  );
};

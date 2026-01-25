import { type Component } from "solid-js";

interface Props {
  label: string;
  active: boolean;
  href?: string;
}

export const ToggleButton: Component<Props> = ({
  label,
  active,
  href
}: Props) => {
  const inactiveButtonClass =
    "text-[#C10230] bg-white border-[#C10230] border-solid border-2 px-4 py-2 rounded-md flex cursor-pointer";
  const activeButtonClass =
    "text-white bg-[#C10230] px-4 py-2 rounded-md flex cursor-pointer";
  return (
    <>
      <a class={active ? activeButtonClass : inactiveButtonClass} href={href}>
        {label}
      </a>
    </>
  );
};

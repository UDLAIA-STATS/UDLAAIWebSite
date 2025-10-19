import { createSignal, type Component } from "solid-js";

interface Props {
  firstLabel: string;
  secondLabel: string;
  id: string;
}

export const ToggleButton: Component<Props> = ({
  firstLabel,
  secondLabel,
  id
}: Props) => {
  const inactiveButtonClass =
    "text-[#C10230] bg-white border-[#C10230] border-solid border-2 px-4 py-2 rounded-md flex cursor-pointer";
  const activeButtonClass =
    "text-white bg-[#C10230] px-4 py-2 rounded-md flex cursor-pointer";
  const [currentFilter, setFilter] = createSignal("jugador");
  return (
    <>
      <div class="flex flex-row gap-4">
        <button
          id={ currentFilter() === "jugador" ? id : "btn-jugador" }
          onClick={() => setFilter("jugador")}
          class={
            currentFilter() === "jugador"
              ? activeButtonClass
              : inactiveButtonClass
          }
        >
          {firstLabel}
        </button>
        <button
          id={ currentFilter() === "partidos" ? id : "btn-partidos" }
          onClick={() => setFilter("partidos")}
          class={
            currentFilter() === "partidos"
              ? activeButtonClass
              : inactiveButtonClass
          }
        >
          {secondLabel}
        </button>
      </div>
    </>
  );
};

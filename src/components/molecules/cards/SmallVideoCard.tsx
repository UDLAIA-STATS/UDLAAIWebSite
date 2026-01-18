import type { Component } from "solid-js";

interface Props {
  partido: string;
  fecha: string;
}

export const SmallVideoCard: Component<Props> = ({ partido, fecha }: Props) => {
  return (
    <div class="h-fit w-full bg-[#C10230] px-3 py-3 rounded-lg shadow-lg flex flex-col text-white cursor-pointer hover:bg-[#a10220] transition">
      <div class="flex flex-row gap-1">
        <span class="font-bold text-base">Partido:</span>
        <p class="text-base">{partido}</p>
      </div>
      <div class="flex flex-row gap-1">
        <span class="font-bold text-base">Fecha:</span>
        <p class="text-base">{fecha}</p>
      </div>
    </div>
  );
};

import {
  highlightedButtonClass,
  disabledButtonClass,
  privateRoutesMap,
  inputClass,
} from "@consts/index";
import { getAddHref, MatchOptionClient, matchOptions } from "@utils/index";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { createSignal, onMount, For, type Component } from "solid-js";

interface Props {
  options: matchOptions[];
}

export const PartidosButtons: Component<Props> = ({ options }: Props) => {
  const [filter, setFilter] = createSignal<matchOptions>(matchOptions.torneos);

  // onMount(async () => {
  //   const savedFilter = await MatchOptionClient.getFilter();
  //   await MatchOptionClient.setFilter(savedFilter);
  //   setFilter(savedFilter);
  // });

  const handleClick = async (match: matchOptions) => {
    await MatchOptionClient.setFilter(match);
    setFilter(match);
    window.dispatchEvent(new CustomEvent("partidos:filter-changed"));
  };

  const handleAddElement = async (option: matchOptions) => {
    const href =getAddHref(filter())
    await navigate(href);
  }

  return (
    <div class="flex flex-row flex-wrap justify-between gap-4">
      <div class="flex flex-wrap justify-between items-center gap-3 mb-5 w-fit">
        <div class="flex flex-row gap-2">
          <For each={options}>
            {(match) => (
              <button
                class={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${
                  match === filter()
                    ? highlightedButtonClass
                    : disabledButtonClass
                }`}
                onClick={() => handleClick(match)}
              >
                {match}
              </button>
            )}
          </For>
        </div>
      </div>
      <div class="flex h-fit">
        <button
          class={`px-4 py-2 rounded-md font-medium transition-all cursor-pointer ${disabledButtonClass}`}
          onclick={() => handleAddElement(filter())}
        >
          Agregar {filter()}
        </button>
      </div>
    </div>
  );
};

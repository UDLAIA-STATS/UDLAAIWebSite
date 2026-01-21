import type { TableContent } from "@interfaces/table-actions.interface";
import { For, type Component, type JSX } from "solid-js";

interface Props {
  headers: TableContent[];
  children?: JSX.Element;
}

export const Table: Component<Props> = ({ headers, children }: Props) => {
  return (
    <div class="relative overflow-x-auto min-w-7xl max-w-full mt-5 flex justify-center">
      <table class="table-auto border-collapse min-w-7xl max-w-full text-sm text-left rtl:text-right">
        <thead class="text-xs uppercase">
          <tr>
            <For each={headers}>
              {(header) =>
                header.isVisible === false ? null : (
                  <th scope="col" class="px-6 py-3">
                    {header.data}
                  </th>
                )
              }
            </For>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

import { privateRoutesMap } from "@consts/routes";
import { For, type Component, type JSX } from "solid-js";

const { AUTH_REGISTER, EDIT_USER } = privateRoutesMap;

interface Props {
  headers: string[];
  children?: JSX.Element;
}

export const Table: Component<Props> = ({
  headers,
  children,
}: Props) => {

  return (
    <div class="relative overflow-x-auto w-svw mt-5 flex justify-center">
      <table class="table-auto border-collapse w-7xl text-sm text-left rtl:text-right">
        <thead class="text-xs uppercase">
          <tr>
            <For each={headers} >    
              {(header) => <th scope="col" class="px-6 py-3">{header}</th>} 
            </For>
            
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

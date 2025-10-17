import EditIcon from "@assets/edit_icon_black.svg";
import DeleteIcon from "@assets/delete_icon_black.svg";
import { privateRoutesMap } from "@consts/routes";
import type { TableActions } from "@interfaces/table-actions.interface";
import { createSignal, type Component } from "solid-js";

const { AUTH_REGISTER, EDIT_USER } = privateRoutesMap;

interface Props {
  headers: string[];
  rows: string[][];
  hasActions?: boolean;
  actions?: TableActions[];
}

export const Table: Component<Props> = ({
  headers,
  rows,
  hasActions,
  actions,
}: Props) => {
  return (
    <div class="relative overflow-x-auto w-svw mt-5 flex justify-center">
      <table class="table-auto border-collapse w-7xl text-sm text-left rtl:text-right">
        <thead class="text-xs uppercase">
          <tr>
            {...headers.map((header) => (
              <th scope="col" class="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {...rows.map((row) => (
            <tr class="border-b">
              {...row.map((cell) => (
                <td class="px-6 py-4">
                  {cell}
                </td>
              ))}
              {hasActions &&
                actions &&
                actions.length > 0 &&
                actions.map((action) =>
                  action.type === "link" ? (
                    <td class="px-6 py-4">
                      <a class="cursor-pointer no-underline" href={action.href}>
                        <img
                          class="size-8"
                          src={action.icon}
                          alt={action.alt}
                        />
                      </a>
                    </td>
                  ) : (
                    action.action && (
                      <td class="px-6 py-4">
                        <button
                          class="cursor-pointer"
                          type="button"
                          onClick={action.action}
                        >
                          <img
                            class="size-8"
                            src={action.icon}
                            alt={action.alt}
                          />
                        </button>
                      </td>
                    )
                  )
                )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

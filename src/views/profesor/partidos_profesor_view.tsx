import {
  createSignal,
  createEffect,
  type Component,
  For,
  Show,
} from "solid-js";
import { highlightedButtonClass, disabledButtonClass } from "@consts/index";
import { Table } from "@components/tables/Table";
import type {
  User,
  Partido,
  Torneo,
  Temporada,
  Equipo,
} from "@interfaces/index";
import * as handlePartidos from "@utils/handle-partidos-table";

interface Props {
  user: User;
}

const PartidosProfesorView: Component<Props> = ({ user }: Props) => {
  // --- Estado del filtro activo y carga ---
  const [currentFilter, setFilter] = createSignal<handlePartidos.matchOptions>(
    handlePartidos.matchOptions.torneos
  );
  const [headers, setHeaders] = createSignal<string[]>([]);
  const [rows, setRows] = createSignal<any[][]>([]);
  const [loading, setLoading] = createSignal(false);

  // --- Datos simulados ---
  const torneos: Torneo[] = [
    {
      idtorneo: 1,
      nombretorneo: "Copa Nacional",
      descripciontorneo: "Torneo oficial de clubes",
    },
    { idtorneo: 2, nombretorneo: "Liga Amistosa" },
  ];

  const equipos: Equipo[] = [
    { idequipo: 1, nombreequipo: "Águilas FC" },
    { idequipo: 2, nombreequipo: "Tigres SC" },
    { idequipo: 3, nombreequipo: "Leones United" },
  ];

  const partidos: Partido[] = [
    {
      idpartido: 1,
      fechapartido: "2025-05-10",
      tipopartido: true,
      idequipolocal: { idequipo: 1, nombreequipo: "Águilas FC" },
      idequipovisitante: { idequipo: 2, nombreequipo: "Tigres SC" },
      marcadorequipolocal: 3,
      marcadorequipovisitante: 2,
    },
  ];

  const temporadas: Temporada[] = [
    {
      idtemporada: 1,
      nombretemporada: "Temporada 2025",
      tipotemporada: true,
      idtorneo: torneos[0],
    },
  ];

  // --- Sincronización automática al cambiar de filtro ---
  createEffect(() => {
    setLoading(true);
    const filter = currentFilter();
    setHeaders(handlePartidos.getHeaders(filter));
    setRows(
      handlePartidos.getRows(filter, torneos, partidos, temporadas, equipos)
    );
    setTimeout(() => setLoading(false), 250); // Simula carga para UX
  });

  // --- Acciones ---
  const handleDelete = (id: number) => {
    console.log(`${currentFilter()} con id ${id} eliminado`);
  };

  // --- Cambio de sección ---
  const handleSectionChange = (section: handlePartidos.matchOptions) => {
    setLoading(true);
    setTimeout(() => {
      setFilter(section);
      setLoading(false);
    }, 150);
  };

  return (
    <section class="flex flex-col w-svw max-w-7xl">
      {/* Subtítulo + Botón agregar */}
      <div class="flex flex-row justify-between items-center mb-4 w-full">
        <h2 class="text-2xl font-semibold capitalize">{currentFilter()}</h2>
        <a
          href={handlePartidos.getAddHref(currentFilter())}
          class="no-underline text-white bg-[#C10230] hover:bg-[#a10127] transition-all px-5 py-2 rounded-lg shadow-md"
        >
          {handlePartidos.getAddLabel(currentFilter())}
        </a>
      </div>

      {/* Filtros + Buscador */}
      <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div class="flex flex-row gap-2">
          <For each={Object.values(handlePartidos.matchOptions)}>
            {(match) => {
              return (
                <button
                  class={
                    currentFilter() === match
                      ? highlightedButtonClass
                      : disabledButtonClass
                  }
                  onClick={() => handleSectionChange(match)}
                >
                  {match}
                </button>
              );
            }}
          </For>
        </div>

        <div class="flex">
          <input
            type="search"
            placeholder={`Buscar ${currentFilter()}...`}
            class="rounded-md p-2 w-64 border border-gray-400 focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Contenido dinámico */}
      <Show
        when={!loading()}
        fallback={
          <p class="text-gray-500 mt-10">Cargando {currentFilter()}...</p>
        }
      >
        <Show
          when={rows().length > 0}
          fallback={
            <p class="text-gray-500 mt-10">No hay registros disponibles.</p>
          }
        >
          <div class="flex rounded-md border border-gray-200 w-full h-fit self-center">
            <Table headers={headers()}>
              <For each={rows()}>
                {(row) => (
                  <tr class="border-b odd:bg-gray-50 hover:bg-gray-100 transition-colors">
                    <For each={row}>
                      {(cell) => <td class="px-6 py-4">{cell}</td>}
                    </For>

                    <For
                      each={handlePartidos.getActions(
                        currentFilter(),
                        handleDelete
                      )}
                    >
                      {(action) =>
                        action.type === "link" ? (
                          <td class="px-6 py-4 text-start">
                            <a
                              class="cursor-pointer"
                              href={(action.href ?? "") + row[0]}
                              title={action.alt}
                            >
                              <img
                                class="size-6"
                                src={action.icon}
                                alt={action.alt}
                              />
                            </a>
                          </td>
                        ) : (
                          <td class="px-6 py-4 text-start">
                            <button
                              type="button"
                              onClick={() => handleDelete(Number(row[0]))}
                              class="cursor-pointer"
                              title={action.alt}
                            >
                              <img
                                class="size-6"
                                src={action.icon}
                                alt={action.alt}
                              />
                            </button>
                          </td>
                        )
                      }
                    </For>
                  </tr>
                )}
              </For>
            </Table>
          </div>
        </Show>
      </Show>
    </section>
  );
};

export default PartidosProfesorView;

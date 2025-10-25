import {
  createSignal,
  createEffect,
  type Component,
  For,
  Show,
} from "solid-js";
import { privateRoutesMap } from "@consts/routes";
import { Table } from "@components/tables/Table";
import type { TableActions } from "@interfaces/table-actions.interface";
import type { User } from "@interfaces/user.interface";
import type {
  Partido,
  Torneo,
  Temporada,
  Equipo,
} from "@interfaces/torneos.interface";
import EditIcon from "@assets/edit_icon_black.svg";
import DeleteIcon from "@assets/delete_icon_black.svg";

interface Props {
  user: User;
}

const PartidosProfesorView: Component<Props> = ({ user }: Props) => {
  const {
    EDITAR_EQUIPOS,
    EDITAR_PARTIDOS,
    EDITAR_TEMPORADAS,
    EDITAR_TORNEOS,
    CREAR_EQUIPOS,
    CREAR_PARTIDOS,
    CREAR_TEMPORADAS,
    CREAR_TORNEOS,
  } = privateRoutesMap;

  // --- Estado del filtro activo y carga ---
  const [currentFilter, setFilter] = createSignal<
    "torneos" | "partidos" | "temporadas" | "equipos"
  >("partidos");
  const [headers, setHeaders] = createSignal<string[]>([]);
  const [rows, setRows] = createSignal<any[][]>([]);
  const [loading, setLoading] = createSignal(false);

  // --- Clases de estilo ---
  const activeButtonClass =
    "bg-[#C10230] text-white border-2 border-[#C10230] rounded-md px-4 py-2 transition-all duration-200";
  const inactiveButtonClass =
    "bg-white text-[#C10230] border-2 border-[#C10230] rounded-md px-4 py-2 transition-all duration-200 hover:bg-[#C10230]/10";

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

  // --- Funciones dinámicas ---
  const getHeaders = (
    filter: "torneos" | "partidos" | "temporadas" | "equipos"
  ) => {
    switch (filter) {
      case "torneos":
        return ["ID", "Nombre", "Descripción", "Editar", "Eliminar"];
      case "partidos":
        return [
          "ID",
          "Fecha",
          "Local",
          "Visitante",
          "Marcador",
          "Tipo",
          "Editar",
          "Eliminar",
        ];
      case "temporadas":
        return ["ID", "Nombre", "Tipo", "Torneo", "Editar", "Eliminar"];
      case "equipos":
        return ["ID", "Nombre", "Editar", "Eliminar"];
    }
  };

  const getRows = (
    filter: "torneos" | "partidos" | "temporadas" | "equipos"
  ) => {
    switch (filter) {
      case "torneos":
        return torneos.map((t) => [
          t.idtorneo,
          t.nombretorneo,
          t.descripciontorneo ?? "-",
        ]);
      case "partidos":
        return partidos.map((p) => [
          p.idpartido,
          new Date(p.fechapartido).toLocaleDateString(),
          p.idequipolocal.nombreequipo,
          p.idequipovisitante.nombreequipo,
          `${p.marcadorequipolocal ?? 0} - ${p.marcadorequipovisitante ?? 0}`,
          p.tipopartido ? "Oficial" : "Amistoso",
        ]);
      case "temporadas":
        return temporadas.map((t) => [
          t.idtemporada,
          t.nombretemporada,
          t.tipotemporada ? "Oficial" : "Amistoso",
          t.idtorneo.nombretorneo,
        ]);
      case "equipos":
        return equipos.map((e) => [e.idequipo, e.nombreequipo]);
    }
  };

  // --- Sincronización automática al cambiar de filtro ---
  createEffect(() => {
    setLoading(true);
    const filter = currentFilter();
    setHeaders(getHeaders(filter));
    setRows(getRows(filter));
    setTimeout(() => setLoading(false), 250); // Simula carga para UX
  });

  // --- Acciones ---
  const handleDelete = (id: number) => {
    console.log(`${currentFilter()} con id ${id} eliminado`);
  };

  const deleteAction: TableActions = {
            action: handleDelete,
            icon: DeleteIcon.src,
            alt: "Eliminar",
            type: "button",
          };

  const getActions = (
    filter: "torneos" | "partidos" | "temporadas" | "equipos"
  ) => {
    switch (filter) {
      case "torneos":
        return [
          {
            href: `${CREAR_TORNEOS}`,
            icon: EditIcon.src,
            alt: "Editar",
            type: "link",
          },
          deleteAction,
        ];
      case "partidos":
        return [
          {
            href: `${CREAR_PARTIDOS}`,
            icon: EditIcon.src,
            alt: "Editar",
            type: "link",
          },
          deleteAction,
        ];
      case "temporadas":
        return [
          {
            href: `${CREAR_TEMPORADAS}`,
            icon: EditIcon.src,
            alt: "Editar",
            type: "link",
          },
          deleteAction,
        ];
      case "equipos":
        return [
          {
            href: `${CREAR_EQUIPOS}`,
            icon: EditIcon.src,
            alt: "Editar",
            type: "link",
          },
          deleteAction,
        ];
    }
  };

  // --- Botón de agregar dinámico ---
  const getAddLabel = () => {
    switch (currentFilter()) {
      case "torneos":
        return "Agregar Torneo";
      case "partidos":
        return "Agregar Partido";
      case "temporadas":
        return "Agregar Temporada";
      case "equipos":
        return "Agregar Equipo";
    }
  };

  const getAddHref = () => {
    switch (currentFilter()) {
      case "torneos":
        return CREAR_TORNEOS;
      case "partidos":
        return CREAR_PARTIDOS;
      case "temporadas":
        return CREAR_TEMPORADAS;
      case "equipos":
        return CREAR_EQUIPOS;
    }
  };

  // --- Cambio de sección ---
  const handleSectionChange = (
    section: "torneos" | "partidos" | "temporadas" | "equipos"
  ) => {
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
          href={getAddHref()}
          class="no-underline text-white bg-[#C10230] hover:bg-[#a10127] transition-all px-5 py-2 rounded-lg shadow-md"
        >
          {getAddLabel()}
        </a>
      </div>

      {/* Filtros + Buscador */}
      <div class="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div class="flex flex-row gap-2">
          <button
            class={
              currentFilter() === "torneos"
                ? activeButtonClass
                : inactiveButtonClass
            }
            onClick={() => handleSectionChange("torneos")}
          >
            Torneos
          </button>
          <button
            class={
              currentFilter() === "partidos"
                ? activeButtonClass
                : inactiveButtonClass
            }
            onClick={() => handleSectionChange("partidos")}
          >
            Partidos
          </button>
          <button
            class={
              currentFilter() === "equipos"
                ? activeButtonClass
                : inactiveButtonClass
            }
            onClick={() => handleSectionChange("equipos")}
          >
            Equipos
          </button>
          <button
            class={
              currentFilter() === "temporadas"
                ? activeButtonClass
                : inactiveButtonClass
            }
            onClick={() => handleSectionChange("temporadas")}
          >
            Temporadas
          </button>
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

                    <For each={getActions(currentFilter())}>
                      {(action) =>
                        action.type === "link" ? (
                          <td class="px-6 py-4 text-start">
                            <a
                              class="cursor-pointer"
                              href={action.href ?? "" + row[0]}
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

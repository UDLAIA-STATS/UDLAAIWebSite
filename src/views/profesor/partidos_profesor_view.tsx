import { createSignal, createEffect, type Component, For, Show } from "solid-js";
import { privateRoutesMap } from "@consts/routes";
import { Table } from "@components/tables/Table";
import type { TableActions } from "@interfaces/table-actions.interface";
import type { User } from "@interfaces/user.interface";
import type { Partido, Torneo, Temporada } from "@interfaces/torneos.interface";
import EditIcon from "@assets/edit_icon_black.svg";
import DeleteIcon from "@assets/delete_icon_black.svg";

interface Props {
  user: User;
}

const PartidosProfesorView: Component<Props> = ({ user }: Props) => {
  const { REGISTER_PLAYER, EDIT_PLAYER } = privateRoutesMap;

  // --- Estado del filtro activo y carga ---
  const [currentFilter, setFilter] = createSignal<"torneos" | "partidos" | "temporadas">("partidos");
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
    { idtorneo: 1, nombretorneo: "Copa Nacional", descripciontorneo: "Torneo oficial de clubes" },
    { idtorneo: 2, nombretorneo: "Liga Amistosa" },
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
  const getHeaders = (filter: "torneos" | "partidos" | "temporadas") => {
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
    }
  };

  const getRows = (filter: "torneos" | "partidos" | "temporadas") => {
    switch (filter) {
      case "torneos":
        return torneos.map((t) => [t.idtorneo, t.nombretorneo, t.descripciontorneo ?? "-"]);
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

  const actions: TableActions[] = [
    {
      href: `${EDIT_PLAYER}/`,
      icon: EditIcon.src,
      alt: "Editar",
      type: "link",
    },
    {
      action: handleDelete,
      icon: DeleteIcon.src,
      alt: "Eliminar",
      type: "button",
    },
  ];

  // --- Botón de agregar dinámico ---
  const getAddLabel = () => {
    switch (currentFilter()) {
      case "torneos":
        return "Agregar Torneo";
      case "partidos":
        return "Agregar Partido";
      case "temporadas":
        return "Agregar Temporada";
    }
  };

  const getAddHref = () => {
    switch (currentFilter()) {
      case "torneos":
        return "/torneos/nuevo";
      case "partidos":
        return REGISTER_PLAYER;
      case "temporadas":
        return "/temporadas/nueva";
    }
  };

  // --- Cambio de sección ---
  const handleSectionChange = (section: "torneos" | "partidos" | "temporadas") => {
    setLoading(true);
    setTimeout(() => {
      setFilter(section);
      setLoading(false);
    }, 150);
  };

  return (
    <section class="flex flex-col p-8 w-svw max-w-7xl">
      {/* Subtítulo + Botón agregar */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold capitalize">{currentFilter()}</h2>
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
            class={currentFilter() === "torneos" ? activeButtonClass : inactiveButtonClass}
            onClick={() => handleSectionChange("torneos")}
          >
            Torneos
          </button>
          <button
            class={currentFilter() === "partidos" ? activeButtonClass : inactiveButtonClass}
            onClick={() => handleSectionChange("partidos")}
          >
            Partidos
          </button>
          <button
            class={currentFilter() === "temporadas" ? activeButtonClass : inactiveButtonClass}
            onClick={() => handleSectionChange("temporadas")}
          >
            Temporadas
          </button>
        </div>

        <div class="relative">
          <input
            type="search"
            placeholder={`Buscar ${currentFilter()}...`}
            class="rounded-md p-2 w-64 pl-9 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C10230] transition-all"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Contenido dinámico */}
      <Show when={!loading()} fallback={<p class="text-gray-500 mt-10">Cargando {currentFilter()}...</p>}>
        <Show
          when={rows().length > 0}
          fallback={<p class="text-gray-500 mt-10">No hay registros disponibles.</p>}
        >
          <div class="relative shadow-sm rounded-lg border border-gray-200 w-full h-fit">
            <Table headers={headers()}>
              <For each={rows()}>
                {(row) => (
                  <tr class="border-b odd:bg-gray-50 hover:bg-gray-100 transition-colors">
                    <For each={row}>
                      {(cell) => <td class="px-6 py-4">{cell}</td>}
                    </For>

                    <For each={actions}>
                      {(action) =>
                        action.type === "link" ? (
                          <td class="px-6 py-4 text-center">
                            <a
                              class="cursor-pointer"
                              href={action.href ?? "" + row[0]}
                              title={action.alt}
                            >
                              <img class="size-6" src={action.icon} alt={action.alt} />
                            </a>
                          </td>
                        ) : (
                          <td class="px-6 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleDelete(Number(row[0]))}
                              class="cursor-pointer"
                              title={action.alt}
                            >
                              <img class="size-6" src={action.icon} alt={action.alt} />
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

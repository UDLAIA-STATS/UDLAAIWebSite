import { createSignal, type Component, Show, For } from "solid-js";
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

  // --- Estado del filtro activo ---
  const [currentFilter, setFilter] = createSignal<"torneos" | "partidos" | "temporadas">("partidos");

  // --- Clases del botón activo / inactivo ---
  const activeButtonClass =
    "bg-[#C10230] text-white border-2 border-[#C10230] rounded-md px-4 py-2";
  const inactiveButtonClass =
    "bg-white text-[#C10230] border-2 border-[#C10230] rounded-md px-4 py-2";

  // --- Datos simulados (mock) ---
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

  // --- Cabeceras y datos dinámicos ---
  const getHeaders = () => {
    switch (currentFilter()) {
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

  const getRows = () => {
    switch (currentFilter()) {
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

  // --- Acciones de tabla ---
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

  return (
    <>
      <div class="flex flex-row justify-between w-full items-center">
        <h1 class="font-bold text-2xl w-xl">Gestión de Torneos y Partidos</h1>

        <div class="flex flex-row gap-4 items-center">
          {/* Menú de selección */}
          <div class="flex flex-row gap-2">
            <button
              class={currentFilter() === "torneos" ? activeButtonClass : inactiveButtonClass}
              onClick={() => setFilter("torneos")}
            >
              Torneos
            </button>
            <button
              class={currentFilter() === "partidos" ? activeButtonClass : inactiveButtonClass}
              onClick={() => setFilter("partidos")}
            >
              Partidos
            </button>
            <button
              class={currentFilter() === "temporadas" ? activeButtonClass : inactiveButtonClass}
              onClick={() => setFilter("temporadas")}
            >
              Temporadas
            </button>
          </div>

          {/* Botón de agregar dinámico */}
          <a
            href={getAddHref()}
            class="no-underline text-[#C10230] bg-white border-[#C10230] border-solid border-2 px-4 py-2 rounded-md flex cursor-pointer items-center gap-2"
          >
            {getAddLabel()}
          </a>

          {/* Campo de búsqueda */}
          <input
            type="search"
            placeholder={`Buscar ${currentFilter()}...`}
            class="rounded-md p-2 w-60 focus:outline-none focus:ring-1 focus:ring-[#000] text-black border border-solid border-[#000]"
          />
        </div>
      </div>

      {/* Tabla dinámica */}
      <div class="relative overflow-x-auto w-svw mt-5 flex justify-center">
        <Table headers={getHeaders()}>
          <For each={getRows()}>
            {(row) => (
              <tr class="border-b">
                <For each={row}>{(cell) => <td class="px-6 py-4">{cell}</td>}</For>

                <For each={actions}>
                  {(action) =>
                    action.type === "link" ? (
                      <td class="px-6 py-4">
                        <a class="cursor-pointer no-underline" href={action.href ?? '' + row[0]}>
                          <img class="size-8" src={action.icon} alt={action.alt} />
                        </a>
                      </td>
                    ) : (
                      <td class="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(Number(row[0]))}
                          class="cursor-pointer"
                        >
                          <img class="size-8" src={action.icon} alt={action.alt} />
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
    </>
  );
};

export default PartidosProfesorView;

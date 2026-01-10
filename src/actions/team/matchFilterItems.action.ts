import { errorResponseSerializer, paginationResponseSerializer } from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getDataByFilter = defineAction({
  accept: "json",
  input: z.object({
    filter: z.string(), // 'torneos' | 'partidos' | 'temporadas' | 'equipos'
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ filter, page, pageSize }) => {
    const filterOption = filter.toLowerCase();
    const validFilters = ["torneos", "partidos", "temporadas", "equipos"];
    const baseUrl = import.meta.env.TEAMSERVICE_URL;

    if (!baseUrl) throw new Error("Variable de entorno TEAMSERVICE_URL no configurada");
    if (!validFilters.includes(filterOption)) throw new Error(`Filtro inválido: ${filterOption}`);

    const endpoint = `${baseUrl}/${encodeURIComponent(filterOption)}/all/?page=${page}&offset=${pageSize}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        const errorData = errorResponseSerializer(await response.json());
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(errorMessage || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = paginationResponseSerializer(data);

      return {
        [filterOption]: content.results,
        count: content.count,
        page: content.page,
        offset: content.offset,
        pages: content.pages
      };
    } catch (err) {
      console.error(`Error al obtener datos (${filterOption}):`, err);
      throw new Error("No se pudo obtener la información solicitada");
    }
  },
});

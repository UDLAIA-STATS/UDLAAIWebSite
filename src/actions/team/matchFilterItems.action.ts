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
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        [filterOption]: data.results,
        count: data.count,
        page: data.page,
        offset: data.offset,
        pages: data.pages
      };
    } catch (err) {
      console.error(`Error al obtener datos (${filterOption}):`, err);
      throw new Error("No se pudo obtener la información solicitada");
    }
  },
});



// import { defineAction } from "astro:actions";
// import { z } from "astro:schema";

// export const getDataByFilter = defineAction({
//   accept: "json",
//   input: z.object({
//     filter: z.string(), // 'torneos' | 'partidos' | 'temporadas' | 'equipos'
//   }),
//   handler: async ({ filter }) => {
//     const filterOption = filter.toLowerCase();
//     const baseUrl = import.meta.env.TEAMSERVICE_URL;

//     try {
//       let endpoint = "";
      

//       switch (filterOption) {
//         case "torneos":
//           endpoint = `${baseUrl}/torneos/all/`;
//           break;
//         case "partidos":
//           endpoint = `${baseUrl}/partidos/all/`;
//           break;
//         case "temporadas":
//           endpoint = `${baseUrl}/temporadas/all/`;
//           break;
//         case "equipos":
//           endpoint = `${baseUrl}/equipos/all/`;
//           break;
//         default:
//           throw new Error(`Filtro inválido: ${filterOption}`);
//       }

//       const response = await fetch(endpoint);
//       if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

//       const data = await response.json();
//       return { 
//         torneos: filterOption === "torneos" ? data : [],
//         partidos: filterOption === "partidos" ? data : [],
//         temporadas: filterOption === "temporadas" ? data : [],
//         equipos: filterOption === "equipos" ? data : [],
//        };
//     } catch (err) {
//       console.error(`Error al obtener datos (${filterOption}):`, err);
//       throw new Error("No se pudo obtener la información solicitada");
//     }
//   },
// });


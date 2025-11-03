import { matchOptions } from "@utils/handle-partidos-table";
import { match } from "assert";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import debug from "debug";

export const getDataByFilter = defineAction({
  accept: "json",
  input: z.object({
    filter: z.string(), // 'torneos' | 'partidos' | 'temporadas' | 'equipos'
  }),
  handler: async ({ filter }) => {
    const filterOption = filter.toLowerCase();
    const baseUrl = import.meta.env.TEAMSERVICE_URL;

    try {
      let responses: Record<string, any[]> = {};

        const endpoint = `${baseUrl}/${filterOption}/all/`;
        if (!endpoint) throw new Error(`Filtro inválido: ${filterOption}`);
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    
        const data = await response.json();
        responses[filter] = data;
          

        console.log(responses);
        
        return { 
        torneos: responses[matchOptions.torneos] ?? [],
        partidos: responses[matchOptions.partidos] ?? [],
        temporadas: responses[matchOptions.temporadas] ?? [],
        equipos: responses[matchOptions.equipos] ?? [],
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


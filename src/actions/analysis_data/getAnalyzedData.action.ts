import { paginationResponseSerializer, successResponseSerializer } from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import axios, { AxiosError } from "axios";

export const getAnalyzedData = defineAction({
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().nonnegative().optional().default(10),
    match_id: z.number().int().positive().optional(),
    player_id: z.number().int().positive().optional(),
  }),
  handler: async ({ page, limit, match_id, player_id }) => {
    const statsApi = import.meta.env.STATS_SERVICE;
    try {
      let endpoint = `${statsApi}/consolidated/?page=${page}&offset=${limit}`;
      if (player_id !== undefined) endpoint += `&player_id=${player_id}`;
      if (match_id !== undefined) endpoint += `&match_id=${match_id}`;

      const res = await axios.get(endpoint);

      return paginationResponseSerializer(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        const status = axiosError.response?.status;
        const message =
          axiosError.message ??
          axiosError.response?.data ??
          "Error desconocido del servicio de estadísticas.";

        throw new Error(
          `Error al obtener datos analizados (HTTP ${status ?? "N/A"}): ${message}`
        );
      }

      throw new Error(
        "Error inesperado al obtener los datos analizados. Intente nuevamente."
      );
    }
  },
});

export const getAnalyzedDetails = defineAction({
input: z.object({
id: z.number().int().positive(),
}),
handler: async ( { id } ) => {
  const statsApi = import.meta.env.STATS_SERVICE;
    try {
      let endpoint = `${statsApi}/consolidated/${id}/`;
      const res = await axios.get(endpoint);

      return successResponseSerializer(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        const status = axiosError.response?.status;
        const message =
          axiosError.message ??
          axiosError.response?.data ??
          "Error desconocido del servicio de estadísticas.";

        throw new Error(
          `Error al obtener datos analizados (HTTP ${status ?? "N/A"}): ${message}`
        );
      }

      throw new Error(
        "Error inesperado al obtener los datos analizados. Intente nuevamente."
      );
    }
},
});
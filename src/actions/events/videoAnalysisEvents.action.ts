import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import axios, { AxiosError } from "axios";

export const notifyVideoAnalysis = defineAction({
  input: z.object({
    video_name: z.string(),
    match_id: z.number().int().positive(),
  }),
  handler: async ({ video_name, match_id }) => {
    try {
      const kafkaApi = import.meta.env.KAFKA_SERVICE;
      const res = await axios.post(`${kafkaApi}/start-video-analysis/`, {
        video_name: video_name,
        match_id: match_id,
      });

      return {
        status: res.status,
        message: res.data.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        const status = axiosError.response?.status;
        const message =
          axiosError.message ??
          axiosError.response?.data ??
          "Error desconocido del servicio de estadísticas.";

        throw new Error(
          `Error al obtener datos analizados (HTTP ${status ?? "N/A"}): ${message}`,
        );
      }

      throw new Error(
        "Error inesperado al obtener los datos analizados. Intente nuevamente.",
      );
    }
  },
});

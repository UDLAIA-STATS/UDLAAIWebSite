import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const analyzeVideo = defineAction({
  input: z.object({
    key: z.string(),
    match_id: z.number().int().positive(),
  }),
  handler: async (input) => {
    try {
        const analysisApi = import.meta.env.ANALYSIS_API_URL;
        const response = await fetch(`${analysisApi}/analyze/run`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                video_name: input.key,
                match_id: input.match_id,
            }),
        });
        const result = await response.json();
        if (!response.ok) {
            const error = JSON.stringify(result.detail) || "Error al analizar el video.";
            throw new Error(error);
        }
        return {
            message: result.message,
            status: result.status,
        };
    } catch (error) {
      console.error(error);
      throw "Error al analizar el video, por favor intente nuevamente.";
    }
  },
});

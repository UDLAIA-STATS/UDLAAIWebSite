import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const notifyVideoUpload = defineAction({
  input: z.object({
    url: z.string().url(),
  }),
  handler: async ({ url }) => {
    try {
      if (
        url.trim() === "" ||
        !url.includes("http://") ||
        !url.includes("https://")
      ) {
        throw new Error(
          "La URL proporcionada es inválida, no se pudo notificar el envío del video."
        );
      }
      const karkaServiceUrl = import.meta.env.KAFKA_SERVICE;
      const health = await fetch(`${karkaServiceUrl}/health`, {
        method: "GET",
      });

      const healtStatus = await health.json();

      if (!health.ok || healtStatus.status !== "OK") {
        throw new Error(
          "El servicio de notificación no está disponible en este momento."
        );
      }

      const response = await fetch(`${karkaServiceUrl}/publish`, {
        method: "POST",
        body: JSON.stringify({
          video_url: url,
          metadata: {
            source: "web",
            priority: "normal",
          },
        }),
      });

      const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return {
        status: result.status,
    }

    } catch (err) {
      console.error("Error al notificar video subido:", err);
      throw err;
    }
  },
});

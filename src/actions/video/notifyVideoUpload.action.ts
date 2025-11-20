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
        !(url.startsWith("http://") ||
        url.startsWith("https://"))
      ) {
        throw new Error(
          "La URL proporcionada es inválida, no se pudo notificar el envío del video."
        );
      }
      const kafkaServiceUrl = import.meta.env.KAFKA_SERVICE;
      const health = await fetch(`${kafkaServiceUrl}/health`, {
        method: "GET",
      });

      const healtStatus = await health.json();

      if (!health.ok || healtStatus.status !== "ok") {
        throw new Error(
          "El servicio de notificación no está disponible en este momento."
        );
      }

      const response = await fetch(`${kafkaServiceUrl}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const error = JSON.stringify(result.detail) || "Error desconocido al notificar el video subido.";
      throw new Error(error);
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

import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import debug from "debug";

export const notifyVideoUpload = defineAction({
  input: z.object({
    url: z.string().url(),
  }),
  handler: async ({ url }) => {
    try {
      debug.log("Notificando video subido con URL:", url);
      if (
        url.trim() === "" ||
        !(url.startsWith("http://") ||
        url.startsWith("https://"))
      ) {
        debug.log("URL inválida proporcionada:", url);
        throw new Error(
          "La URL proporcionada es inválida, no se pudo notificar el envío del video."
        );
      }
      debug.log("URL válida, procediendo a notificar el servicio de Kafka.");
      const karkaServiceUrl = import.meta.env.KAFKA_SERVICE;
      const health = await fetch(`${karkaServiceUrl}/health`, {
        method: "GET",
      });
      debug.log("Respuesta de salud del servicio de notificación:", health);

      const healtStatus = await health.json();

      if (!health.ok || healtStatus.status !== "ok") {
        debug.log("El servicio de notificación no está disponible.");
        throw new Error(
          "El servicio de notificación no está disponible en este momento."
        );
      }

      debug.log("El servicio de notificación está disponible.");
      const response = await fetch(`${karkaServiceUrl}/publish`, {
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

      debug.log("Respuesta del servicio de notificación:", response);

      const result = await response.json();

      debug.log("Respuesta del servicio de notificación:", result);

    if (!response.ok) {
      debug.log("Error al notificar el video subido:", result);
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

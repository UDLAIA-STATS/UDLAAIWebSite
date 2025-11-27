import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import debug from "debug";

export const uploadVideo = defineAction({
  accept: "form",
  input: z.object({
    video: z.instanceof(File),
  }),
  handler: async ({ video }) => {
    try {
      const workerUrl = import.meta.env.WORKER_URL;

      const res = await fetch(workerUrl, {
        method: "POST",
        body: JSON.stringify({ filename: video.name }),
        headers: {
           "Access-Control-Allow-Headers": "content-range, content-type"
          }
      });

      if (!res.ok) {
        throw new Error("Error al comunicarse con Cloudflare.");
      }

      const { uploadUrl, objectKey } = await res.json();

      return {
        ok: true,
        uploadUrl,
        objectKey,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

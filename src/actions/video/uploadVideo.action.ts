import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import debug from "debug";
import axios from "axios";

export const uploadVideo = defineAction({
  input: z.object({
    video: z.instanceof(File),
    id_partido: z.number(),
    onProgress: z.function().args(z.number()).returns(z.void()).optional(),
  }),
  handler: async ({ video, id_partido, onProgress }) => {
    try {
      const uploadApi = import.meta.env.UPLOAD_SERVICE_URL;
      const formData = new FormData();
      formData.append("video", video);
      formData.append("id_partido", String(id_partido));

      const res = await axios.post(`${uploadApi}/upload/`, formData, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) onProgress(percentCompleted);
        },
      })

      if (!res.status || res.status !== 200) {
        throw new Error("Error al comunicarse con Cloudflare.");
      }

      const { key } = res.data;

      return {
        ok: true,
        key: key as string,
      };
    } catch (error) {
      console.error(error);
      throw "Error al subir el video, por favor intente nuevamente.";
    }
  },
});

import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import axios from "axios";

export const uploadVideo = defineAction({
  input: z.object({
    video: z.instanceof(File),
    id_partido: z.number(),
  }),
  handler: async ({ video, id_partido }) => {
    try {
      const uploadApi = import.meta.env.UPLOAD_SERVICE_URL;

      const formData = new FormData();
      formData.append("video", video);
      formData.append("id_partido", String(id_partido));

      const res = await axios.post(`${uploadApi}/upload/`, formData);

      return {
        ok: true,
        key: res.data.key as string,
      };
    } catch (err) {
      console.error(err);
      throw new Error("Error al subir el video, por favor intente nuevamente.");
    }
  },
});

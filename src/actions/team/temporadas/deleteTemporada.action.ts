import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteTemporada = defineAction({
  input: z.object({
    idtemporada: z.number().int().positive(),
  }),
  handler: async ({ idtemporada }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/${idtemporada}/delete/`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error ${res.status}: ${res.statusText}`
        );
      }
      const response = await res.json();
      return { data: response.message };
    } catch (err) {
      console.error(`Error al eliminar temporada ${idtemporada}:`, err);
      throw err;
    }
  },
});

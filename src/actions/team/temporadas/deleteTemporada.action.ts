import {
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/serializers";
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
        const errorData = errorResponseSerializer(await res.json());
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(errorMessage || `Error ${res.status}: ${res.statusText}`);
      }
      const response = successResponseSerializer(await res.json());
      return response;
    } catch (err) {
      console.error(`Error al eliminar temporada ${idtemporada}:`, err);
      throw err;
    }
  },
});

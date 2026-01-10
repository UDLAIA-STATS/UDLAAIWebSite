import {
  errorResponseSerializer,
  successResponseSerializer,
  torneoSerializer,
} from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteTorneo = defineAction({
  input: z.object({
    idtorneo: z.number().int().positive("El ID debe ser positivo"),
  }),
  handler: async ({ idtorneo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${idtorneo}/delete/`, {
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

      const data = successResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error(`Error al eliminar torneo ${idtorneo}:`, err);
      throw new Error(
        "No se puede eliminar el torneo, posiblemente tiene temporadas o partidos asociados."
      );
    }
  },
});

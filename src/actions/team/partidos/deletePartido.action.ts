import { errorResponseSerializer, partidoSerializer } from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deletePartido = defineAction({
  input: z.object({ idpartido: z.number().int().positive() }),
  handler: async ({ idpartido }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/${idpartido}/delete/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = partidoSerializer(errorData);
        throw new Error(errorMessage || errorResponseSerializer(errorData).error || `Error ${res.status}: ${res.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar partido ID ${idpartido}:`, error);
      throw new Error("No se pudo eliminar el partido (posiblemente asociado a torneos)");
    }
  },
});

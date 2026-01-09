import { equipoSerializer, errorResponseSerializer, successResponseSerializer } from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteEquipo = defineAction({
  input: z.object({ idequipo: z.number().int().positive() }),
  handler: async ({ idequipo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/${idequipo}/delete/`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = equipoSerializer(errorData);
        if (!errorMessage) {
          const errorResults = errorResponseSerializer(errorData);
          errorMessage = errorResults.data ? errorResults.data.join("\n") : errorResults.error;
        }
        throw new Error(errorMessage || `Error ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return successResponseSerializer(json);
    } catch (error) {
      console.error(`Error al eliminar equipo con ID ${idequipo}:`, error);
      throw new Error("No se pudo eliminar el equipo (puede estar asociado a partidos)");
    }
  },
});

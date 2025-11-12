import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteEquipo = defineAction({
  input: z.object({ idequipo: z.number().int().positive() }),
  handler: async ({ idequipo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/${idequipo}/delete/`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar equipo con ID ${idequipo}:`, error);
      throw new Error("No se pudo eliminar el equipo (puede estar asociado a partidos)");
    }
  },
});

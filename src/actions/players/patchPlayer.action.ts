import { defineAction } from "astro:actions";
import { jugadorUpdateSchema } from "./playerSchemas";

export const updateJugador = defineAction({
  accept: "form",
  input: jugadorUpdateSchema,
  handler: async ({ idjugador, ...updates }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(
        `${baseUrl}/jugadores/${idjugador}/update/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar jugador");
      }
      const resp = await response.json();
      return { data: resp };
    } catch (error) {
      console.error(`Error al actualizar el:`, error);
      throw error;
    }
  },
});

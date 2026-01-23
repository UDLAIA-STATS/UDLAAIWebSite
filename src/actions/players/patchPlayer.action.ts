import { defineAction } from "astro:actions";
import { jugadorUpdateSchema } from "./playerSchemas";
import { errorResponseSerializer, successResponseSerializer } from "@utils/serializers";

export const updateJugador = defineAction({
   
  accept: "form",
  input: jugadorUpdateSchema,
  handler: async (updates) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      if (!!!updates.imagenjugador) {
        delete updates.imagenjugador;
      }
      const response = await fetch(
        `${baseUrl}/jugadores/${updates.idjugador}/update/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        const errorData = errorResponseSerializer(await response.json());
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(errorMessage || "Error al actualizar el jugador");
      }
      const data = successResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error(`Error al actualizar el jugador:`, error);
      throw error;
    }
  },
});

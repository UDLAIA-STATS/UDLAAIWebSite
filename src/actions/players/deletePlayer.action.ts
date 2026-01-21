import {
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteJugador = defineAction({
  input: z.object({ idJugador: z.string() }),
  handler: async ({ idJugador }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(
        `${baseUrl}/jugadores/${idJugador}/delete/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = errorResponseSerializer(await response.json());
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(
          errorMessage || `Error ${response.status}: ${response.statusText}`
        );
      }
      const data = successResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error(`Error al eliminar el jugador:`, error);
      throw new Error(
        "No se pudo eliminar el jugador. Verifique dependencias o intente más tarde."
      );
    }
  },
});

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
      if (!response.ok)
        throw new Error(
          "Error al eliminar jugador (puede estar asociado a un equipo)"
        );
      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar el jugador:`, error);
      throw new Error(
        "No se pudo eliminar el jugador. Verifique dependencias o intente más tarde."
      );
    }
  },
});

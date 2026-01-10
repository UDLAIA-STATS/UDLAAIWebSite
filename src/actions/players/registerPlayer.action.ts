// src/actions/jugadores.ts
import { defineAction } from "astro:actions";
import { jugadorSchema } from "./playerSchemas";
import {
  errorResponseSerializer,
  jugadorSerializer,
  successResponseSerializer,
} from "@utils/serializers";

export const createJugador = defineAction({
  accept: "form",
  input: jugadorSchema,
  handler: async (formData) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      if (!!!formData.imagenjugador) {
        delete formData.imagenjugador;
      }
      const response = await fetch(`${baseUrl}/jugadores/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = errorResponseSerializer(await response.json());
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        console.log("Error al crear jugador:", errorData);

        throw new Error(errorMessage || "Error al crear jugador");
      }
      const data = successResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error("Error al crear el jugador:", error);
      throw error;
    }
  },
});

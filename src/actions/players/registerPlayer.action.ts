// src/actions/jugadores.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Player } from "@interfaces/player.interface";
import { jugadorSchema, jugadorUpdateSchema } from "./playerSchemas";
import { errorResponseSerializer, jugadorSerializer, successResponseSerializer } from "@utils/serializers";

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
        const errorData = await response.json();
        let errorMessage;
        errorMessage = jugadorSerializer(errorData);
        
        if (!errorMessage) {
          const errorResults: string[] = errorResponseSerializer(errorData).data;
          errorMessage = errorResults.join("<br/>");
        }
        
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

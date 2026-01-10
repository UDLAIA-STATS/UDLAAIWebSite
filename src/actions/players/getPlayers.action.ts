import type { Player } from "@interfaces/index";
import {
  errorResponseSerializer,
  paginationResponseSerializer,
  successResponseSerializer,
} from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getJugadores = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ page, pageSize }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(
        `${baseUrl}/jugadores/all/?page=${page}&offset=${pageSize}`
      );
      if (!response.ok) {
        const error = errorResponseSerializer(await response.json());
        let errorMessage = error.error;
        if (error.data) {
          errorMessage = error.data;
        }
        throw new Error(errorMessage);
      }
      const data = paginationResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error("Error en getJugadores:", error);
      throw new Error(
        "No se pudieron obtener los jugadores. Intente nuevamente más tarde."
      );
    }
  },
});

export const getJugadorByBanner = defineAction({
  accept: "json",
  input: z.object({ idJugador: z.string() }),
  handler: async ({ idJugador }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(`${baseUrl}/jugadores/${idJugador}/`);
      if (!response.ok) {
        const error = errorResponseSerializer(await response.json());
        let errorMessage = error.error;
        if (error.data) {
          errorMessage = error.data;
        }
        throw new Error(errorMessage);
      }
      const data = successResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error(`Error al obtener el jugador (ID: ${idJugador}):`, error);
      throw new Error("No se pudo obtener la información del jugador.");
    }
  },
});

export const getJugadorById = defineAction({
  accept: "json",
  input: z.object({ idjugador: z.number().int().positive() }),
  handler: async ({ idjugador }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(`${baseUrl}/jugadores/id/${idjugador}/`);
      if (!response.ok) {
        const error = errorResponseSerializer(await response.json());
        let errorMessage = error.error;
        if (error.data) {
          errorMessage = error.data;
        }
        throw new Error(errorMessage);
      }
      const data = successResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error(`Error al obtener el jugador (ID: ${idjugador}):`, error);
      throw new Error("No se pudo obtener la información del jugador.");
    }
  },
});

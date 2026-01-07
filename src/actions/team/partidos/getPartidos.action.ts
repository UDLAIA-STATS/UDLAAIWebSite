import type { Partido } from "@interfaces/index";
import { errorResponseSerializer, paginationResponseSerializer, partidoSerializer, successResponseSerializer } from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import debug from "debug";

export const getPartidos = defineAction({
  accept: "json",
    input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ page, pageSize }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/all/?page=${page}&offset=${pageSize}`);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = partidoSerializer(errorData);
        throw new Error(errorMessage || errorResponseSerializer(errorData).error || `Error ${res.status}: ${res.statusText}`);
      };
      const data = paginationResponseSerializer(await res.json());
      console.log('Datos obtenidos de partido' + data)
      return data;
    } catch (err) {
      console.error("Error al obtener partidos:", err);
      throw new Error(err instanceof Error ? err.message : "No se pudo obtener la lista de partidos");
    }
  },
});

// Obtener partido por ID
export const getPartidoById = defineAction({
  accept: "json",
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/${id}/`);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = partidoSerializer(errorData);
        throw new Error(errorMessage || errorResponseSerializer(errorData).error || `Error ${res.status}: ${res.statusText}`);
      }
      const data = successResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error(`Error al obtener partido ID ${id}:`, err);
      throw new Error("No se pudo obtener el partido");
    }
  },
});
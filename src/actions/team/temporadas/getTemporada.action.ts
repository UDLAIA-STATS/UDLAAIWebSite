import type { Temporada } from "@interfaces/torneos.interface";
import {
  errorResponseSerializer,
  paginationResponseSerializer,
  successResponseSerializer,
  temporadaSerializer,
} from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getTemporadas = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ page, pageSize }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(
        `${baseUrl}/temporadas/all/?page=${page}&offset=${pageSize}`
      );
      if (!res.ok) {
        const errorData = errorResponseSerializer(await res.json());
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(errorMessage || `Error ${res.status}: ${res.statusText}`);
      }

      
      const data = paginationResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error("Error al obtener temporadas:", err);
      throw new Error("No se pudo obtener la lista de temporadas");
    }
  },
});

export const getTemporadaById = defineAction({
  accept: "json",
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/${id}/`);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = temporadaSerializer(errorData);
        throw new Error(
          errorMessage ||
            errorResponseSerializer(errorData).error ||
            `Error ${res.status}: ${res.statusText}`
        );
      }
      const data = successResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error(`Error al obtener temporada ${id}:`, err);
      throw new Error("No se pudo obtener la temporada");
    }
  },
});

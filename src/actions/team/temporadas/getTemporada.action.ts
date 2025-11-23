import type { Temporada } from "@interfaces/torneos.interface";
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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error ${res.status}: ${res.statusText}`
        );
      };
      const data = await res.json();
      const content = data.data;
      return {
        count: content.count,
        page: content.page,
        offset: content.offset,
        pages: content.pages,
        data: content.results as Temporada[],
      };
    } catch (err) {
      console.error("Error al obtener temporadas:", err);
      throw new Error("No se pudo obtener la lista de temporadas");
    }
  },
});

// ✅ Obtener temporada por ID
export const getTemporadaById = defineAction({
  accept: "json",
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/${id}/`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return { data: data.data as Temporada };
    } catch (err) {
      console.error(`Error al obtener temporada ${id}:`, err);
      throw new Error("No se pudo obtener la temporada");
    }
  },
});
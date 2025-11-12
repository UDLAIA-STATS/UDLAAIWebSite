import type { Torneo } from "@interfaces/index";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getTorneos = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ page, pageSize }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/all/?page=${page}&offset=${pageSize}`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      return { 
        count: data.count,
        page: data.page,
        offset: data.offset,
        pages: data.pages,
        data: data.results as Torneo[]
       };
    } catch (err) {
      console.error("Error al obtener torneos:", err);
      throw new Error("No se pudo obtener la lista de torneos");
    }
  },
});

// === Obtener torneo por ID ===
export const getTorneoById = defineAction({
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${id}/`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = (await res.json()) as Torneo;
      return { data };
    } catch (err) {
      console.error(`Error al obtener torneo ID ${id}:`, err);
      throw new Error("No se pudo obtener el torneo");
    }
  },
});

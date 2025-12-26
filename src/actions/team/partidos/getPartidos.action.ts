import type { Partido } from "@interfaces/index";
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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      };
      const data = await res.json();
      const content = data.data;
      console.log('Datos obtenidos de partido' + data)
      debug.log('Datos obtenidos de partido' + data)
      return { 
        count: content.count,
        page: content.page,
        offset: content.offset,
        pages: content.pages,
        data: content.results as Partido[]
       };
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
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      return { 
        mensaje: data.mensaje,
        status: data.status,
        data: data.data as Partido
       };
    } catch (err) {
      console.error(`Error al obtener partido ID ${id}:`, err);
      throw new Error("No se pudo obtener el partido");
    }
  },
});
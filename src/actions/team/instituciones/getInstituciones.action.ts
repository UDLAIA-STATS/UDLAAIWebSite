import type { Institucion } from "@interfaces/torneos.interface";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import debug from "debug";

export const getInstituciones = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
    handler: async ({ page, pageSize }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/instituciones/all/?page=${page}&offset=${pageSize}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      };
      const data = await res.json();
      const content = data.data;
      console.log('Datos obtenidos de instituciones' + data)
      debug.log('Datos obtenidos de instituciones' + data)
      return { 
        count: content.count,
        page: content.page,
        offset: content.offset,
        pages: content.pages,
        data: content.results as Institucion[]
       };
    } catch (err) {
      console.error("Error al obtener instituciones:", err);
      throw new Error(err instanceof Error ? err.message : "No se pudo obtener la lista de instituciones");
    }
  }
});
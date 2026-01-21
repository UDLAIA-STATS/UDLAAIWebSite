import { errorResponseSerializer, paginationResponseSerializer } from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

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
        const errorData = await res.json();
        const errorMessage = errorResponseSerializer(errorData);
        throw new Error(errorMessage.error || `Error ${res.status}: ${res.statusText}`);
      };
      const data = paginationResponseSerializer(await res.json());
      console.log('Datos obtenidos de instituciones' + data)
      return data;
    } catch (err) {
      console.error("Error al obtener instituciones:", err);
      throw new Error(err instanceof Error ? err.message : "No se pudo obtener la lista de instituciones");
    }
  }
});
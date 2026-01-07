import type { Torneo } from "@interfaces/index";
import {
  errorResponseSerializer,
  paginationResponseSerializer,
  successResponseSerializer,
  torneoSerializer,
} from "@utils/serializers";
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
      const res = await fetch(
        `${baseUrl}/torneos/all/?page=${page}&offset=${pageSize}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = torneoSerializer(errorData);
        throw new Error(
          errorMessage ||
            errorResponseSerializer(errorData).error ||
            `Error ${res.status}: ${res.statusText}`
        );
      }
      const data = paginationResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error("Error al obtener torneos:", err);
      throw new Error("No se pudo obtener la lista de torneos");
    }
  },
});

export const getTorneoById = defineAction({
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${id}/`);
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = torneoSerializer(errorData);
        throw new Error(
          errorMessage ||
            errorResponseSerializer(errorData).error ||
            `Error ${res.status}: ${res.statusText}`
        );
      }
      const data = successResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error(`Error al obtener torneo ID ${id}:`, err);
      throw new Error("No se pudo obtener el torneo");
    }
  },
});

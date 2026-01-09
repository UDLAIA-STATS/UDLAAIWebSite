import type { Equipo } from "@interfaces/index";
import { equipoSerializer, errorResponseSerializer, paginationResponseSerializer, successResponseSerializer } from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const getEquipos = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ page, pageSize }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/all/?page=${page}&offset=${pageSize}`);
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = equipoSerializer(errorData);
        if (!errorMessage) {
          errorMessage = errorResponseSerializer(errorData).error;
        }
        throw new Error(errorMessage || `Error ${response.status}: ${response.statusText}`);
      };
      const paginationData = paginationResponseSerializer(await response.json());
      return paginationData;
    } catch (error) {
      console.error("Error al obtener equipos:", error);
      throw new Error("No se pudo obtener la lista de equipos");
    }
  },
});

// Obtener equipo por ID
export const getEquipoById = defineAction({
  accept: "json",
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/${id}/`, { method: "GET" });
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = successResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error(`Error al obtener equipo con ID ${id}:`, error);
      throw new Error("No se pudo obtener el equipo solicitado");
    }
  },
});

// Buscar equipo por nombre
export const getEquipoByName = defineAction({
  accept: "json",
  input: z.object({ nombre: z.string().min(2).max(250) }),
  handler: async ({ nombre }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/search/${nombre}/`);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = equipoSerializer(errorData);
        throw new Error(errorMessage || errorResponseSerializer(errorData).error || `Error ${response.status}: ${response.statusText}`);
      };
      const data = successResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error(`Error al buscar equipo con nombre ${nombre}:`, error);
      throw new Error("No se pudo obtener el equipo solicitado");
    }
  },
});
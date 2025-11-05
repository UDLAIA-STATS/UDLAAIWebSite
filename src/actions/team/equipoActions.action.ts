// src/actions/equipos.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Equipo } from "@interfaces/torneos.interface";

// === Esquemas de validación ===
const equipoSchema = z.object({
  idinstitucion: z.number().int().positive("Debe asociarse una institución"),
  nombreequipo: z.string().min(2, "El nombre es muy corto").max(250, "El nombre es muy largo"),
  imagenequipo: z.string().optional().nullable(), // BinaryField → base64 string o null
  equipoactivo: z.boolean().optional(),
});

const equipoUpdateSchema = z.object({
  idequipo: z.number().int().positive("El ID debe ser positivo"),
  nombreequipo: z.string().min(2).max(250).optional(),
  idinstitucion: z.number().int().positive().optional(),
  imagenequipo: z.string().optional().nullable(),
  equipoactivo: z.boolean().optional(),
});

// === Actions ===

// Obtener todos los equipos
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
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return {
        count: data.count,
        page: data.page,
        offset: data.offset,
        pages: data.pages,
        data: data.results as Equipo[],
      };
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
      const response = await fetch(`${baseUrl}/equipos/${id}/`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return { data: data as Equipo };
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
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return { data: data as Equipo[] };
    } catch (error) {
      console.error(`Error al buscar equipo con nombre ${nombre}:`, error);
      throw new Error("No se pudo obtener el equipo solicitado");
    }
  },
});

// Crear nuevo equipo
export const createEquipo = defineAction({
  accept: "form",
  input: equipoSchema,
  handler: async ({ idinstitucion, nombreequipo, imagenequipo, equipoactivo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idinstitucion: idinstitucion,
          nombreequipo: nombreequipo,
          imagenequipo: imagenequipo ?? null,
          equipoactivo: equipoactivo ?? true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data as Equipo };
    } catch (error) {
      console.error("Error al crear equipo:", error);
      throw new Error("No se pudo crear el equipo");
    }
  },
});

// Actualizar equipo
export const updateEquipo = defineAction({
  accept: "form",
  input: equipoUpdateSchema,
  handler: async ({ idequipo, nombreequipo, idinstitucion, imagenequipo, equipoactivo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/api/equipos/${idequipo}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreequipo,
          idinstitucion,
          imagenequipo,
          equipoactivo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data as Equipo };
    } catch (error) {
      console.error(`Error al actualizar equipo con ID ${idequipo}:`, error);
      throw new Error("No se pudo actualizar el equipo");
    }
  },
});

// Eliminar equipo
export const deleteEquipo = defineAction({
  input: z.object({ idequipo: z.number().int().positive() }),
  handler: async ({ idequipo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/api/equipos/${idequipo}/delete/`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar equipo con ID ${idequipo}:`, error);
      throw new Error("No se pudo eliminar el equipo (puede estar asociado a partidos)");
    }
  },
});

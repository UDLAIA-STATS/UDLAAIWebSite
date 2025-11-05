import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Partido } from "@interfaces/torneos.interface";
import debug from "debug";

// === Esquemas de validación ===
const partidoSchema = z.object({
  fechapartido: z.string(), // ISO date
  idequipolocal: z.number().int().positive(),
  idequipovisitante: z.number().int().positive(),
  idtorneo: z.number().int().positive(),
  idtemporada: z.number().int().positive(),
  marcadorequipolocal: z.number().int().nonnegative().optional().nullable(),
  marcadorequipovisitante: z.number().int().nonnegative().optional().nullable(),
});

const partidoUpdateSchema = partidoSchema.extend({
  idpartido: z.number().int().positive(),
});

// === Actions ===

// Obtener todos los partidos
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
      console.log('Datos obtenidos de partido' + data)
      debug.log('Datos obtenidos de partido' + data)
      return { 
        count: data.count,
        page: data.page,
        offset: data.offset,
        pages: data.pages,
        data: data.results as Partido[]
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
      return { data: data as Partido };
    } catch (err) {
      console.error(`Error al obtener partido ID ${id}:`, err);
      throw new Error("No se pudo obtener el partido");
    }
  },
});

// Crear partido
export const createPartido = defineAction({
  accept: "form",
  input: partidoSchema,
  handler: async ({ fechapartido, idequipolocal, idequipovisitante, idtorneo, idtemporada, marcadorequipolocal, marcadorequipovisitante }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechapartido: fechapartido,
          idequipolocal: idequipolocal,
          idequipovisitante: idequipovisitante,
          idtorneo: idtorneo,
          idtemporada: idtemporada,
          marcadorequipolocal: marcadorequipolocal ?? null,
          marcadorequipovisitante: marcadorequipovisitante ?? null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return { data: data as Partido };
    } catch (err) {
      console.error("Error al crear partido:", err);
      throw new Error(err instanceof Error ? err.message : "No se pudo crear el partido");
    }
  },
});

// Actualizar partido
export const updatePartido = defineAction({
  accept: "form",
  input: partidoUpdateSchema,
  handler: async (payload) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/${payload.idpartido}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return { data: data as Partido };
    } catch (err) {
      console.error(`Error al actualizar partido ${payload.idpartido}:`, err);
      throw new Error("No se pudo actualizar el partido");
    }
  },
});

// Eliminar partido
export const deletePartido = defineAction({
  input: z.object({ idpartido: z.number().int().positive() }),
  handler: async ({ idpartido }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/${idpartido}/delete/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar partido ID ${idpartido}:`, error);
      throw new Error("No se pudo eliminar el partido (posiblemente asociado a torneos)");
    }
  },
});

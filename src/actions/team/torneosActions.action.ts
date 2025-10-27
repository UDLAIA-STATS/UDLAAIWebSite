import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Torneo } from "@interfaces/torneos.interface";

const torneoSchema = z.object({
  nombretorneo: z.string().min(2).max(100),
  descripciontorneo: z.string().max(255).optional(),
});

const torneoUpdateSchema = z.object({
  idtorneo: z.number().int().positive(),
  nombretorneo: z.string().min(2).max(100).optional(),
  descripciontorneo: z.string().max(255).optional(),
});

// Obtener todos los torneos
export const getTorneos = defineAction({
  accept: "json",
  handler: async () => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/all/`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Torneo[] };
    } catch (err) {
      console.error("Error al obtener torneos:", err);
      throw new Error("No se pudo obtener la lista de torneos");
    }
  },
});

// Obtener torneo por ID
export const getTorneoById = defineAction({
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${id}/`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Torneo };
    } catch (err) {
      console.error(`Error al obtener torneo ID ${id}:`, err);
      throw new Error("No se pudo obtener el torneo");
    }
  },
});

// Crear torneo
export const createTorneo = defineAction({
  accept: "form",
  input: torneoSchema,
  handler: async ({ nombretorneo, descripciontorneo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nombretorneo: nombretorneo, 
          descripciontorneo: descripciontorneo }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Torneo };
    } catch (err) {
      console.error("Error al crear torneo:", err);
      throw new Error("No se pudo crear el torneo");
    }
  },
});

// Actualizar torneo
export const updateTorneo = defineAction({
  accept: "form",
  input: torneoUpdateSchema,
  handler: async ({ idtorneo, nombretorneo, descripciontorneo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${idtorneo}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nombretorneo: nombretorneo, 
          descripciontorneo: descripciontorneo
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Torneo };
    } catch (err) {
      console.error(`Error al actualizar torneo ${idtorneo}:`, err);
      throw new Error("No se pudo actualizar el torneo");
    }
  },
});

export const deleteTorneo = defineAction({
  input: z.number().int().positive(),
  handler: async ( input ) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${input}/delete/`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      };
      return { data: (await res.json()) as Torneo };
    } catch (err) {
      console.error(`Error al eliminar torneo ${input}:`, err);
      throw new Error("No se puede eliminar el torneo, posiblemente tiene temporadas o partidos asociados.");
    }
  },
});

import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Temporada } from "@interfaces/torneos.interface";

const temporadaSchema = z.object({
  nombretemporada: z.string().min(2).max(100),
  tipotemporada: z.boolean(),
  idtorneo: z.number().int().positive(),
});

const temporadaUpdateSchema = temporadaSchema.extend({
  idtemporada: z.number().int().positive(),
});

// Obtener todas las temporadas
export const getTemporadas = defineAction({
  accept: "json",
  handler: async () => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/all/`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Temporada[] };
    } catch (err) {
      console.error("Error al obtener temporadas:", err);
      throw new Error("No se pudo obtener la lista de temporadas");
    }
  },
});

// Obtener temporada por ID
export const getTemporadaById = defineAction({
  accept: "json",
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/${id}/`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Temporada };
    } catch (err) {
      console.error(`Error al obtener temporada ${id}:`, err);
      throw new Error("No se pudo obtener la temporada");
    }
  },
});

// Crear temporada
export const createTemporada = defineAction({
  accept: "form",
  input: temporadaSchema,
  handler: async ({ idtorneo, nombretemporada, tipotemporada }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idtorneo: idtorneo,
          nombretemporada: nombretemporada,
          tipotemporada: tipotemporada,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Temporada };
    } catch (err) {
      console.error("Error al crear temporada:", err);
      throw new Error("No se pudo crear la temporada");
    }
  },
});

// Actualizar temporada
export const updateTemporada = defineAction({
  accept: "form",
  input: temporadaUpdateSchema,
  handler: async ({
    idtemporada,
    idtorneo,
    nombretemporada,
    tipotemporada,
  }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/${idtemporada}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idtorneo: idtorneo,
          nombretemporada: nombretemporada,
          tipotemporada: tipotemporada,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Temporada };
    } catch (err) {
      console.error(
        `Error al actualizar temporada ${idtemporada}:`,
        err
      );
      throw new Error("No se pudo actualizar la temporada");
    }
  },
});

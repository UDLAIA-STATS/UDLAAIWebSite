import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Equipo, Partido } from "@interfaces/torneos.interface";
import { tomorrowDate } from "@utils/dates";


const partidoSchema = z.object({
  fechapartido: z.string(),
  tipopartido: z.boolean(),
  idequipolocal: z.number().int().positive(),
  idequipovisitante: z.number().int().positive(),
  marcadorequipolocal: z.number().int().nonnegative().optional(),
  marcadorequipovisitante: z.number().int().nonnegative().optional(),
});

const partidoUpdateSchema = partidoSchema.extend({
  idpartido: z.number().int().positive(),
});

// Obtener todos los partidos
export const getPartidos = defineAction({
  accept: "json",
  handler: async () => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/all/`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Partido[] };
    } catch (err) {
      console.error("Error al obtener partidos:", err);
      throw new Error("No se pudo obtener la lista de partidos");
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
      const res = await fetch(`${baseUrl}/partidos/${id}`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Partido };
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
  handler: async (payload) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      return { data: data.partido as Partido };
    } catch (err) {
      console.error("Error al crear partido:", err);
      throw new Error("No se pudo crear el partido");
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
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      console.log("Partido update response data:", data);
      return { data: data.partido as Partido };
    } catch (err) {
      console.error(`Error al actualizar partido ${payload.idpartido}:`, err);
      throw new Error("No se pudo actualizar el partido");
    }
  },
});

export const deletePartido = defineAction({
  input: z.number().int().positive(),
  handler: async ( input ) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/partidos/${input}/delete/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      return { data: (await response.json()) as Partido };
    } catch (error) {
      console.error("Error al eliminar partido:", error);
      throw new Error("No se pudo eliminar el partido, posiblemente está asociado a uno o más torneos");
    }
  },
});
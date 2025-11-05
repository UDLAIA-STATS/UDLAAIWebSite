import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Torneo } from "@interfaces/torneos.interface";
import debug from "debug";

// === Esquemas de validación ===
const torneoSchema = z.object({
  nombretorneo: z.string().min(2, "El nombre del torneo es muy corto").max(100, "El nombre es demasiado largo"),
  descripciontorneo: z.string().max(255, "La descripción es muy larga"),
  idtemporada: z.number().int().positive("Debe seleccionar una temporada"),
  fechainiciotorneo: z.string().datetime("Fecha de inicio inválida"),
  fechafintorneo: z.string().datetime("Fecha de fin inválida"),
  torneoactivo: z.boolean(),
});

const torneoUpdateSchema = torneoSchema.extend({
  idtorneo: z.number().int().positive("El ID debe ser positivo"),
});

// === Obtener todos los torneos ===
export const getTorneos = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ page, pageSize }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/all/?page=${page}&offset=${pageSize}`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      return { 
        count: data.count,
        page: data.page,
        offset: data.offset,
        pages: data.pages,
        data: data.results as Torneo[]
       };
    } catch (err) {
      console.error("Error al obtener torneos:", err);
      throw new Error("No se pudo obtener la lista de torneos");
    }
  },
});

// === Obtener torneo por ID ===
export const getTorneoById = defineAction({
  input: z.object({ id: z.number().int().positive() }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${id}/`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = (await res.json()) as Torneo;
      return { data };
    } catch (err) {
      console.error(`Error al obtener torneo ID ${id}:`, err);
      throw new Error("No se pudo obtener el torneo");
    }
  },
});

// === Crear torneo ===
export const createTorneo = defineAction({
  accept: "form",
  input: torneoSchema,
  handler: async ({ nombretorneo, descripciontorneo, idtemporada, fechainiciotorneo, fechafintorneo, torneoactivo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombretorneo,
          descripciontorneo: descripciontorneo ?? "",
          idtemporada: idtemporada,
          fechainiciotorneo: fechainiciotorneo,
          fechafintorneo: fechafintorneo,
          torneoactivo: torneoactivo 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as Torneo;
      return { data };
    } catch (err) {
      console.error("Error al crear torneo:", err);
      throw new Error("No se pudo crear el torneo");
    }
  },
});

// === Actualizar torneo ===
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
          nombretorneo,
          descripciontorneo,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as Torneo;
      return { data };
    } catch (err) {
      console.error(`Error al actualizar torneo ${idtorneo}:`, err);
      throw new Error("No se pudo actualizar el torneo");
    }
  },
});

// === Eliminar torneo ===
export const deleteTorneo = defineAction({
  input: z.object({ idtorneo: z.number().int().positive("El ID debe ser positivo") }),
  handler: async ({ idtorneo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${idtorneo}/delete/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as Torneo;
      return { data };
    } catch (err) {
      console.error(`Error al eliminar torneo ${idtorneo}:`, err);
      throw new Error("No se puede eliminar el torneo, posiblemente tiene temporadas o partidos asociados.");
    }
  },
});

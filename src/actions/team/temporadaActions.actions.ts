import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Temporada } from "@interfaces/torneos.interface";

const temporadaSchema = z.object({
  nombretemporada: z.string().min(2).max(250),
  descripciontemporada: z.string().min(2).max(250),
  tipotemporada: z.enum(["Oficial", "Amistosa"]),
  fechainiciotemporada: z.string().datetime(),
  fechafintemporada: z.string().datetime(),
  temporadaactiva: z.boolean().optional(),
});

const temporadaUpdateSchema = temporadaSchema.extend({
  idtemporada: z.number().int().positive(),
});

export const getTemporadas = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ page, pageSize }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(
        `${baseUrl}/temporadas/all/?page=${page}&offset=${pageSize}`
      );
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      return {
        count: data.count,
        page: data.page,
        offset: data.offset,
        pages: data.pages,
        data: data.results as Temporada[],
      };
    } catch (err) {
      console.error("Error al obtener temporadas:", err);
      throw new Error("No se pudo obtener la lista de temporadas");
    }
  },
});

// ✅ Obtener temporada por ID
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

// ✅ Crear temporada
export const createTemporada = defineAction({
  accept: "form",
  input: temporadaSchema,
  handler: async ({
    nombretemporada,
    descripciontemporada,
    tipotemporada,
    fechainiciotemporada,
    fechafintemporada,
  }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombretemporada: nombretemporada,
          descripciontemporada: descripciontemporada,
          tipotemporada: tipotemporada,
          fechainiciotemporada: fechainiciotemporada,
          fechafintemporada: fechafintemporada,
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

// ✅ Actualizar temporada
export const updateTemporada = defineAction({
  accept: "form",
  input: temporadaUpdateSchema,
  handler: async (payload) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(
        `${baseUrl}/temporadas/${payload.idtemporada}/update/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return { data: (await res.json()) as Temporada };
    } catch (err) {
      console.error(
        `Error al actualizar temporada ${payload.idtemporada}:`,
        err
      );
      throw new Error("No se pudo actualizar la temporada");
    }
  },
});

// ✅ Eliminar temporada
export const deleteTemporada = defineAction({
  input: z.object({
    idtemporada: z.number().int().positive(),
  }),
  handler: async ({ idtemporada }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/temporadas/${idtemporada}/delete/`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error ${res.status}: ${res.statusText}`
        );
      }
      return { data: (await res.json()) as Temporada };
    } catch (err) {
      console.error(`Error al eliminar temporada ${idtemporada}:`, err);
      throw new Error(
        "No se pudo eliminar la temporada, posiblemente tiene torneos asociados."
      );
    }
  },
});

// src/actions/equipos.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { fileToBase64, imageToBase64 } from "@utils/fileToBase64";
import type { Equipo } from "@interfaces/torneos.interface";


// === Esquemas de validación ===
const equipoSchema = z.object({
  nombreequipo: z.string().min(2, "El nombre es muy corto").max(100, "El nombre es muy largo"),
  logoequipo: z.string().optional(),
});

const equipoUpdateSchema = z.object({
  idequipo: z.number().int().positive("El ID debe ser un número positivo"),
  nombreequipo: z.string().min(2).max(100).optional(),
  logoequipo: z.string().optional(),
});

// === Actions ===

// Obtener todos los equipos
export const getEquipos = defineAction({
  accept: "json",
  handler: async (_, { locals }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/all/`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return { data: data as Equipo[] };
    } catch (error) {
      console.error("Error al obtener equipos:", error);
      throw new Error("No se pudo obtener la lista de equipos");
    }
  },
});

// Obtener equipo por ID
export const getEquipoById = defineAction({
  accept: "json",
  input: z.object({
    id: z.number().int().positive("El ID debe ser un número positivo"),
  }),
  handler: async ({ id }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/${id}`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return { data: data as Equipo };
    } catch (error) {
      console.error(`Error al obtener el equipo con ID ${id}:`, error);
      throw new Error("No se pudo obtener el equipo solicitado");
    }
  },
});

export const getEquipoByName = defineAction({
  accept: "json",
  input: z.object({
    nombre: z.string().min(2).max(100),
  }),
  handler: async ({ nombre }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/equipos/search/${nombre}/`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return { data: data as Equipo };
    } catch (error) {
      console.error(`Error al obtener el equipo con nombre ${nombre}:`, error);
      throw new Error("No se pudo obtener el equipo solicitado");
    }
  },
});


// Crear nuevo equipo
export const createEquipo = defineAction({
  accept: "form",
  input: equipoSchema,
  handler: async ({ nombreequipo, logoequipo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {


      const response = await fetch(`${baseUrl}/equipos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreequipo,
          logoequipo: logoequipo,
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

// Actualizar equipo existente
export const updateEquipo = defineAction({
  accept: "form",
  input: equipoUpdateSchema,
  handler: async ({ idequipo, nombreequipo, logoequipo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {

      const response = await fetch(`${baseUrl}/equipos/${idequipo}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreequipo,
          logoequipo: logoequipo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data as Equipo };
    } catch (error) {
      console.error(`Error al actualizar el equipo con ID ${idequipo}:`, error);
      throw new Error("No se pudo actualizar el equipo");
    }
  },
});

export const deleteEquipo = defineAction({
  input: z.object({
    idequipo: z.number().int().positive("El ID debe ser un número positivo"),
  }),
  handler: async ({ idequipo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {

      const response = await fetch(`${baseUrl}/equipos/${idequipo}/delete/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data as Equipo };
    } catch (error) {
      console.error(`Error al eliminar el equipo con ID ${idequipo}:`, error);
      throw new Error("No se pudo eliminar el equipo, posiblemente está asociado a partidos.");
    }
  },
});

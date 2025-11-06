// src/actions/jugadores.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Player } from "@interfaces/player.interface";

// === Esquemas de validación ===
const jugadorSchema = z.object({
  nombrejugador: z.string().min(2).max(100),
  idbanner: z.string().min(9).max(10),
  apellidojugador: z.string().min(2).max(100),
  posicionjugador: z.enum(["Delantero", "Mediocampista", "Defensa", "Portero"]),
  numerocamisetajugador: z.number().int().positive(),
  jugadoractivo: z.boolean(),
});

const jugadorUpdateSchema = z.object({
  idjugador: z.number().int().positive(),
  nombrejugador: z.string().min(2).max(100).optional(),
  idbanner: z.string().min(9).max(10).optional(),
  apellidojugador: z.string().min(2).max(100).optional(),
  posicionjugador: z.enum(["Delantero", "Mediocampista", "Defensa", "Portero"]).optional(),
  numerocamisetajugador: z.number().int().positive().optional(),
  jugadoractivo: z.boolean().optional(),
});

// ===============================================
// Obtener listado de jugadores
// ===============================================
export const getJugadores = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
  }),
  handler: async ({ page, pageSize }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(`${baseUrl}/jugadores/all/?page=${page}&offset=${pageSize}`);
      if (!response.ok) throw new Error("Error al obtener jugadores");
      const data = await response.json();
      return {
        count: data.count,
        page: data.page,
        offset: data.offset,
        pages: data.pages,
        data: data.results as Player[],
      };
    } catch (error) {
      console.error("❌ Error en getJugadores:", error);
      throw new Error("No se pudieron obtener los jugadores. Intente nuevamente más tarde.");
    }
  },
});

// ===============================================
// Obtener jugador por ID
// ===============================================
export const getJugadorByBanner = defineAction({
  accept: "json",
  input: z.object({ idJugador: z.string() }),
  handler: async ({ idJugador }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(`${baseUrl}/jugadores/${idJugador}/`);
      if (!response.ok) throw new Error("Error al obtener jugador");
      return { data: (await response.json()) as Player };
    } catch (error) {
      console.error(`Error al obtener el jugador (ID: ${idJugador}):`, error);
      throw new Error("No se pudo obtener la información del jugador.");
    }
  },
});

export const getJugadorById = defineAction({
  accept: "json",
  input: z.object({ idjugador: z.number().int().positive() }),
  handler: async ({ idjugador }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(`${baseUrl}/jugadores/id/${idjugador}/`);
      if (!response.ok) throw new Error("Error al obtener jugador");
      return { data: (await response.json()) as Player };
    } catch (error) {
      console.error(`Error al obtener el jugador (ID: ${idjugador}):`, error);
      throw new Error("No se pudo obtener la información del jugador.");
    }
  },
});

// ===============================================
// Crear jugador
// ===============================================
export const createJugador = defineAction({
  accept: "form",
  input: jugadorSchema,
  handler: async (formData) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(`${baseUrl}/jugadores/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear jugador");
      }
      return { data: (await response.json()) as Player };
    } catch (error) {
      console.error("Error al crear el jugador:", error);
      throw error;
    }
  },
});

// ===============================================
// Actualizar jugador
// ===============================================
export const updateJugador = defineAction({
  accept: "form",
  input: jugadorUpdateSchema,
  handler: async ({ idjugador, ...updates }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(`${baseUrl}/jugadores/${idjugador}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar jugador");
      }
      const resp = await response.json();
      return { data: resp };
    } catch (error) {
      console.error(`Error al actualizar el:`, error);
      throw error;
    }
  },
});

// ===============================================
// Eliminar jugador
// ===============================================
export const deleteJugador = defineAction({
  input: z.object({ idJugador: z.string() }),
  handler: async ({ idJugador }) => {
    try {
      const baseUrl = import.meta.env.JUGADORES_API;
      const response = await fetch(`${baseUrl}/jugadores/${idJugador}/delete/`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error("Error al eliminar jugador (puede estar asociado a un equipo)");
      return { success: true };
    } catch (error) {
      console.error(`Error al eliminar el jugador:`, error);
      throw new Error("No se pudo eliminar el jugador. Verifique dependencias o intente más tarde.");
    }
  },
});

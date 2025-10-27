import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { TorneoPartido } from "@interfaces/torneos.interface";


// === Esquemas de validación ===
const torneoPartidoSchema = z.object({
  idtorneo: z.number().int().positive("El ID del torneo debe ser positivo"),
  idpartido: z.number().int().positive("El ID del partido debe ser positivo"),
});

// === Actions ===

// Obtener todos los registros torneo-partido
export const getTorneoPartidos = defineAction({
  accept: "json",
  handler: async () => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/torneo-partidos/`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return { data: data as TorneoPartido[] };
    } catch (error) {
      console.error("Error al obtener torneo-partidos:", error);
      throw new Error("No se pudo obtener la lista de torneo-partidos");
    }
  },
});

// Crear una relación torneo-partido
export const createTorneoPartido = defineAction({
  accept: "form",
  input: torneoPartidoSchema,
  handler: async ({ idtorneo, idpartido }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const response = await fetch(`${baseUrl}/torneo-partidos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idtorneo: idtorneo, idpartido: idpartido }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data as TorneoPartido };
    } catch (error) {
      console.error("Error al crear torneo-partido:", error);
      throw new Error("No se pudo crear la relación torneo-partido");
    }
  },
});

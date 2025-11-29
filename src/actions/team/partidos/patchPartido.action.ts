import { defineAction } from "astro:actions";
import { partidoUpdateSchema } from "./partidoSchemas";
import type { Partido } from "@interfaces/torneos.interface";
import { z } from "astro:schema";

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
        const errorData = await res.json();
        throw new Error(errorData.non_field_errors || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return { data: data.data as Partido };
    } catch (err) {
      console.error(`Error al actualizar partido ${payload.idpartido}:`, err);
      throw new Error("No se pudo actualizar el partido");
    }
  },
});

export const partidoSubido = defineAction({
  input: partidoUpdateSchema,
  handler: async ( payload ) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/${payload.idpartido}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.non_field_errors || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return { data: data.data as Partido };
    } catch (err) {
      console.error(`Error al actualizar partido ${payload.idpartido}:`, err);
      throw new Error("No se pudo actualizar el partido");
    }
  },
});
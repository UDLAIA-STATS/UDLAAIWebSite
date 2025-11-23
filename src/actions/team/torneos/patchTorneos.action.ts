import { defineAction } from "astro:actions";
import { torneoUpdateSchema } from "./torneoSchema";
import type { Torneo } from "@interfaces/torneos.interface";

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
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json() ;
      return { 
        mensaje: data.message,
        data: data.data as Torneo
       };
    } catch (err) {
      console.error(`Error al actualizar torneo ${idtorneo}:`, err);
      throw new Error("No se pudo actualizar el torneo");
    }
  },
});
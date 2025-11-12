import { defineAction } from "astro:actions";
import { torneoSchema } from "./torneoSchema";
import type { Torneo } from "@interfaces/torneos.interface";

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
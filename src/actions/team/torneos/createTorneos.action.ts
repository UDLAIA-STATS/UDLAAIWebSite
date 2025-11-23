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
        const errorData = await res.json();
        const errorMessage = JSON.stringify(errorData, null, 2)
        throw new Error(errorData.non_field_errors || `Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return { data: data.data as Torneo };
    } catch (err) {
      console.error("Error al crear torneo:", err);
      throw err;
    }
  },
});
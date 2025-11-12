import type { Temporada } from "@interfaces/torneos.interface";
import { defineAction } from "astro:actions";
import { temporadaSchema } from "./temporadasSchema";


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
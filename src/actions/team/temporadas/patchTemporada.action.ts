import { defineAction } from "astro:actions";
import { temporadaUpdateSchema } from "./temporadasSchema";
import type { Temporada } from "@interfaces/torneos.interface";

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
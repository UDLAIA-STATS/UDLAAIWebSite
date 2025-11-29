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
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = JSON.stringify(errorData, null, 2)
        throw new Error(errorData.non_field_errors || `Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return { data: data.data as Temporada };
    } catch (err) {
      console.error(
        `Error al actualizar temporada ${payload.idtemporada}:`,
        err
      );
      throw new Error("No se pudo actualizar la temporada");
    }
  },
});
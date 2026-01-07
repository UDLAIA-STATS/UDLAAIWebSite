import { defineAction } from "astro:actions";
import { partidoSchema } from "./partidoSchemas";
import type { Partido } from "@interfaces/index";
import { errorResponseSerializer, partidoSerializer, successResponseSerializer } from "@utils/serializers";

export const createPartido = defineAction({
  accept: "form",
  input: partidoSchema,
  handler: async ({ fechapartido, idequipolocal, idequipovisitante, idtorneo, idtemporada, marcadorequipolocal, marcadorequipovisitante }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/partidos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechapartido: fechapartido,
          idequipolocal: idequipolocal,
          idequipovisitante: idequipovisitante,
          idtorneo: idtorneo,
          idtemporada: idtemporada,
          marcadorequipolocal: marcadorequipolocal ?? null,
          marcadorequipovisitante: marcadorequipovisitante ?? null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = partidoSerializer(errorData);
        throw new Error(errorMessage || errorResponseSerializer(errorData).error || `Error ${res.status}: ${res.statusText}`);
      }

      const data = successResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error("Error al crear partido:", err);
      throw new Error(err instanceof Error ? err.message : "No se pudo crear el partido");
    }
  },
});
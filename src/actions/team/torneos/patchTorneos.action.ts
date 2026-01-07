import { defineAction } from "astro:actions";
import { torneoUpdateSchema } from "./torneoSchema";
import type { Torneo } from "@interfaces/torneos.interface";
import { errorResponseSerializer, successResponseSerializer, torneoSerializer } from "@utils/serializers";

export const updateTorneo = defineAction({
  accept: "form",
  input: torneoUpdateSchema,
  handler: async ({ descripciontorneo, fechafintorneo, fechainiciotorneo, idtorneo, nombretorneo, torneoactivo, idtemporada}) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(`${baseUrl}/torneos/${idtorneo}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripciontorneo: descripciontorneo,
          fechafintorneo: fechafintorneo,
          fechainiciotorneo: fechainiciotorneo,
          nombretorneo: nombretorneo,
          torneoactivo: torneoactivo,
          idtemporada: idtemporada
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = torneoSerializer(errorData);
        throw new Error(errorMessage || errorResponseSerializer(errorData).error || `Error ${res.status}: ${res.statusText}`);
      }

      const data = successResponseSerializer(await res.json());
      return data;
    } catch (err) {
      throw new Error("No se pudo actualizar el torneo");
    }
  },
});
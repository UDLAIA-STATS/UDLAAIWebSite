import { defineAction } from "astro:actions";
import { torneoSchema } from "./torneoSchema";
import {
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/serializers";

export const createTorneo = defineAction({
  accept: "form",
  input: torneoSchema,
  handler: async ({
    nombretorneo,
    descripciontorneo,
    idtemporada,
    fechainiciotorneo,
    fechafintorneo,
    torneoactivo,
  }) => {
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
          torneoactivo: torneoactivo,
        }),
      });

      if (!res.ok) {
        const errorData = errorResponseSerializer(await res.json());
        let errorMessage = errorData.error;

        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(
          errorMessage || `Error ${res.status}: ${res.statusText}`,
        );
      }

      const data = successResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error("Error al crear torneo:", err);
      throw err;
    }
  },
});

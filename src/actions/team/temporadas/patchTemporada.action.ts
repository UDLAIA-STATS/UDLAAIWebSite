import { defineAction } from "astro:actions";
import { temporadaUpdateSchema } from "./temporadasSchema";
import {
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/serializers";

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
        const errorData = errorResponseSerializer(await res.json());
        let errorMessage = errorData.error;

        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(
          errorMessage || `Error ${res.status}: ${res.statusText}`
        );
      }

      const data = successResponseSerializer(await res.json());
      return data;
    } catch (err) {
      console.error(
        `Error al actualizar temporada ${payload.idtemporada}:`,
        err
      );
      throw new Error("No se pudo actualizar la temporada");
    }
  },
});

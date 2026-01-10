import { defineAction } from "astro:actions";
import { partidoUpdateSchema } from "./partidoSchemas";
import {
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/index";

export const updatePartido = defineAction({
  accept: "form",
  input: partidoUpdateSchema,
  handler: async (payload) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(
        `${baseUrl}/partidos/${payload.idpartido}/update/`,
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
      console.error(`Error al actualizar partido ${payload.idpartido}:`, err);
      throw new Error("No se pudo actualizar el partido");
    }
  },
});

export const partidoSubido = defineAction({
  input: partidoUpdateSchema,
  handler: async (payload) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const res = await fetch(
        `${baseUrl}/partidos/${payload.idpartido}/update/`,
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
      console.error(`Error al actualizar partido ${payload.idpartido}:`, err);
      throw new Error("No se pudo actualizar el partido");
    }
  },
});

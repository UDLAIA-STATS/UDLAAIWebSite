import { defineAction } from "astro:actions";
import { equipoUpdateSchema } from "./equipoSchema";
import {
  equipoSerializer,
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/index";

export const updateEquipo = defineAction({
  accept: "form",
  input: equipoUpdateSchema,
  handler: async ({
    idequipo,
    nombreequipo,
    idinstitucion,
    imagenequipo,
    equipoactivo,
  }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const payload = !!!imagenequipo
        ? {
            idinstitucion: idinstitucion,
            nombreequipo: nombreequipo,
            equipoactivo: equipoactivo,
          }
        : {
            idinstitucion: idinstitucion,
            nombreequipo: nombreequipo,
            imagenequipo: imagenequipo,
            equipoactivo: equipoactivo,
          };

      const response = await fetch(`${baseUrl}/equipos/${idequipo}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = errorResponseSerializer(await response.json());
        let errorMessage = errorData.error;
        if ( errorData.data ) {
          errorMessage = errorData.data;
        }

        throw new Error(errorMessage || `Error ${response.status}: ${response.statusText}`);
      }

      const data = successResponseSerializer(await response.json());
      return data;
    } catch (error) {
      console.error(`Error al actualizar equipo con ID ${idequipo}:`, error);
      throw new Error("No se pudo actualizar el equipo");
    }
  },
});

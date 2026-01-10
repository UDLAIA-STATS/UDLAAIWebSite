import { defineAction } from "astro:actions";
import { equipoSchema } from "./equipoSchema";
import { equipoSerializer, errorResponseSerializer, successResponseSerializer } from "@utils/serializers";

export const createEquipo = defineAction({
  accept: "form",
  input: equipoSchema,
  handler: async ( { idinstitucion, nombreequipo, imagenequipo, equipoactivo } ) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const payload = !!!imagenequipo ? {
        idinstitucion: idinstitucion,
        nombreequipo: nombreequipo,
        equipoactivo: equipoactivo
      } : {
        idinstitucion: idinstitucion,
        nombreequipo: nombreequipo,
        imagenequipo: imagenequipo,
        equipoactivo: equipoactivo
      }
      console.log("Payload to send:", payload);

      const response = await fetch(`${baseUrl}/equipos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
       
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
      console.error("Error al crear equipo:", error);
      throw new Error("No se pudo crear el equipo");
    }
  },
});
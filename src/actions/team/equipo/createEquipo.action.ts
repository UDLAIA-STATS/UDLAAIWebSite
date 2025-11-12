import type { Equipo } from "@interfaces/index";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { equipoSchema } from "./equipoSchemas";

export const createEquipo = defineAction({
  accept: "form",
  input: equipoSchema,
  handler: async ( { idinstitucion, nombreequipo, imagenequipo, equipoactivo } ) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const formData = new FormData();
      formData.append("idinstitucion", idinstitucion.toString());
      formData.append("nombreequipo", nombreequipo);
      if( imagenequipo instanceof File ) {
        formData.append("imagenequipo", imagenequipo);
      }
      formData.append("equipoactivo", equipoactivo.toString());

      const response = await fetch(`${baseUrl}/equipos/`, {
        method: "POST",
        body: formData,
       
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data as Equipo };
    } catch (error) {
      console.error("Error al crear equipo:", error);
      throw new Error("No se pudo crear el equipo");
    }
  },
});
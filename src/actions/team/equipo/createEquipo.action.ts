import type { Equipo } from "@interfaces/index";
import { defineAction } from "astro:actions";
import { equipoSchema } from "./equipoSchema";

export const createEquipo = defineAction({
  accept: "form",
  input: equipoSchema,
  handler: async ( { idinstitucion, nombreequipo, imagenequipo, equipoactivo } ) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      const payload = !!imagenequipo ? {
        idinstitucion: idinstitucion,
        nombreequipo: nombreequipo,
        equipoactivo: equipoactivo
      } : {
        idinstitucion: idinstitucion,
        nombreequipo: nombreequipo,
        imagenequipo: imagenequipo,
        equipoactivo: equipoactivo
      }

      const response = await fetch(`${baseUrl}/equipos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
       
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.non_field_errors || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data.data as Equipo };
    } catch (error) {
      console.error("Error al crear equipo:", error);
      throw new Error("No se pudo crear el equipo");
    }
  },
});
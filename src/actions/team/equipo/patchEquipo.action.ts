import { defineAction } from "astro:actions";
import { equipoUpdateSchema } from "./equipoSchema";
import type { Equipo } from "@interfaces/index";

export const updateEquipo = defineAction({
  accept: "form",
  input: equipoUpdateSchema,
  handler: async ({ idequipo, nombreequipo, idinstitucion, imagenequipo, equipoactivo }) => {
    const baseUrl = import.meta.env.TEAMSERVICE_URL;
    try {
      // const formData = new FormData();
      // if (idinstitucion) formData.append("idinstitucion", idinstitucion.toString());
      // if (nombreequipo) formData.append("nombreequipo", nombreequipo);
      // if( imagenequipo instanceof File ) {
      //   formData.append("imagenequipo", imagenequipo);
      // }
      // formData.append("equipoactivo", equipoactivo.toString());

      const response = await fetch(`${baseUrl}/equipos/${idequipo}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idinstitudcion: idinstitucion,
          nombreequipo: nombreequipo,
          equipoactivo: equipoactivo,        
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data as Equipo };
    } catch (error) {
      console.error(`Error al actualizar equipo con ID ${idequipo}:`, error);
      throw new Error("No se pudo actualizar el equipo");
    }
  },
});

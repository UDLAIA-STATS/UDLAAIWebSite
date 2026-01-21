import {
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const updateUser = defineAction({
  accept: "form",
  input: z.object({
    originalName: z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
    rol: z.enum(["superuser", "profesor"]).optional(),
    is_active: z.boolean().optional(),
    password: z.string().optional(),
  }),
  handler: async ({ email, password, name, originalName, rol, is_active }) => {
    try {
      console.log("Actualizando usuario:", { name, email, password });
      const authUrl = import.meta.env.AUTH_URL;

      const response = await fetch(`${authUrl}/users/${originalName}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: name,
          email_usuario: email,
          rol: rol,
          is_active: is_active,
          contrasenia_usuario: password,
        }),
      });

      const details = await response.json();

      if (!response.ok) {
        const errorData = errorResponseSerializer(details);
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(errorMessage || "Error al registrar usuario");
      }

      return successResponseSerializer(details);
    } catch (err) {
      console.error("Fallo en la acción:", err);
      throw err;
    }
  },
});

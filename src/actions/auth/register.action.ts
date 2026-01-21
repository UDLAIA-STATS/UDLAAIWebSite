import {
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { log } from "console";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string(),
    email: z.string(),
    rol: z.enum(["superuser", "profesor"]),
    password: z.string(),
  }),
  handler: async (
    { email, password, name, rol },
    { cookies }
  ) => {
    try {
      console.log("Registrando usuario:", { name, email, password });
      const authUrl = import.meta.env.AUTH_URL;


      const response = await fetch(`${authUrl}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: name,
          email_usuario: email,
          rol: rol,
          contrasenia_usuario: password,
        }),
      });

      const details = await response.json();

      console.log("Respuesta del servidor:", response);

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

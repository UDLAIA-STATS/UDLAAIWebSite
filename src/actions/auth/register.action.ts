import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  handler: async ({ email, password, name }) => {
    try {
        console.log("Registrando usuario:", { name, email, password });
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: name,
          email_usuario: email,
          contrasenia_usuario: password,
        }),
      });
      console.log("Respuesta del servidor:", response);
      if (!response.ok) {
        console.log("Error en la respuesta del servidor");
        const errorData = await response.json().catch(() => ({}));
        console.error("Error al registrar usuario:", errorData);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      console.log("Usuario registrado con éxito");
      const data = await response.json();
      console.log("Usuario creado:", data);

      return data;
    } catch (err) {
      console.error("Fallo en la acción:", err);
    }
  },
});

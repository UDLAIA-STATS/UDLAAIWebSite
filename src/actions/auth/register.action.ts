import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    userCredential: z.string().min(8).max(100),
  }),
  handler: async ({ email, password, name, userCredential }, { cookies }) => {
    try {
        console.log("Registrando usuario:", { name, email, password });
        const loggedInUser = cookies.get("name");
        const authUrl = import.meta.env.AUTH_URL;
        const basicAuth = Buffer.from(`${loggedInUser?.value}:${userCredential}`).toString("base64");
        const response = await fetch(`${authUrl}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          nombre_usuario: name,
          email_usuario: email,
          contrasenia_usuario: password,
        }),
      });
      console.log("Respuesta del servidor:", response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();

      return { data: data };
    } catch (err) {
      console.error("Fallo en la acción:", err);
      throw err;
    }
  },
});

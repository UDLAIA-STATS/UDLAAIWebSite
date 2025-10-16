import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  handler: async ({ email, password, name }, { cookies }) => {
    try {
        console.log("Registrando usuario:", { name, email, password });
        console.log("Token:", cookies.get("token")?.value);
        const authUrl = import.meta.env.AUTH_URL;
        console.log("AUTH_URL:", authUrl);
        const basicAuth = Buffer.from("administrador:123456789").toString("base64");
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
        console.log("Error en la respuesta del servidor");
        const errorData = await response.json().catch(() => ({}));
        console.error("Error al registrar usuario:", errorData);
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }
      console.log("Usuario registrado con éxito");
      const data = await response.json();
      console.log("Usuario creado:", data);

      return { data: data };
    } catch (err) {
      console.error("Fallo en la acción:", err);
      throw err;
    }
  },
});

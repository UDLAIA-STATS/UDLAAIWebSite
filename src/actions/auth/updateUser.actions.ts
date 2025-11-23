import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const updateUser = defineAction({
  accept: "form",
  input: z.object({
    originalName: z.string().min(2).max(100),
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    rol: z.enum(["superuser", "profesor"]).optional(),
    is_active: z.boolean().optional(),
    password: z.string().min(8).optional(),
    userCredential: z.string().min(8).max(100),
  }),
  handler: async (
    { email, password, name, originalName, rol, is_active, userCredential },
    { cookies }
  ) => {
    try {
      console.log("Actualizando usuario:", { name, email, password });
      const loggedInUser = cookies.get("user")
        ? (JSON.parse(cookies.get("user")?.value as string) as LoggedUser)
        : null;
      const authUrl = import.meta.env.AUTH_URL;
      const basicAuth = Buffer.from(
        `${loggedInUser?.nickname}:${userCredential}`
      ).toString("base64");
      const response = await fetch(`${authUrl}/users/${originalName}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          nombre_usuario: name,
          email_usuario: email,
          rol: rol,
          is_active: is_active,
          contrasenia_usuario: password,
        }),
      });
      console.log("Respuesta del servidor:", response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Error ${response.status}: ${response.statusText}`
        );
      }
      const data = await response.json();

      return { data: data };
    } catch (err) {
      console.error("Fallo en la acción:", err);
      throw err;
    }
  },
});

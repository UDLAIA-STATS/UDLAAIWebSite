import { usuarioSerializer } from "@utils/serializers/usuario/usuario_serializer";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { log } from "console";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    rol: z.enum(["superuser", "profesor"]),
    password: z.string().min(8),
    userCredential: z.string().min(8).max(100),
  }),
  handler: async ({ email, password, name, rol, userCredential }, { cookies }) => {
    try {
      console.log("Registrando usuario:", { name, email, password });
      const loggedInUser = cookies.get("user")
        ? (JSON.parse(cookies.get("user")?.value as string) as LoggedUser)
        : null;
      const authUrl = import.meta.env.AUTH_URL;
      const basicAuth = Buffer.from(
        `${loggedInUser?.nickname}:${userCredential}`
      ).toString("base64");
      const response = await fetch(`${authUrl}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          nombre_usuario: name,
          email_usuario: email,
          rol: rol,
          contrasenia_usuario: password,
        }),
      });
      console.log("Respuesta del servidor:", response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = usuarioSerializer(errorData);
        log(`Response: ${errorData.data}`);
        throw new Error(errorData.data);
      }
      const data = await response.json();

      return { 
        message: data.mensaje,
        status: data.status,
        data: data.data
       };
    } catch (err) {
      console.error("Fallo en la acción:", err);
      throw err;
    }
  },
});

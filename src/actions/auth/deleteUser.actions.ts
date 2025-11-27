import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteUser = defineAction({
  accept: "form",
  input: z.object({
    nickname: z.string().min(2).max(100),
    userCredential: z.string().min(8).max(100),
  }),
  handler: async ({ nickname, userCredential }, { cookies }) => {
    const authUrl = import.meta.env.AUTH_URL;
    const adminKey = import.meta.env.DEFAULT_ADMIN_PASSWORD;
    const loggedInUser = cookies.get("user")
  ? (JSON.parse(cookies.get("user")?.value as string) as LoggedUser).nickname
  : 'admin';;

    if (!authUrl) {
      console.error("AUTH_URL no está definida en import.meta.env");
      throw new Error("Configuración inválida del servidor de autenticación.");
    }

    if (!loggedInUser) {
      console.error("No se encontró la cookie 'user'.");
      throw new Error("Usuario no autenticado.");
    }

    if (!nickname) {
      console.error("No se recibió el nickname.");
      throw new Error("No se recibió el nombre de usuario.");
    }

    try {
      console.log("Eliminando usuario:", { nickname });

      const basicAuth = Buffer.from(
        `${loggedInUser}:${adminKey}`
      ).toString("base64");

      const url = `${authUrl}/users/${nickname}/delete/`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
      });

      console.log("Respuesta del servidor:", response.status, response.statusText);

      // Si el servidor responde 204 No Content o no tiene body, manejarlo.
      if (response.status === 204) {
        return { data: { success: true, message: "Usuario eliminado correctamente" } };
      }

      // Intentar leer el body (puede ser JSON o texto)
      const text = await response.text().catch(() => "");
      let parsed: any = text;

      if (text) {
        try {
          parsed = JSON.parse(text);
        } catch (_e) {
          // no es JSON, quedará como texto
        }
      } else {
        parsed = null;
      }

      if (!response.ok) {
        // Si el body tiene un campo 'detail' o 'message', priorizarlo
        const errMessage =
          (parsed && (parsed.detail || parsed.message || JSON.stringify(parsed))) ||
          `Error ${response.status}: ${response.statusText}`;
        console.error("Error en DELETE:", errMessage);
        throw new Error(errMessage);
      }

      // OK: devolver parsed si existe, sino un objeto con éxito
      const result = parsed ?? { success: true, message: "Usuario eliminado correctamente" };
      return { data: result };
    } catch (err) {
      console.error("Fallo en la acción deleteUser:", err);
      // Normalizar el error lanzado para que el cliente lo reciba limpio
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Ocurrió un error al eliminar el usuario.");
    }
  },
});

import {
  errorResponseSerializer,
  successResponseSerializer,
  usuarioSerializer,
} from "@utils/serializers";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteUser = defineAction({
  accept: "form",
  input: z.object({
    nickname: z.string().min(2).max(100),
  }),
  handler: async ({ nickname }, { cookies }) => {
    const authUrl = import.meta.env.AUTH_URL;
    const adminKey = import.meta.env.DEFAULT_ADMIN_PASSWORD;
    const loggedInUser = cookies.get("user")
      ? (JSON.parse(cookies.get("user")?.value as string) as LoggedUser)
          .nickname
      : "admin";

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

      const basicAuth = Buffer.from(`${loggedInUser}:${adminKey}`).toString(
        "base64"
      );

      const url = `${authUrl}/users/${nickname}/delete/`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage
        errorMessage = usuarioSerializer(data);
        if ( !errorMessage ) {
          const errorResult = errorResponseSerializer(data);
          const errorData: string[] = errorResult.data;
          errorMessage = errorData ? errorData.join("\n") : errorResult.error;
        }
        console.error("Error en DELETE:", errorMessage);
        throw new Error(
          errorMessage ||
            errorResponseSerializer(data).error ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const result = successResponseSerializer(data);
      return result;
    } catch (err) {
      console.error("Fallo en la acción deleteUser:", err);
      if (err instanceof Error) throw new Error(err.message);
      throw err;
    }
  },
});

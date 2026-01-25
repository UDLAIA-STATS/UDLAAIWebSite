import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { LoggedUser, User } from "@interfaces/user.interface";
import {
  errorResponseSerializer,
  successResponseSerializer,
} from "@utils/serializers";

export const login = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    password: z.string().min(8),
    rememberMe: z.boolean().optional(),
  }),
  handler: async ({ name, password, rememberMe }, { cookies, locals }) => {
    try {
      // Manejo de cookies para "remember me"
      console.log("Recordar usuario:", rememberMe);
      if (rememberMe) {
        cookies.set("name", name, {
          expires: new Date(Date.now() + 1000 * 3600), // 1 hour
          path: "/",
        });
      } else {
        cookies.delete("name", { path: "/" });
      }
      console.log("Intentando login:", { name, password, rememberMe });
      const authUrl = import.meta.env.AUTH_URL;
      const response = await fetch(`${authUrl}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: name,
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
        throw new Error(
          errorMessage || `Error ${response.status}: ${response.statusText}`,
        );
      }

      console.log("Login exitoso:", details);
      const json = successResponseSerializer(details);
      const serverUser = json.data as User;
      console.log("Datos del usuario:", serverUser);
      const user: LoggedUser = {
        email: json.data.email_usuario,
        nickname: json.data.nombre_usuario,
        rol: json.data.rol,
        loginTime: new Date(),
      };

      cookies.set("user", JSON.stringify(user), {
        expires: new Date(Date.now() + 1000 * 3600), // 1 hour
        path: "/",
      });
      locals.user = user;
      cookies.set("token", json.data.token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 3600), // 1 hour
        path: "/",
      });

      return user;
    } catch (err) {
      console.error("Fallo en la acción de login:", err);
      throw err;
    }
  },
});

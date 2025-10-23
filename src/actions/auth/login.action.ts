import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { LoggedUser } from "@interfaces/user.interface";

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
      if (rememberMe) {
      cookies.set("name", name, {
          expires: new Date(Date.now() + 1000 * 3600 * 24 * 30), // 30 days
          path: "/",
        });
      } else {
        cookies.delete("name", { path: "/" });
    }
;

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
      
      if (!response.ok) {
        console.log("Error en la respuesta del servidor");
        throw new Error('Contraseña o usuario incorrectos');
      }
      
      console.log("Respuesta del servidor:", response);
      const json = await response.json();;
      
      console.log("Login exitoso:", json);
      const user: LoggedUser = {
        email: json['usuario'].email_usuario,
        nickname: json['usuario'].nombre_usuario,
        rol: json['usuario'].rol,
        loginTime: new Date(),
      }

      cookies.set("user", JSON.stringify(user), {
        expires: new Date(Date.now() + 1000 * 3600), // 1 hour
        path: "/",
      });
      locals.user = user;
      cookies.set("token", json['token'], {
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

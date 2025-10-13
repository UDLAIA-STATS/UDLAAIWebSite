import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const login = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    password: z.string().min(8),
    rememberMe: z.boolean().optional(),
  }),
  handler: async ({ name, password, rememberMe }, { cookies }) => {
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

      console.log("Intentando login:", { name, password, rememberMe });

      const response = await fetch("http://127.0.0.1:8000/api/login/", {
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
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      console.log("Respuesta del servidor:", response);
      const json = await response.json();
      console.log("Login exitoso:", json);

      return json;
    } catch (err) {
      console.error("Fallo en la acción de login:", err);
      return err;
    }
  },
});

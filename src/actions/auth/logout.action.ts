import { defineAction } from "astro:actions";

export const logout = defineAction({
  handler: async (_, { cookies }) => {
    try {
      cookies.delete("user", { path: "/" });
      cookies.delete("token", { path: "/" });
      return { message: "Usuario deslogueado con éxito" };
    } catch (err) {
      console.error("Fallo en la acción:", err);
      throw err;
    }
  },
});

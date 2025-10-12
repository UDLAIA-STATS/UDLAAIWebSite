import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const login = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    rememberMe: z.boolean().optional(),
  }),
  handler: async ({ email, password, rememberMe }, { cookies }) => {
    if (rememberMe) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 3600 * 24 * 30), // 30 days
        path: "/",
      });
    } else {
      cookies.delete("email", { path: "/" });
    }

    console.log(email, password, rememberMe);

    const resp = await fetch("https://jsonplaceholder.typicode.com/users/1");
    if (!resp.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await resp.json();
    console.log(data);

    return data;
  },
});

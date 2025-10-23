// src/actions/equipos.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { User } from "@interfaces/user.interface";

export const getUsers = defineAction({
  accept: "json",
  input: z.string().min(8).max(100),
  handler: async (userCredential, { cookies }) => {
    const baseUrl = import.meta.env.AUTH_URL;
    const loggedInUser = cookies.get("name");

    if (!loggedInUser?.value) {
      console.error("No se encontró la cookie 'name'.");
      throw new Error("Usuario no autenticado.");
    }

    try {
      const basicAuth = Buffer.from(
        `${loggedInUser.value}:${userCredential}`
      ).toString("base64");

      const response = await fetch(`${baseUrl}/users/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error(`Error ${response.status}: ${detail}`);
        throw new Error(
          `Fallo al obtener usuarios: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Usuarios obtenidos:", data);

      return { data: data as User[] };
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw new Error("No se pudo obtener la lista de usuarios");
    }
  },
});

// Obtener usuario por ID
export const getUserById = defineAction({
  accept: "json",
  input: z.object({
    username: z.string().min(2).max(100),
    userCredential: z.string().min(8).max(100),
  }),
  handler: async ({ username, userCredential }, { locals, cookies }) => {
    const baseUrl = import.meta.env.AUTH_URL;
    const loggedInUser = cookies.get("name");
    const basicAuth = Buffer.from(
      `${loggedInUser?.value}:${userCredential}`
    ).toString("base64");
    try {
      const response = await fetch(`${baseUrl}/users/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
      });
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return { data: data as User };
    } catch (error) {
      console.error(`Error al obtener el usuario con nombre de usuario ${username}:`, error);
      throw new Error("No se pudo obtener el usuario solicitado");
    }
  },
});

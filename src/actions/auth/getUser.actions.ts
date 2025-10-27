// src/actions/equipos.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { User } from "@interfaces/user.interface";

export const getUsers = defineAction({
  accept: "json",
  input: z.string().min(8).max(100),
  handler: async (userCredential, { cookies }) => {
    const baseUrl = import.meta.env.AUTH_URL;
    const loggedInUser = cookies.get("user")
  ? (JSON.parse(cookies.get("user")?.value as string) as LoggedUser)
  : null;

    if (!loggedInUser?.nickname) {
      console.error("No se encontró la cookie 'user'.");
      throw new Error("Usuario no autenticado.");
    }

    try {
      const basicAuth = Buffer.from(
        `${loggedInUser.nickname}:${userCredential}`
      ).toString("base64");

      const response = await fetch(`${baseUrl}/users/`, {
        method: "GET",
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

export const getUserByUsername = defineAction({
  accept: "json",
  input: z.object({
    username: z.string().min(2).max(100),
    userCredential: z.string().min(8).max(100),
  }),
  handler: async ({ username, userCredential }, { locals, cookies }) => {
    console.log("getUserByUsername llamado con username:", username);

    const baseUrl = import.meta.env.AUTH_URL;
    const loggedInUser = cookies.get("user")
  ? (JSON.parse(cookies.get("user")?.value as string) as LoggedUser)
  : null; 

    if (!loggedInUser) {
      throw new Error("Usuario autenticado no encontrado en las cookies");
    }

    const basicAuth = Buffer.from(`${loggedInUser.nickname}:${userCredential}`).toString(
      "base64"
    );

    try {
      const response = await fetch(`${baseUrl}/users/${username}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
      });

      if (!response.ok) {
        console.error("Error HTTP:", response.status, response.statusText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data: data };
    } catch (error) {
      console.error(
        `Error al obtener el usuario con nombre de usuario "${username}":`,
        error
      );
      throw new Error("No se pudo obtener el usuario solicitado");
    }
  },
});

// src/actions/equipos.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { User } from "@interfaces/user.interface";
import {
  errorResponseSerializer,
  paginationResponseSerializer,
  successResponseSerializer,
} from "@utils/index";
import debug from "debug";

const sortableFields: Set<keyof User> = new Set([
  "nombre_usuario",
  "email_usuario",
  "rol",
  "is_active",
]);

export const getUsers = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().int().positive().optional().default(1),
    pageSize: z.number().int().positive().optional().default(10),
    sortBy: z.string().optional(),
    orderBy: z.enum(["asc", "desc"]).optional(),
  }),
  handler: async (
    { page, pageSize, sortBy, orderBy },
    { cookies }
  ) => {
    const baseUrl = import.meta.env.AUTH_URL;
    const loggedInUser = cookies.get("user")
      ? (JSON.parse(cookies.get("user")?.value as string) as LoggedUser)
      : null;

    if (!loggedInUser?.nickname) {
      console.error("No se encontró la cookie 'user'.");
      throw new Error("Usuario no autenticado.");
    }

    try {


      const response = await fetch(
        `${baseUrl}/users/?page=${page}&offset=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const details = await response.json();

      if (!response.ok) {
        const errorData = errorResponseSerializer(details);
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(errorMessage || `Error ${response.status}: ${response.statusText}`);
      }

      const result = paginationResponseSerializer(details);
      result.results = sortUsers(result.results, sortBy as keyof User, orderBy);
      return result;
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
  }),
  handler: async ({ username }, { cookies }) => {
    console.log("getUserByUsername llamado con username:", username);
    const baseUrl = import.meta.env.AUTH_URL;
    const loggedInUser = cookies.get("user")
      ? (JSON.parse(cookies.get("user")?.value as string) as LoggedUser)
      : null;

    if (!loggedInUser) {
      throw new Error("Usuario autenticado no encontrado en las cookies");
    }

    try {
      const response = await fetch(`${baseUrl}/users/${username}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const details = await response.json();

      if (!response.ok) {
        const errorData = errorResponseSerializer(details);
        let errorMessage = errorData.error;
        if (errorData.data) {
          errorMessage = errorData.data;
        }
        throw new Error(errorMessage || `Error ${response.status}: ${response.statusText}`);
      }
      console.log("Usuario obtenido:", successResponseSerializer(details).data);
      debug.log("Usuario obtenido:", details);
      return successResponseSerializer(details);
    } catch (error) {
      console.error(
        `Error al obtener el usuario con nombre de usuario "${username}":`,
        error
      );
      throw new Error("No se pudo obtener el usuario solicitado");
    }
  },
});

const sortUsers = (
  items: User[],
  sortBy?: keyof User,
  orderBy: "asc" | "desc" = "asc"
): User[] => {
  if (!sortBy || !sortableFields.has(sortBy)) {
    return items;
  }

  return items.sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (valueA == null || valueB == null) return 0;

    // boolean
    if (typeof valueA === "boolean" && typeof valueB === "boolean") {
      return orderBy === "asc"
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }

    // string / number
    return orderBy === "asc"
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });
};

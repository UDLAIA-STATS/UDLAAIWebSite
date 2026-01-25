import type { User } from "@interfaces/user.interface";
import { actions } from "astro:actions";

export const getActualUser = async (username: string) => {
  const { data, error } = await actions.getUserByUsername({
    username: username,
  });
  const user: User = data?.data as User;
  if (error) {
    throw error;
  }
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return user;
};

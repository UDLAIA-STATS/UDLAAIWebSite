import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const registerEquipo = defineAction({
  accept: "form",
  input: z.object({
    nombreEquipo: z.string().min(2).max(100),
    logo: z.instanceof(File),
  }),
  handler: async ({ nombreEquipo, logo }) => {
    return { message: `Hello!` };
  },
});

export const getEquipo = defineAction({
  handler: async () => {
    return { message: `Hello!` };
  },
});

export const getEquipoById = defineAction({
  input: z.number().min(1),
  handler: async ( input) => {
    return { message: `Hello! ${input}` };
  },
});

export const updateEquipo = defineAction({
  accept: "form",
  input: z.object({
    nombreEquipo: z.string().min(2).max(100),
  }),
  handler: async ({ nombreEquipo }) => {
    return { message: `Hello!` };
  },
});

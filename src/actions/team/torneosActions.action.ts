import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const registerTorneo = defineAction({
  accept: "form",
  input: z.object({
    nombreTorneo: z.string().min(2).max(100),
  }),
  handler: async ({ nombreTorneo }) => {
    return { message: `Hello!` };
  },
});

export const getTorneos = defineAction({
  handler: async () => {
    return { message: `Hello!` };
  },
});

export const getTorneoById = defineAction({
    input: z.number().min(1),
  handler: async (input) => {
    return { message: `Hello! ${input}` };
  },
});

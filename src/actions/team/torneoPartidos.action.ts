import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const registerTorneoPartido = defineAction({
  accept: "form",
  input: z.object({
    idTorneo: z.number().min(1),
    idPartido: z.number().min(1),
  }),
  handler: async ({ idTorneo, idPartido }) => {
    return { message: `Hello!` };
  },
});

export const getTorneosPartidos = defineAction({
  handler: async () => {
    return { message: `Hello!` };
  },
});

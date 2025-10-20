import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const registerPartido = defineAction({
  accept: "form",
  input: z.object({
    fechaPartido: z.date(),
    tipoPartido: z.boolean(),
    idEquipoLocal: z.number().min(1),
    idEquipoVisitante: z.number().min(1),
  }),
  handler: async ({ fechaPartido, tipoPartido, idEquipoLocal, idEquipoVisitante }) => {
    return { message: `Hello!` };
  },
});

export const getPartidos = defineAction({
  handler: async () => {
    return { message: `Hello!` };
  },
});

export const getPartidoById = defineAction({
    input: z.number().min(1),
  handler: async (input) => {
    return { message: `Hello! ${input}` };
  },
});

export const updatePartido = defineAction({
  accept: "form",
  input: z.object({
    fechaPartido: z.date(),
    tipoPartido: z.boolean(),
    idEquipoLocal: z.number().min(1),
    idEquipoVisitante: z.number().min(1),
  }),
  handler: async ({ fechaPartido, tipoPartido, idEquipoLocal, idEquipoVisitante }) => {
    return { message: `Hello!` };
  },
});

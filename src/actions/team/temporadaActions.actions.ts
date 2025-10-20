import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const registerTemporada = defineAction({
  accept: "form",
  input: z.object({
    nombreTemporada: z.string().min(2).max(100),
    tipoTemporada: z.boolean(),
    idTorneo: z.number().min(1),
  }),
  handler: async ({ nombreTemporada, tipoTemporada, idTorneo }) => {
    return { message: `Hello! ${nombreTemporada}, ${tipoTemporada}, ${idTorneo}` };
  },
});

export const updateTemporada = defineAction({
  accept: "form",
  input: z.object({
    nombreTemporada: z.string().min(2).max(100),
    tipoTemporada: z.boolean(),
    idTorneo: z.number().min(1),
  }),
  handler: async ({ nombreTemporada, tipoTemporada, idTorneo }) => {
    return { message: `Hello! ${nombreTemporada}, ${tipoTemporada}, ${idTorneo}` };
  },
});

export const getTemporadas = defineAction({
  handler: async () => {
    return { message: `Hello!` };
  },
});

export const getTemporadaById = defineAction({
    input: z.number().min(1),
  handler: async (input) => {
    return { message: `Hello! ${input}` };
  },
});

import { z } from "astro:schema";

export const partidoSchema = z.object({
  fechapartido: z.string(), // ISO date
  idequipolocal: z.number().int().positive(),
  idequipovisitante: z.number().int().positive(),
  idtorneo: z.number().int().positive(),
  idtemporada: z.number().int().positive(),
  marcadorequipolocal: z.number().int().nonnegative().optional().nullable(),
  marcadorequipovisitante: z.number().int().nonnegative().optional().nullable(),
  partidosubido: z.boolean().optional(),
});

export const partidoUpdateSchema = partidoSchema.extend({
  idpartido: z.number().int().positive(),
});
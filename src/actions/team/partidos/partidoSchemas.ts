import { z } from "astro:schema";

export const partidoSchema = z.object({
  fechapartido: z.string(),
  idequipolocal: z.number(),
  idequipovisitante: z.number(),
  idtorneo: z.number(),
  idtemporada: z.number(),
  marcadorequipolocal: z.number().optional().nullable(),
  marcadorequipovisitante: z.number().optional().nullable(),
  partidosubido: z.boolean().optional(),
});

export const partidoUpdateSchema = partidoSchema.extend({
  idpartido: z.number(),
});

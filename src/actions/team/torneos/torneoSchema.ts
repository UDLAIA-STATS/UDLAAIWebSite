import { z } from "astro:schema";

export const torneoSchema = z.object({
  nombretorneo: z.string(),
  descripciontorneo: z.string(),
  idtemporada: z.number(),
  fechainiciotorneo: z.string(),
  fechafintorneo: z.string(),
  torneoactivo: z.boolean(),
});

export const torneoUpdateSchema = torneoSchema.extend({
  idtorneo: z.number(),
});
import { z } from "astro:schema";

export const temporadaSchema = z.object({
  nombretemporada: z.string(),
  descripciontemporada: z.string(),
  tipotemporada: z.enum(["Oficial", "Amistosa"]),
  fechainiciotemporada: z.string(),
  fechafintemporada: z.string(),
  temporadaactiva: z.boolean().optional(),
});

export const temporadaUpdateSchema = temporadaSchema.extend({
  idtemporada: z.number(),
});

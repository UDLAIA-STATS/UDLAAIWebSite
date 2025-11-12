import { z } from "astro:schema";

export const temporadaSchema = z.object({
  nombretemporada: z.string().min(2).max(250),
  descripciontemporada: z.string().min(2).max(250),
  tipotemporada: z.enum(["Oficial", "Amistosa"]),
  fechainiciotemporada: z.string().datetime(),
  fechafintemporada: z.string().datetime(),
  temporadaactiva: z.boolean().optional(),
});

export const temporadaUpdateSchema = temporadaSchema.extend({
  idtemporada: z.number().int().positive(),
});

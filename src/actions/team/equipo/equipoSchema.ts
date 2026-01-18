import { z } from "astro:schema";

export const equipoSchema = z.object({
  idinstitucion: z.number(),
  nombreequipo: z.string(),
  imagenequipo: z.string().optional().nullable(),
  equipoactivo: z.boolean(),
});

export const equipoUpdateSchema = z.object({
  idequipo: z.number(),
  nombreequipo: z.string().optional(),
  idinstitucion: z.number().optional(),
  imagenequipo: z.string().optional().nullable(),
  equipoactivo: z.boolean(),
});

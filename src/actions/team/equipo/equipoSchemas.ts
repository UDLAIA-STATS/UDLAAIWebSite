import { z } from "astro:schema";

export const equipoSchema = z.object({
  idinstitucion: z.number().int().positive("Debe asociarse una institución"),
  nombreequipo: z.string().min(2, "El nombre es muy corto").max(250, "El nombre es muy largo"),
  imagenequipo: z.instanceof(File).optional().nullable(), // BinaryField → base64 string o null
  equipoactivo: z.boolean(),
});

export const equipoUpdateSchema = z.object({
  idequipo: z.number().int().positive("El ID debe ser positivo"),
  nombreequipo: z.string().min(2).max(250).optional(),
  idinstitucion: z.number().int().positive().optional(),
  imagenequipo: z.instanceof(File).optional().nullable(),
  equipoactivo: z.boolean(),
});
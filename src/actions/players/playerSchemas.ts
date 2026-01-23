import { z } from "astro:schema";

export const jugadorSchema = z.object({
  nombrejugador: z.string(),
  idbanner: z.string(),
  apellidojugador: z.string(),
  imagenjugador: z.string().optional().nullable(),
  posicionjugador: z.enum(["Delantero", "Mediocampista", "Defensa", "Portero"]),
  numerocamisetajugador: z.number().optional(),
  jugadoractivo: z.boolean(),
});

export const jugadorUpdateSchema = z.object({
  idjugador: z.number().int().positive(),
  nombrejugador: z.string().optional(),
  idbanner: z.string().optional(),
  apellidojugador: z.string().optional(),
  imagenjugador: z.string().optional().nullable(),
  posicionjugador: z
    .enum(["Delantero", "Mediocampista", "Defensa", "Portero"])
    .optional(),
  numerocamisetajugador: z.number().optional(),
  jugadoractivo: z.boolean().optional(),
});

import { z } from "astro:schema";

export const jugadorSchema = z.object({
  nombrejugador: z.string().min(2).max(100),
  idbanner: z.string().min(9).max(10),
  apellidojugador: z.string().min(2).max(100),
  imagenjugador: z.string().optional().nullable(),
  posicionjugador: z.enum(["Delantero", "Mediocampista", "Defensa", "Portero"]),
  numerocamisetajugador: z.number().int().positive(),
  jugadoractivo: z.boolean(),
});

export const jugadorUpdateSchema = z.object({
  idjugador: z.number().int().positive(),
  nombrejugador: z.string().min(2).max(100).optional(),
  idbanner: z.string().min(9).max(10).optional(),
  apellidojugador: z.string().min(2).max(100).optional(),
  posicionjugador: z
    .enum(["Delantero", "Mediocampista", "Defensa", "Portero"])
    .optional(),
  numerocamisetajugador: z.number().int().positive().optional(),
  jugadoractivo: z.boolean().optional(),
});

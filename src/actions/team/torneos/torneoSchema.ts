import { z } from "astro:schema";

export const torneoSchema = z.object({
  nombretorneo: z.string().min(2, "El nombre del torneo es muy corto").max(100, "El nombre es demasiado largo"),
  descripciontorneo: z.string().max(255, "La descripción es muy larga"),
  idtemporada: z.number().int().positive("Debe seleccionar una temporada"),
  fechainiciotorneo: z.string().datetime("Fecha de inicio inválida"),
  fechafintorneo: z.string().datetime("Fecha de fin inválida"),
  torneoactivo: z.boolean(),
});

export const torneoUpdateSchema = torneoSchema.extend({
  idtorneo: z.number().int().positive("El ID debe ser positivo"),
});
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { PlayerService } from "@services/playerService";

export const registerPlayer = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    lastname: z.string().min(2).max(100),
    shirtNumber: z.number().min(1).max(99),
    position: z.string().min(2).max(50),
    photo: z.instanceof(File),
  }),
  handler: async ({ name, lastname, shirtNumber, position, photo }) => {
    
  },
});

import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const uploadVideo = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    date: z.date(),
    video: z.instanceof(File),
  }),
  handler: async ({ name, date, video }) => {
    return { message: `Hello, ${name}!` };
  },
});

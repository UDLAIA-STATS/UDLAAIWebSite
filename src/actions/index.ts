import * as auth from "./auth";
import * as players from "./players";
import * as analysis from "./analysis";
import * as team from "./team";

export const server = {
  ...auth,
  ...players,
  ...analysis,
  ...team,
};
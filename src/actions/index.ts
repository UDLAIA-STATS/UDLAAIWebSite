import * as auth from "./auth";
import * as players from "./players";
import * as analysis from "./analysis";
import * as team from "./team";
import * as videoUpload from "./video";

export const server = {
  ...auth,
  ...players,
  ...analysis,
  ...team,
  ...videoUpload,
};
import * as auth from "./auth";
import * as players from "./players";
import * as team from "./team";
import * as videoUpload from "./video";

export const server = {
  ...auth,
  ...players,
  ...team,
  ...videoUpload,
};
import { login, logout, registerUser } from "./auth";
import { registerPlayer } from "./players";
import { uploadVideo } from "./analysis";

export const server = {
    login,
    registerUser,
    registerPlayer,
    logout,
    uploadVideo
}
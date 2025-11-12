import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { randomUUID } from "crypto";

const videoSchema = z.object({
  video: z.instanceof(File),
});

export const uploadVideo = defineAction({
  accept: "form",
  input: videoSchema,
  handler: async ({ video }) => {
    try {
      const storage = getStorage();
      const uuid = randomUUID();
      const fileName = `${Date.now()}_${uuid}_${video.name}`;
      const storageRef = ref(storage, `videos/${fileName}`);

      // Subir el archivo
      const snapshot = await uploadBytes(storageRef, video);

      // Obtener la URL pública del video
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Retornar resultado
      return {
        success: true,
        message: "Video subido correctamente",
        url: downloadURL,
      };
    } catch (err) {
      console.error("Error al subir video:", err);
      return {
        success: false,
        message: err || "Error al subir el video",
      };
    }
  },
});

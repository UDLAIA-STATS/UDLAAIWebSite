import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import debug from "debug";
import { randomUUID } from "crypto";
import { r2 } from "@storage/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadVideo = defineAction({
  input: z.object({
    video: z.instanceof(File),
    videoContent: z.instanceof(Uint8Array),
    nombrePartido: z.string(),
    fechaPartido: z.date()
  }),
  handler: async ({ video, videoContent, nombrePartido, fechaPartido }) => {
    try {
      const uuid = randomUUID();
      const fileName = `${nombrePartido.replace(/\s+/g, '_')}_${fechaPartido.toISOString()}_${uuid}.mp4`;

      if(video.size > 5000000000) { // 5GB limit
        throw new Error("El tamaño del video excede el límite permitido de 5GB.");
      }

      if (!['video/mp4', 'video/avi', 'video/mov', 'video/mkv'].includes(video.type)) {
        throw new Error("Tipo de archivo no soportado. Por favor, suba un video en formato MP4, AVI, MOV o MKV.");
      }

      await r2.send(
        new PutObjectCommand({
          Bucket: import.meta.env.R2_BUCKET,
          Key: fileName,
          Body: videoContent,
          ContentType: video.type,
        })
      )
      const videoUrl = `https://${import.meta.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${import.meta.env.R2_BUCKET}/${fileName}`;

      return { videoUrl };
    } catch (err) {
      console.error("Error al notificar video subido:", err);
      throw err;
    }
  },
});

import type { Partido } from "@interfaces/torneos.interface";
import { uploadFile } from "@services/index";
import { actions } from "astro:actions";
import Swal from "sweetalert2";
import { colorHexToRgb } from "./color_to_rgb";

export const generateVideoThumbnail = (videoFile: File) =>
  new Promise<string>((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const videoUrl = URL.createObjectURL(videoFile);

    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth / 2;
      canvas.height = video.videoHeight / 2;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(videoUrl);
        return reject("No se pudo obtener el contexto del canvas");
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(videoUrl);

          if (!blob) {
            return reject("No se pudo generar la miniatura");
          }

          const thumbnailUrl = URL.createObjectURL(blob);
          resolve(thumbnailUrl);
        },
        "image/png",
        0.8
      );
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject("Error al cargar el video");
    };
  });

async function uploadWithProgress(
  file: File,
  partidoId: number,
  color: string
): Promise<string> {
  const progressPopup = Swal.fire({
    title: "Subiendo video…",
    text: "Este proceso puede tardar varios minutos según el tamaño del archivo.",
    html: `
      <div style="width:100%;background:#e0e0e0;border-radius:5px;margin-top:10px">
        <div id="progress-bar" style="width:0;height:20px;background:#76c7c0;border-radius:5px"></div>
      </div>
      <div id="progress-text" style="margin-top:10px">0%</div>`,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const { key } = await uploadFile(file, partidoId, color, (pct) => {
      const bar = document.getElementById("progress-bar") as HTMLElement;
      const txt = document.getElementById("progress-text") as HTMLElement;
      if (bar) bar.style.width = `${pct}%`;
      if (txt) txt.textContent = `${pct}%`;
    });
    Swal.close();
    return key;
  } catch (err) {
    Swal.close();
    throw err;
  }
}

export async function startAnalysis(
  video: File,
  partido: Partido,
  color: string
): Promise<void> {
  if (partido.partidosubido) {
    await Swal.fire({
      icon: "warning",
      title: "Video ya subido",
      text: "El video ya fue subido anteriormente.",
    });
    return;
  }

  let key: string;
  const rgb = colorHexToRgb(color);
  const rgbString = rgb ? `${rgb.r},${rgb.g},${rgb.b}` : "193,2,48";
  console.log("Color seleccionado:", color, rgb);
  try {
    key = await uploadWithProgress(video, partido.idpartido, rgbString);
  } catch (e: any) {
    await Swal.fire({
      icon: "error",
      title: "Error al subir el video",
      text: e?.message || "Ocurrió un error al subir el video.",
    });
    return;
  }

  await Swal.fire({
    icon: "success",
    title: "Video subido correctamente",
    text: "Tu video fue subido y está siendo analizado; este proceso tardará varios minutos.",
  });

  partido.partidosubido = true;

  const { data, error } = await actions.partidoSubido(partido);
  console.log("Partido subido")
  if (error || !data) {
    await Swal.fire({
      icon: "error",
      title: "Error al actualizar el estado del partido",
      text: error?.message || "No se pudo actualizar el estado del partido.",
    });
  }
}

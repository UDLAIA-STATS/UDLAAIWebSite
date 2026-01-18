import axios, { AxiosError } from "axios";
import { suscribeVideoUpload } from "./suscribe_websocket";

export const uploadFile = async (
  file: File,
  partidoId: number,
  onProgress?: (percent: number) => void
): Promise<{ ok: true; key: string }> => {
  try {
    const uploadApi = import.meta.env.PUBLIC_UPLOAD_SERVICE_URL;
    const workerUrl = import.meta.env.PUBLIC_WORKER_URL;
//`${uploadApi}/generate-key/`
    const generatedKey = await axios.post(`${uploadApi}/generate-key/`, {
      video_name: file.name,
    });

    const videoKey = generatedKey.data.video_key;
    console.log("Generated video key:", videoKey);

    suscribeVideoUpload(videoKey, onProgress);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("id_partido", String(partidoId));
    formData.append("video_key", videoKey);
    console.log("Form data: ", Array.from(formData.entries()));

    const res = await axios.post(`${uploadApi}/upload/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Upload response:", res.data.message);

    return { ok: true, key: videoKey };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const backendMessage =
        err.response?.data?.data ||
        err.response?.data.error ||
        err.message ||
        "Error desconocido del servidor";
      throw new Error(`Error al subir el video: ${backendMessage}`);
    }

    throw new Error("Error inesperado al subir el video.");
  }
};

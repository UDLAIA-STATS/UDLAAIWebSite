import axios from "axios";

export const uploadFile = async (
  file: File,
  partidoId: number,
  onProgress?: (percent: number) => void
) => {
  try {
    const uploadApi = import.meta.env.UPLOAD_SERVICE_URL;
    console.log("UPLOAD SERVICE URL:", uploadApi);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("id_partido", String(partidoId));

    const res = await axios.post(`http://127.0.0.1:8050/api/upload/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;
        const pct = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(pct);
      },
    });

    return {
      ok: true,
      key: res.data.key as string,
    };
  } catch (err) {
    console.error(err);
    throw new Error("Error al subir el video, por favor intente nuevamente.");
  }
};

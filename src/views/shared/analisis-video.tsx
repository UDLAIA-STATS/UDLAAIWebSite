import { createSignal, onCleanup } from "solid-js";
import "@styles/global.css";
import { FilledButton } from "@components/buttons/FilledButton";
import UploadIcon from "@assets/upload_icon.svg";
import Add from "@assets/add.svg";
import { actions } from "astro:actions";
import Swal from "sweetalert2";

export default function VideoContainer() {
  const [nombrePartido, setNombrePartido] = createSignal("");
  const [fecha, setFecha] = createSignal("");
  const [file, setFile] = createSignal<File | null>(null);
  const [preview, setPreview] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [creatingNew, setCreatingNew] = createSignal(false);

  // Limpia el URL temporal cuando el componente se desmonta
  onCleanup(() => {
    if (preview()) URL.revokeObjectURL(preview()!);
  });

  // Crea un nuevo partido
  const handleCrearPartido = () => {
    if (creatingNew()) {
      Swal.fire({
        icon: "info",
        title: "Ya estás ingresando un video",
        text: "Completa los datos o sube el video antes de iniciar otro.",
      });
      return;
    }
    setNombrePartido("");
    setFecha("");
    setFile(null);
    setPreview(null);
    setCreatingNew(true);
  };

  // Extrae un frame del video como miniatura
  const generateVideoThumbnail = (videoFile: File) =>
    new Promise<string>((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      video.playsInline = true;
      video.onloadeddata = () => (video.currentTime = 1);
      video.onseeked = () => {
        canvas.width = video.videoWidth / 2;
        canvas.height = video.videoHeight / 2;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("No se pudo obtener el contexto del canvas");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        URL.revokeObjectURL(video.src);
        resolve(imageUrl);
      };
      video.onerror = reject;
    });

  // Maneja la carga del archivo
  const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files?.length) return;

    const selectedFile = target.files[0];
    const allowed = ["video/mp4", "video/x-matroska", "video/x-msvideo"];

    if (!allowed.includes(selectedFile.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato inválido",
        text: "Solo se permiten archivos .mp4, .mkv o .avi",
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Archivo demasiado grande",
        text: "El tamaño máximo permitido es de 5 GB.",
      });
      return;
    }

    try {
      setFile(selectedFile);
      const thumbnail = await generateVideoThumbnail(selectedFile);
      setPreview(thumbnail);
    } catch {
      Swal.fire({
        icon: "warning",
        title: "Sin previsualización",
        text: "No se pudo generar la miniatura del video, pero aún puedes subirlo.",
      });
    }
  };

  // Envía el formulario
  const submitVideo = async () => {
    if (!creatingNew()) {
      Swal.fire({
        icon: "warning",
        title: "Subida no iniciada",
        text: "Presiona 'Iniciar' para comenzar con el proceso.",
      });
      return;
    }

    if (!nombrePartido().trim() || !fecha().trim() || !file()) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Debes ingresar el nombre, la fecha y seleccionar un video.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombrePartido", nombrePartido());
    formData.append("fecha", fecha());
    formData.append("video", file()!);

    setLoading(true);
    try {
      const response = await actions.uploadVideo(formData);
      console.log("Archivo enviado correctamente:", response);
      Swal.fire({
        icon: "success",
        title: "Video subido correctamente",
        text: "Tu análisis está siendo procesado.",
      });
      setCreatingNew(false);
      setNombrePartido("");
      setFecha("");
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error enviando video:", error);
      Swal.fire({
        icon: "error",
        title: "Error al subir",
        text: "Ocurrió un problema al enviar el video. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col w-full h-full bg-[#D9D9D9] p-6">
      {/* Header */}
      <div class="text-center mb-6 flex flex-col justify-center items-center">
        <h1 class="font-bold text-2xl">Análisis de Video</h1>
        <p class="text-gray-500">
          Completa los datos y sube el video para su análisis
        </p>
        {!creatingNew() && (
          <FilledButton
            icon={Add.src}
            id="createNew"
            alt="Generar Análisis"
            label="Generar Análisis"
            className="mt-3"
            onClick={handleCrearPartido}
          />
        )}
      </div>

      {/* Layout dividido */}
      {creatingNew() ? (
        <div class="flex flex-row gap-6 bg-white rounded-xl shadow-md p-6 w-full h-[70vh]">
          {/* Columna izquierda - Formulario */}
          <div class="flex flex-col w-1/3 gap-1">
            <label class="text-sm font-medium text-gray-600">
              Nombre del partido
            </label>
            <input
              type="text"
              value={nombrePartido()}
              onInput={(e) => setNombrePartido(e.currentTarget.value)}
              placeholder="Ej. UDLA vs PUCE"
              class="p-2 border rounded-md border-gray-300"
            />
            <label class="mt-2 text-sm font-medium text-gray-600">Fecha</label>
            <input
              type="date"
              lang="es-ES"
              value={fecha()}
              onInput={(e) => setFecha(e.currentTarget.value)}
              class="p-2 border rounded-md border-gray-300"
            />

            <label class="mt-2 text-sm font-medium text-gray-600">Video</label>
            <span class="text-sm text-gray-400">Solo se admiten los formatos .mp4, .mkv y .avi</span>
            <input
              type="file"
              id="file-upload"
              class="hidden"
              onChange={handleFileChange}
            />
            <label
              for="file-upload"
              class="flex items-center mt-2 justify-center p-3 border border-dashed border-gray-400 rounded-md text-gray-600 cursor-pointer hover:bg-gray-100 transition"
            >
              { !file() ? "Subir video" : "Reemplazar video" }
            </label>

            <button
              class="mt-4 px-6 py-2 bg-[#C10230] text-white rounded hover:bg-[#A00128] transition disabled:opacity-50 cursor-pointer"
              onClick={submitVideo}
              disabled={loading()}
            >
              {loading() ? "Subiendo..." : "Enviar Video"}
            </button>
          </div>

          {/* Columna derecha - Previsualización */}
          <div class="flex flex-col justify-center items-center w-2/3 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {preview() ? (
              <img
                src={preview()!}
                alt="Previsualización del video"
                class="rounded-lg object-cover max-h-[400px] w-auto"
              />
            ) : (
              <div class="flex flex-col items-center justify-center h-full text-gray-500">
                <img src={UploadIcon.src} alt="Upload" class="mb-3 size-32" />
                <p class="text-lg font-semibold">Vista previa del video</p>
                <p class="text-sm text-gray-400">
                  Se generará automáticamente al subirlo
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div class="flex justify-center items-center h-[60vh] text-gray-600">
          <p class="text-lg font-medium">
            Presiona Generar Análisis” para iniciar un nuevo registro.
          </p>
        </div>
      )}
    </div>
  );
}

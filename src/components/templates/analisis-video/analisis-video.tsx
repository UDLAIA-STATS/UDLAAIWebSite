import { createSignal, For, onMount } from "solid-js";
import "@styles/global.css";
import UploadIcon from "@assets/upload_icon.svg";
import { actions } from "astro:actions";
import Swal from "sweetalert2";
import type { Partido, Temporada } from "@interfaces/torneos.interface";
import { generateVideoThumbnail, startAnalysis } from "@utils/analisis-video";
import { PreviewImage } from "@components/atoms/image/PreviewImage";

export default function VideoContainer() {
  const [partidoSeleccionado, setPartido] = createSignal<Partido | null>(null);
  const [file, setFile] = createSignal<File | null>(null);
  const [preview, setPreview] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [partidosBase, setPartidosBase] = createSignal<Partido[]>([]);
  const [partidos, setPartidos] = createSignal<Partido[]>([]);
  const [temporadas, setTemporadas] = createSignal<Temporada[]>([]);
  const [color, setColor] = createSignal<string>("#C10230");
  const [temporadaSeleccionada, setTemporadaSeleccionada] = createSignal<
    number | null
  >(null);

  onMount(async () => {
    const { data, error } = await actions.getPartidos({
      page: 1,
      pageSize: 1000,
    });
    const { data: temporadasData, error: temporadasError } =
      await actions.getTemporadas({ page: 1, pageSize: 1000 });

    if (error || !data || temporadasError || !temporadasData) {
      console.error("Error al cargar partidos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cargar partidos",
        text: "No se pudieron cargar los partidos disponibles. Inténtalo de nuevo más tarde.",
      });
    }

    const partidos =
      (data?.results as Partido[]).filter((p) => !p.partidosubido) || [];
    const temporadas = (temporadasData?.results as Temporada[]) || [];
    setTemporadas(temporadas);
    setPartidos(partidos);
    setPartidosBase(partidos);
  });


  const onTemporadaChange = (temporadaId: number) => {
    const partidosList = partidosBase().filter(
      (partido) => partido.idtemporada === temporadaId && !partido.partidosubido
    );
    setPartidos(partidosList);
    setTemporadaSeleccionada(temporadaId);
  };
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
      const thumbnailUrl = await generateVideoThumbnail(selectedFile);
      setPreview(thumbnailUrl);
      target.value = "";
    } catch {
      Swal.fire({
        icon: "warning",
        title: "Sin previsualización",
        text: "No se pudo generar la miniatura del video, pero aún puedes subirlo.",
      });
    }
  };

  const onColorChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    console.log(target.value);
    setColor(target.value);
  }

  const submitVideo = async () => {
    if (!partidoSeleccionado() || !file() || !temporadaSeleccionada()) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Debes seleccionar una temporada, partido e ingresar un video.",
      });
      return;
    }
    setLoading(true);
    try {
      await startAnalysis(file()!, partidoSeleccionado()!, color());

      setPreview(null);
      setFile(null);
      setPartido(null);
      setTemporadaSeleccionada(null);
    } catch (error) {
      console.error("Error enviando video:", error);
      Swal.fire({
        icon: "error",
        title: "Error al subir el video",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al subir el video.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col w-full align-middle h-full bg-[#D9D9D9] p-6">
      <div class="flex flex-row w-full h-min align-start self-start pb-5">
        <h2 class="text-2xl font-bold text-gray-800">Análisis de Video</h2>
      </div>
      {/* Layout dividido */}
      <div class="flex flex-row gap-6 bg-white rounded-xl shadow-md p-6 w-full h-[70vh]">
        {/* Columna izquierda - Formulario */}
        <div class="flex flex-col w-1/3 gap-1">
          <label class="text-sm font-medium text-gray-600">Temporada</label>
          <select
            name="temporadas"
            id="options-temporadas"
            class="p-2 border rounded-md border-gray-300"
            onChange={(e) => onTemporadaChange(Number(e.currentTarget.value))}
            value={temporadaSeleccionada() || ""}
          >
            <option value="" disabled selected>
              Selecciona una temporada
            </option>
            <For each={temporadas()}>
              {(temporada) => (
                <option value={temporada.idtemporada}>
                  {temporada.nombretemporada}
                </option>
              )}
            </For>
          </select>
          <label class="text-sm font-medium text-gray-600">Partido</label>
          <select
            name="partido"
            id="options-partidos"
            class="p-2 border rounded-md border-gray-300"
            onChange={(e) => {
              const partido = partidos().find(
                (p) => p.idpartido === Number(e.currentTarget.value)
              );
              setPartido(partido || null);
            }}
            value={partidoSeleccionado()?.idpartido || ""}
          >
            <option value="" disabled selected>
              Selecciona un partido
            </option>
            <For each={partidos()}>
              {(partido) => (
                <option value={partido.idpartido}>
                  {new Date(partido.fechapartido).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) +
                    " - " +
                    partido.equipo_local_nombre +
                    " vs " +
                    partido.equipo_visitante_nombre}
                </option>
              )}
            </For>
          </select>

          <label class="text-sm font-medium text-gray-600">Color</label>
          <input
            type="color"
            id="color-picker"
            class="w-full h-10 p-0 border-0 rounded-md cursor-pointer"
            value={color()}
            onChange={onColorChange}
          />

          <label class="mt-2 text-sm font-medium text-gray-600">Video</label>
          <span class="text-sm text-gray-400">
            Solo se admiten los formatos .mp4, .mkv y .avi
          </span>
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
            {!file() ? "Subir video" : "Reemplazar video"}
          </label>

          <button
            class="mt-4 px-6 py-2 bg-[#C10230] text-white rounded hover:bg-[#A00128] transition disabled:opacity-50 cursor-pointer"
            type="submit"
            id="btn-upload"
            onClick={submitVideo}
            disabled={loading()}
          >
            {loading() ? "Subiendo..." : "Enviar Video"}
          </button>
        </div>

        {/* Columna derecha - Previsualización */}
        <div class="flex flex-col justify-center items-center w-2/3 bg-gray-50 rounded-lg p-4 border border-gray-200">
          {preview() ? (
            <PreviewImage src={preview()!} />
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
    </div>
  );
}

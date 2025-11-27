// compresión real sin async/await directos
const compressChunk = (chunk: Blob): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const readable = chunk.stream();
      const compressedStream = readable.pipeThrough(
        new CompressionStream("deflate-raw")
      );
      const compressedBlob = await new Response(compressedStream).blob();
      resolve(compressedBlob);
    } catch (err) { reject(err); }
  });
};

export async function uploadWithParallelChunks(
  file: File,
  uploadUrl: string,
  onProgress: (percent: number) => void,
  concurrency = 3,
  chunkSize = 5 * 1024
): Promise<boolean> {
  const totalChunks = Math.ceil(file.size / chunkSize);
  let uploadedBytes = 0;
  let completedChunks = 0;
  let stopped = false;

  const uploadChunk = async (index: number) => {
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    let success = false;
    let attempts = 0;

    while (!success && attempts < 5 && !stopped) {
      attempts++;
      try {
        const res = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
          },
          body: chunk,
        });

        if (res.ok) {
          success = true;
          uploadedBytes += chunk.size;
          completedChunks++;
          const percent = Math.floor((uploadedBytes / file.size) * 100);
          onProgress(percent);
        } else {
          // backoff exponencial simple
          await new Promise((r) => setTimeout(r, 300 * attempts));
        }
      } catch (err) {
        // red de bajo nivel: reintentar con backoff
        await new Promise((r) => setTimeout(r, 300 * attempts));
      }
    }

    if (!success) {
      throw new Error(`Chunk ${index} failed permanently after ${attempts} attempts.`);
    }
  };

  return new Promise<boolean>((resolve, reject) => {
    let nextIndex = 0;
    let active = 0;

    const runNext = async () => {
      if (stopped) return;
      if (nextIndex >= totalChunks) {
        // si no quedan tareas por lanzar, terminar cuando no haya activas
        if (active === 0) resolve(true);
        return;
      }

      const index = nextIndex++;
      active++;

      uploadChunk(index)
        .then(() => {
          active--;
          // si completamos todos los chunks, resolvemos
          if (completedChunks >= totalChunks) {
            resolve(true);
            return;
          }
          // lanzar siguiente en la cola
          runNext();
        })
        .catch((err) => {
          stopped = true;
          reject(err);
        });
    };

    // arrancar el pool
    const initial = Math.min(concurrency, totalChunks);
    for (let i = 0; i < initial; i++) runNext();
  });
}

interface WebSocketMessage {
  progress: number;
  status: "processing" | "finished" | "error";
}

export const suscribeVideoUpload = (
  videoId: string,
  onProgress?: (percent: number) => void,
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const webSocketURL = import.meta.env.PUBLIC_WEBSOCKET_URL;
      console.log("Connecting to WebSocket at:", `${webSocketURL}/${videoId}/`);
      const sock = new WebSocket(`${webSocketURL}/${videoId}/`);

      sock.onopen = () => {
        console.log("Conectado al WebSocket");
      };

      sock.onmessage = (event) => {
        try {
          const { progress, status }: WebSocketMessage = JSON.parse(event.data);
          onProgress?.(progress);
          console.log(`Progreso: ${progress}%, Estado: ${status}`);

          if (status === "finished") {
            console.log("Proceso finalizado.");
            sock.close();
            resolve();
          } else if (status === "error") {
            console.error("Error en el procesamiento del video.");
            sock.close();
            reject(new Error("Error en el procesamiento del video."));
          }
        } catch (parseError) {
          console.error("Error al parsear mensaje del WebSocket.");
          reject(new Error("Error al parsear mensaje del WebSocket."));
        }
      };

      sock.onerror = () => {
        console.error("Error de conexión con el WebSocket.");
        reject(new Error("Error de conexión con el WebSocket."));
      };

      sock.onclose = (event) => {
        if (!event.wasClean) {
          console.error("Conexión cerrada inesperadamente.");
          reject(new Error("Conexión cerrada inesperadamente."));
        }
      };
    } catch (error) {
      console.error("Error al suscribirse a las actualizaciones del video.");
      reject(
        new Error("Error al suscribirse a las actualizaciones del video."),
      );
    }
  });
};

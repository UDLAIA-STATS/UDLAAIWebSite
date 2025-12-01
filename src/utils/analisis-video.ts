export const generateVideoThumbnail = (videoFile: File) =>
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
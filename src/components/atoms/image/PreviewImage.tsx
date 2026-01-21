import { onCleanup } from "solid-js";

interface PreviewImageProps {
  src: string;
}

export function PreviewImage(props: PreviewImageProps) {
  onCleanup(() => {
    URL.revokeObjectURL(props.src);
  });

  return (
    <img
      src={props.src}
      alt="Previsualización del video"
      class="rounded-lg object-cover max-h-[400px] w-auto"
    />
  );
}

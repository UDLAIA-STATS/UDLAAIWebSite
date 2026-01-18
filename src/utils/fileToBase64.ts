export async function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      // Remover encabezado tipo data:image/png;base64, si existe
      resolve(result);
    };

    reader.onerror = (error) => {
      reject(new Error(`Error al convertir archivo a Base64: ${error}`));
    };

    reader.readAsDataURL(file);
  });
}


export async function imageToBase64(file:File) {
    try {
        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const imageType = file.type.split('/')[1];

        return `data:image/${imageType};base64,${base64Image}`;
    } catch (error) {
        throw new Error(`Error al convertir imagen a Base64: ${error}`);
    }
}
export const colorHexToRgb = (
  hex: string,
): { r: number; g: number; b: number } | null => {
  // Elimina el símbolo '#' si está presente
  const cleanedHex = hex.replace(/^#/, "");

  // Verifica si el formato es válido (3 o 6 caracteres hexadecimales)
  if (!/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleanedHex)) {
    return null;
  }

  const r = parseInt(cleanedHex.substring(0, 2), 16);
  const g = parseInt(cleanedHex.substring(2, 4), 16);
  const b = parseInt(cleanedHex.substring(4, 6), 16);

  return { r, g, b };
};

export const parseColor = (color: string | number[]): string => {
  // 1. Si viene como string, parsear
  const arr = Array.isArray(color)
    ? color
    : JSON.parse(color.replace(/'/g, '"')); // por si usan comillas simples

  if (!Array.isArray(arr) || arr.length < 3) {
    throw new Error("Color inválido: se necesitan 3 componentes RGB");
  }

  // 2. Normalizar 0-255 y redondear
  const [r, g, b] = arr.slice(0, 3).map((v: any) => {
    const n = Math.round(Number(v));
    return Math.max(0, Math.min(255, n));
  });

  // 3. Convertir a HEX
  return (
    "#" +
    [r, g, b]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
      .toLowerCase()
  );
};

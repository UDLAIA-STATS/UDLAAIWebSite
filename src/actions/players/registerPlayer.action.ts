import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { PlayerService } from "@services/playerService";

// 🔹 Convierte un archivo a Base64 (para actualizaciones con foto)
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:${file.type};base64,${btoa(binary)}`;
}

// 🔸 Crear jugador
export const registerPlayer = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2).max(100),
    lastname: z.string().min(2).max(100),
    shirtNumber: z.coerce.number().min(1).max(99),
    position: z.string().min(2).max(50),
    photo: z.instanceof(File),
  }),
  handler: async ({ name, lastname, shirtNumber, position, photo }) => {
    try {
      const base64Image = await fileToBase64(photo);
      const newPlayer = await PlayerService.create({
        name,
        lastname,
        position,
        shirtNumber,
        playerImageUrl: base64Image,
      });

      return {
        data: {
          success: true,
          message: "Jugador registrado correctamente",
          player: newPlayer,
        }
      };
    } catch (error) {
      console.error("Error al registrar jugador:", error);
      return {
        error: {
          success: false,
          message: "Error al registrar el jugador",
        }
      };
    }
  },
});

// 🔹 Obtener jugadores paginados
export const getPlayers = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().min(1).default(1),
  }),
  handler: async ({ page }) => {
    try {
      const playersPage = await PlayerService.getPaginated(page);
      return {data: playersPage,};
    } catch (error) {
      console.error("Error al obtener jugadores:", error);
      return {error: "Error al obtener los jugadores",};
    }
  },
});

// 🔹 Actualizar jugador parcialmente
export const updatePlayer = defineAction({
  accept: "form",
  input: z.object({
    id: z.coerce.number().min(1),
    name: z.string().min(2).max(100).optional(),
    lastname: z.string().min(2).max(100).optional(),
    position: z.string().min(2).max(50).optional(),
    shirtNumber: z.coerce.number().min(1).max(99).optional(),
    photo: z.instanceof(File).optional(),
  }),
  handler: async ({ id, name, lastname, position, shirtNumber, photo }) => {
    try {
      const partialData: Record<string, unknown> = {
        ...(name && { name }),
        ...(lastname && { lastname }),
        ...(position && { position }),
        ...(shirtNumber && { shirtNumber }),
      };

      if (photo) {
        partialData.playerImageUrl = await fileToBase64(photo);
      }

      const updated = await PlayerService.patch(id, partialData);

      if (!updated) {
        return { success: false, message: "Jugador no encontrado" };
      }

      return {
        success: true,
        message: "Jugador actualizado correctamente",
        player: updated,
      };
    } catch (error) {
      console.error("Error al actualizar jugador:", error);
      return {
        success: false,
        message: "Error al actualizar el jugador",
      };
    }
  },
});

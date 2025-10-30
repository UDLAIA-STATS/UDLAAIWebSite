import type { Player } from "@interfaces/player.interface";

export type CreatePlayerDTO = Omit<Player, "id"> & { id?: number };
export type UpdatePlayerDTO = Partial<Player>;

const COOKIE_KEY = "players";
const PAGE_SIZE = 10;

export class PlayerService {
  /** Obtiene todos los jugadores almacenados */
  private static async getAll(): Promise<Player[]> {
    try {
      const stored = await cookieStore.get(COOKIE_KEY);
      if (!stored?.value) return [];
      return JSON.parse(stored.value) as Player[];
    } catch {
      return [];
    }
  }

  /** Guarda todos los jugadores */
  private static async saveAll(players: Player[]): Promise<void> {
    await cookieStore.set(COOKIE_KEY, JSON.stringify(players));
  }

  /** Crear un nuevo jugador */
  static async create(player: CreatePlayerDTO): Promise<Player> {
    const players = await this.getAll();
    const newId: number = player.id ?? (players.length ? Math.max(...players.map(p => p.id)) + 1 : 1);

    const newPlayer: Player = {
      id: newId,
      name: player.name,
      lastname: player.lastname,
      position: player.position,
      shirtNumber: player.shirtNumber,
      playerImageUrl: player.playerImageUrl,
    };

    players.push(newPlayer);
    await this.saveAll(players);
    return newPlayer;
  }

  /** Obtener jugadores paginados */
  static async getPaginated(page: number = 1): Promise<{
    data: Player[];
    total: number;
    pages: number;
  }> {
    const players = await this.getAll();
    const pages = Math.ceil(players.length / PAGE_SIZE);
    const offset = (page - 1) * PAGE_SIZE;
    const data = players.slice(offset, offset + PAGE_SIZE);
    return { data, total: players.length, pages };
  }

  /** Actualizar parcialmente un jugador */
  static async patch(id: number, partial: UpdatePlayerDTO): Promise<Player | null> {
    const players = await this.getAll();
    const index = players.findIndex(p => p.id === id);
    if (index === -1) return null;

    players[index] = { ...players[index], ...partial };
    await this.saveAll(players);
    return players[index];
  }

  /** Eliminar un jugador */
  static async delete(id: number): Promise<boolean> {
    const players = await this.getAll();
    const newPlayers = players.filter(p => p.id !== id);
    if (newPlayers.length === players.length) return false;

    await this.saveAll(newPlayers);
    return true;
  }

  /** Eliminar todos los jugadores (opcional) */
  static async clearAll(): Promise<void> {
    await cookieStore.delete(COOKIE_KEY);
  }
}
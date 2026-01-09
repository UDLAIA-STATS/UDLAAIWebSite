import type {
  AnalyzedData,
  AnalyzedDataTable,
  Partido,
  Player,
  ProcessDataValues,
} from "@interfaces/index";
import { actions } from "astro:actions";

export const getProcessedData = async (
  dataValues: ProcessDataValues
): Promise<AnalyzedDataTable[]> => {
  try {

    const analyzedData: AnalyzedData[] = dataValues.analyzedData;
    const partidos: Partido[] = dataValues.partidos;
    const players: Player[] = dataValues.players;

    const partidosMap = new Map(partidos.map((p) => [p.idpartido, p]));
    const playersMap = new Map(players.map((p) => [p.idjugador, p]));

    let rows: AnalyzedDataTable[] = [];

    for (const item of analyzedData) {
      const partido = partidosMap.get(item.match_id);
      const player = players.find(
        (p) => p.jugadoractivo && p.numerocamisetajugador === item.shirt_number
      );

      if (dataValues.query && !matchesSearch(partido, player, dataValues.query)) continue;

      rows.push({
        id: item.id,
        match_id: item.match_id,
        player_id: item.player_id,
        player_name: player
          ? `${player.nombrejugador} ${player.apellidojugador}`
          : "No Reconocido",
        shirt_number: item.shirt_number,
        tournament_name: partido?.torneo_nombre || "No encontrado",
        score: partido
          ? `${partido.marcadorequipolocal} vs ${partido.marcadorequipovisitante}`
          : "No encontrado",
        match_date: partido
          ? new Date(partido.fechapartido).toLocaleString()
          : "",
        analysis_date: new Date(item.created_at).toLocaleString(),
        detail_route: `/jugador-detalle/${item.id}`,
      });
    }

    const asc = dataValues.orderBy !== "desc";
    rows.sort((a, b) => {
      let va: string | number;
      let vb: string | number;

      switch (dataValues.sortBy) {
        case "shirt_number":
          va = a.shirt_number;
          vb = b.shirt_number;
          break;
        case "tournament":
          va = a.tournament_name;
          vb = b.tournament_name;
          break;
        case "match_date":
          va = new Date(a.match_date).getTime();
          vb = new Date(b.match_date).getTime();
          break;
        case "analysis_date":
          va = new Date(a.analysis_date).getTime();
          vb = new Date(b.analysis_date).getTime();
          break;
        case "player":
        default:
          va = a.player_name;
          vb = b.player_name;
          break;
      }

      if (typeof va === "string") {
        return asc
          ? va.localeCompare(vb as string)
          : (vb as string).localeCompare(va);
      }
      return asc
        ? (va as number) - (vb as number)
        : (vb as number) - (va as number);
    });

    console.info("Filtered rows:", rows.length);

    return rows;
  } catch (err) {
    console.error("Error obteniendo datos:", err);
    return [];
  }
};

const matchesSearch = (
  partido: Partido | undefined,
  jugador: Player | undefined,
  search: string
): boolean => {
  const s = search.toLowerCase();

  const playerName =
    `${jugador?.nombrejugador} ${jugador?.apellidojugador}`.toLowerCase();
  const shirtNum = String(jugador?.numerocamisetajugador);
  const tournament = partido?.torneo_nombre?.toLowerCase() || "";
  const matchDate = partido
    ? new Date(partido.fechapartido).toLocaleString().toLowerCase()
    : "";

  return (
    playerName.includes(s) ||
    shirtNum === s ||
    tournament.includes(s) ||
    matchDate.includes(s)
  );
};

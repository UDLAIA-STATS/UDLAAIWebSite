import type {
  AnalyzedData,
  AnalyzedDataTable,
  Partido,
  Player,
  ProcessDataValues,
} from "@interfaces/index";
import { actions } from "astro:actions";

export const getTeamsIds = (data: AnalyzedDataTable[]): Set<number> => {
  const teamsSet = new Set<number>();

  for (const item of data) {
    if (!teamsSet.has(Number(item.team))) {
      teamsSet.add(Number(item.team));
    }
  }

  return teamsSet;
};

export const getSeasonsOnData = (
  data: AnalyzedDataTable[],
): Set<{ id: number; name: string }> => {
  const seasonsMap = new Map<number, string>();
  const seasonsSet = new Set<{ id: number; name: string }>();

  for (const item of data) {
    if (!seasonsMap.has(item.temporada_id)) {
      seasonsMap.set(item.temporada_id, item.temporada_nombre);
      seasonsSet.add({ id: item.temporada_id, name: item.temporada_nombre });
    }
  }

  return seasonsSet;
};

export const filterDataOnSeason = (
  data: AnalyzedDataTable[],
  seasonId: number,
) => data.filter((item) => item.temporada_id === seasonId);

export const filterDataOnDateRange = (
  data: AnalyzedDataTable[],
  startDate: Date,
  endDate: Date,
) =>
  data.filter((item) => {
    return (
      new Date(parseDDMMYYYY(item.match_date)) >= startDate &&
      new Date(parseDDMMYYYY(item.match_date)) <= endDate
    );
  });

const parseDDMMYYYY = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split(",")[0].split("/").map(Number);
  console.log("Parsed date:", { day, month, year });
  return new Date(year, month - 1, day);
};

export const filterDataOnTeam = (data: AnalyzedDataTable[], teamId: number) =>
  data.filter((item) => Number(item.team) === teamId);

export const getProcessedData = async (
  dataValues: ProcessDataValues,
): Promise<AnalyzedDataTable[]> => {
  try {
    const analyzedData: AnalyzedData[] = dataValues.analyzedData;
    const partidos: Partido[] = dataValues.partidos;
    const players: Player[] = dataValues.players;

    const partidosMap = new Map(partidos.map((p) => [p.idpartido, p]));

    let rows: AnalyzedDataTable[] = [];

    for (const item of analyzedData) {
      const partido = partidosMap.get(item.match_id);
      const player = players.find(
        (p) => p.jugadoractivo && p.numerocamisetajugador === item.shirt_number,
      );

      if (dataValues.query && !matchesSearch(partido, player, dataValues.query))
        continue;

      rows.push({
        id: item.id,
        match_id: item.match_id,
        temporada_nombre: partido?.temporada_nombre || "No encontrado",
        temporada_id: partido?.idtemporada || 0,
        player_id: item.player_id,
        team: item.team,
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
  search: string,
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

export const filterMatchsByPlayer = async (
  player_id: number,
): Promise<Partido[]> => {
  const analyzedDataRes = await actions.getAnalyzedData.orThrow({
    limit: 10000,
    player_id: player_id,
  });

  const partidos: Map<number, Partido> = new Map();

  for (const analyzed of analyzedDataRes.results as AnalyzedData[]) {
    const matchId = analyzed.match_id;
    if (!partidos.has(matchId) && analyzed.player_id === player_id) {
      const partidoRes = await actions.getPartidoById.orThrow({ id: matchId });
      partidos.set(matchId, partidoRes.data as Partido);
    }
  }

  return Array.from(partidos.values());
};

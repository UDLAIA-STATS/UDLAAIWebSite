import type { Player } from "./player.interface";
import type { Partido } from "./torneos.interface";

export interface AnalyzedData {
  id: number;
  player_id: number;
  match_id: number;
  shirt_number: number;
  team: string;
  team_color: string;
  passes: number;
  shots_on_target: number;
  has_goal: boolean;
  avg_speed_kmh: string;
  avg_possession_time_s: string;
  distance_km: string;
  heatmap_image_path: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyzedDataTable {
  id: number;
  match_id: number;
  player_id: number;

  player_name: string;
  shirt_number: number;
  tournament_name: string;
  score: string;
  match_date: string;
  analysis_date: string;

  team: string; // Team id

  temporada_nombre: string;
  temporada_id: number;

  detail_route: string;
}

export interface ProcessDataValues {
  players: Player[];
  analyzedData: AnalyzedData[];
  partidos: Partido[];
  page: number;
  query?: string;
  sortBy?: string;
  orderBy?: string;
  groupBy?: string;
}

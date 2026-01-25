export interface Player {
  idjugador: number;
  idbanner: string;
  nombrejugador: string;
  apellidojugador: string;
  posicionjugador: "Delantero" | "Mediocampista" | "Defensa" | "Portero";
  numerocamisetajugador: number;
  imagenjugador?: string | null;
  jugadoractivo: boolean;
}

export interface PlayerStatistic {
  id: number;
  name: string;
  lastname: string;
  position: string;
  team: string;
  shirtNumber: number;
  minutesPlayed: number;
  goalsNumber: number;
  goalAverage: number;
  soccerGoalShotsPercentage: number;
  soccerGoalShots: number;
  shotsNumber: number;
  coveredDistance: number;
  playerImageUrl: string;
  heatmapUrl: string;
}

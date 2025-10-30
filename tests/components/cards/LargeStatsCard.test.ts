import { expect, test } from "vitest";
import LargeStatsCard from "../../../src/components/cards/LargeStatsCard.astro";
import { renderAstroComponent } from "../../helpers.ts";
import type { PlayerStatistic } from "../../../src/interfaces/player.interface.ts"; 
test("LargeStatsCard renders player stats correctly", async () => {
  const mockPlayer: PlayerStatistic = {
    position: "Delantero",
    team: "UDLA FC",
    shirtNumber: 10,
    heatmapUrl: "https://example.com/heatmap.png",
    id: 1,
    name: "Lionel",
    lastname: "Messi",
    playerImageUrl: "https://example.com/player.jpg",
    minutesPlayed: 90,
    goalsNumber: 2,
    goalAverage: 0.5,
    soccerGoalShotsPercentage: 60,
    soccerGoalShots: 6,
    shotsNumber: 10,
    coveredDistance: 7200,
  };

  const result = await renderAstroComponent(LargeStatsCard, {
    props: { player: mockPlayer },
  });

  expect(result).toContain("Delantero");
  expect(result).toContain("UDLA FC");
  expect(result).toContain("Mapa de Calor");
});

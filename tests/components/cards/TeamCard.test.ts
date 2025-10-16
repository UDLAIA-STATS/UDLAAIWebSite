import { expect, test } from "vitest";
import TeamCard from "../../../src/components/cards/TeamCard.astro";
import { renderAstroComponent } from "../../helpers";

test("TeamCard renders player name and buttons correctly", async () => {
  const result = await renderAstroComponent(TeamCard, {
    props: {
      playerName: "Cristiano Ronaldo",
      playerId: 7,
      profileImage: "/img/ronaldo.png",
    },
  });

  expect(result).toContain("Cristiano Ronaldo");
  expect(result).toContain("Editar");
  expect(result).toContain("Eliminar");
});

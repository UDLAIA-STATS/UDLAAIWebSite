import { expect, test } from "vitest";
import SmallStatsCard from "../../../src/components/molecules/cards/SmallStatsCard.astro";
import { renderAstroComponent } from "../../helpers.ts";

test("SmallStatsCard renders correctly with props", async () => {
  const result = await renderAstroComponent(SmallStatsCard, {
    props: {
      href: "/jugador/1",
      imgSrc: "/img/test.png",
      title: "Lionel Messi",
      subtitle: "Delantero",
    },
  });

  expect(result).toContain("Lionel Messi");
  expect(result).toContain("Delantero");
  expect(result).toContain("/jugador/1");
});

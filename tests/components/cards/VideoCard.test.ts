import { expect, test } from "vitest";
import VideoCard from "../../../src/components/cards/VideoCard.astro";
import { renderAstroComponent } from "../../helpers";

test("VideoCard renders partido and fecha correctly", async () => {
  const result = await renderAstroComponent(VideoCard, {
    props: {
      partido: "UDLA vs ESPOL",
      fecha: "2025-05-01",
    },
  });

  expect(result).toContain("UDLA vs ESPOL");
  expect(result).toContain("2025-05-01");
});

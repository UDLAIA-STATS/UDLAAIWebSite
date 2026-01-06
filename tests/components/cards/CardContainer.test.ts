import { expect, test } from "vitest";
import CardContainer from "../../../src/components/molecules/cards/CardContainer.astro";
import { renderAstroComponent } from "../../helpers.ts";

test("CardContainer renders correctly with slot content", async () => {
  const result = await renderAstroComponent(CardContainer, {
    props: { className: "w-64 h-32" },
    slots: { default: "<p>Contenido de prueba</p>" },
  });

  expect(result).toContain('id="card-container"');
  expect(result).toContain("w-64 h-32");
  expect(result).toContain("Contenido de prueba");
});

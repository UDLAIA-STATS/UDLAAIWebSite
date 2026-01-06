import { expect, test } from "vitest";
import CardDetail from "../../../src/components/molecules/cards/CardDetail.astro";
import { renderAstroComponent } from "../../helpers.ts";

test("CardDetail renders title and detail correctly", async () => {
  const result = await renderAstroComponent(CardDetail, {
    props: { title: "Nombre", detail: "Lionel Messi" },
  });

  expect(result).toContain("Nombre");
  expect(result).toContain("Lionel Messi");
});

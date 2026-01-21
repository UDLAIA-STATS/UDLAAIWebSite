import { expect, test } from "vitest";
import Footer from "@components/organisms/Footer.astro";
import { renderAstroComponent } from "../../helpers.ts";

test("Footer renders resource links correctly", async () => {
  const result = await renderAstroComponent(Footer);

  expect(result).toContain("Recursos");
  expect(result).toContain("/contacto");
  expect(result).toContain("/about");
  expect(result).toContain("/terminos");
  expect(result).toContain("/privacidad");
});

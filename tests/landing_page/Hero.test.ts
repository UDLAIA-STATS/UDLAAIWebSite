import { expect, test } from "vitest";
import Hero from "@components/templates/landing_page/Hero.astro";
import { renderAstroComponent } from "../helpers";

test("Hero renders correctly with title and buttons", async () => {
  const result = await renderAstroComponent(Hero);

  expect(result).toContain("Herramienta de Extracción de Datos de Partidos");
  expect(result).toContain("Iniciar Ahora");
  expect(result).toContain("Estadísticas");
});

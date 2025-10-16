import { expect, test, vi } from "vitest";
import Navbar from "../../../src/components/shared/Navbar.astro";
import { renderAstroComponent } from "../../helpers";

vi.mock("../../../src/consts/navbar-links", () => ({
  getNavbarLinks: () => [{ href: "/", name: "Inicio" }],
  navbarLinks: [],
}));

test("Navbar renders logo and navigation links", async () => {
  const result = await renderAstroComponent(Navbar);

  expect(result).toContain("Logo UDLA");
  expect(result).toContain("Inicio");
  expect(result).toContain("Bienvenido");
});

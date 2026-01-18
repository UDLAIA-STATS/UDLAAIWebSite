import { expect, test } from "vitest";
import LazyImage from "../../../src/components/image/LazyImage.astro";
import { renderAstroComponent } from "../../helpers.ts";
import File from "../../../src/assets/logo_udla_corto.png";

test("LazyImage renders provided image", async () => {
  const result = await renderAstroComponent(LazyImage, {
    props: {
      src: File.src,
      alt: "Test",
      width: 200,
      height: 200,
    },
  });

  const encodedFilePath = encodeURIComponent(File.src);

  expect(result).toMatch(/<img[^>]+src="[^"]*logo_udla_corto\.png[^"]*"/);
  expect(result).toContain("alt=\"Test\"");
  expect(result).toContain("width=\"200\"");
  expect(result).toContain("height=\"200\"");
});

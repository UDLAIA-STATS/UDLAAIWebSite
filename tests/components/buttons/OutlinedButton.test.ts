import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import OutlinedButton from "../../../src/components/buttons/OutlinedButton.astro"
import { renderAstroComponent } from "../../helpers.ts";


test('OutlinedButton component renders correctly', async () => {
    const result = await renderAstroComponent(OutlinedButton, {
        props: {
            label: "Test Button",
            href: "https://example.com",
            iconPosition: "left"
        },
    });

    expect(result).toContain('Test Button');
})
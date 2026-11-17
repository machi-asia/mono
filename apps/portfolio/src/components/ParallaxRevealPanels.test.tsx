import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import ParallaxChapterReveal, {
    ParallaxChapterReveal as NamedParallaxChapterReveal,
    type RevealShapeVariant,
} from "./ParallaxRevealPanels";

describe("ParallaxChapterReveal", () => {
    afterEach(() => {
        cleanup();
    });

    it("exports named and default ParallaxChapterReveal component", () => {
        expect(ParallaxChapterReveal).toBeDefined();
        expect(NamedParallaxChapterReveal).toBe(ParallaxChapterReveal);
    });

    it("renders all 4 geometric reveal variants with multi-shade black panels and difference blend inversion", () => {
        const variants: RevealShapeVariant[] = ["circle", "slab", "pill", "diagonal"];

        for (const variant of variants) {
            const testId = `reveal-${variant}`;
            const { unmount } = render(
                <ParallaxChapterReveal
                    variant={variant}
                    primaryShade="#0c0c10"
                    secondaryShade="#1f1f27"
                    align="center"
                    testId={testId}
                />
            );

            const container = screen.getByTestId(testId);
            expect(container).toHaveAttribute("data-variant", variant);

            const primaryPanel = screen.getByTestId(`${testId}-primary-panel`);
            const secondaryPanel = screen.getByTestId(`${testId}-secondary-panel`);
            const invertShape = screen.getByTestId(`${testId}-invert-shape`);

            expect(primaryPanel).toHaveStyle({ backgroundColor: "#0c0c10" });
            expect(secondaryPanel).toHaveStyle({ backgroundColor: "#1f1f27" });
            expect(invertShape).toHaveStyle({ mixBlendMode: "difference" });

            unmount();
        }
    });

    it("supports left and right alignment offsets", () => {
        render(
            <>
                <ParallaxChapterReveal align="left" testId="left-reveal" />
                <ParallaxChapterReveal align="right" testId="right-reveal" />
            </>
        );

        expect(screen.getByTestId("left-reveal-invert-shape")).toHaveStyle({ left: "6%" });
        expect(screen.getByTestId("right-reveal-invert-shape")).toHaveStyle({ right: "6%" });
    });
});

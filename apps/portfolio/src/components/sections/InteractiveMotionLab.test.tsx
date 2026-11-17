import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import InteractiveMotionLab from "./InteractiveMotionLab";

describe("InteractiveMotionLab", () => {
    afterEach(() => {
        cleanup();
    });
    it("renders header, inversion playground stage, all 3 inversion shapes, and 4 spring presets", () => {
        render(<InteractiveMotionLab />);

        expect(screen.getByText(/05 \/\/ INTERACTIVE MOTION LAB/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /Interactive Motion Lab/i })).toBeInTheDocument();
        expect(screen.getByText("INVERT THE VOID")).toBeInTheDocument();

        const circleShape = screen.getByTestId("inversion-shape-circle-portal");
        const slabShape = screen.getByTestId("inversion-shape-architectural-slab");
        const ringShape = screen.getByTestId("inversion-shape-kinetic-ring");

        expect(circleShape).toHaveStyle({ mixBlendMode: "difference" });
        expect(slabShape).toHaveStyle({ mixBlendMode: "difference" });
        expect(ringShape).toHaveStyle({ mixBlendMode: "difference" });

        expect(screen.getByTestId("spring-preset-snappy")).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByTestId("spring-preset-elastic")).toBeInTheDocument();
        expect(screen.getByTestId("spring-preset-heavy")).toBeInTheDocument();
        expect(screen.getByTestId("spring-preset-zero-g")).toBeInTheDocument();
    });

    it("toggles geometric inversion shapes on and off and restores them on reset", () => {
        render(<InteractiveMotionLab />);

        const circleToggle = screen.getByTestId("toggle-shape-circle-portal");
        expect(circleToggle).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByTestId("inversion-shape-circle-portal")).toBeInTheDocument();

        fireEvent.click(circleToggle);
        expect(circleToggle).toHaveAttribute("aria-pressed", "false");

        const slabToggle = screen.getByTestId("toggle-shape-architectural-slab");
        fireEvent.click(slabToggle);
        expect(slabToggle).toHaveAttribute("aria-pressed", "false");

        fireEvent.click(screen.getByTestId("motion-lab-reset-btn"));
        expect(circleToggle).toHaveAttribute("aria-pressed", "true");
        expect(slabToggle).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByTestId("inversion-shape-circle-portal")).toBeInTheDocument();
        expect(screen.getByTestId("inversion-shape-architectural-slab")).toBeInTheDocument();
    });

    it("switches spring physics presets and updates spring telemetry", () => {
        render(<InteractiveMotionLab />);

        const telemetry = screen.getByTestId("spring-telemetry");
        expect(telemetry).toHaveTextContent("PRESET: SNAPPY");
        expect(telemetry).toHaveTextContent("STIFFNESS 520 / DAMPING 28 / MASS 0.7");

        fireEvent.click(screen.getByTestId("spring-preset-elastic"));
        expect(screen.getByTestId("spring-preset-elastic")).toHaveAttribute("aria-pressed", "true");
        expect(telemetry).toHaveTextContent("PRESET: ELASTIC");
        expect(telemetry).toHaveTextContent("STIFFNESS 260 / DAMPING 10 / MASS 0.9");

        fireEvent.click(screen.getByTestId("spring-preset-heavy"));
        expect(telemetry).toHaveTextContent("PRESET: HEAVY");
        expect(telemetry).toHaveTextContent("STIFFNESS 140 / DAMPING 32 / MASS 2.8");

        fireEvent.click(screen.getByTestId("spring-preset-zero-g"));
        expect(telemetry).toHaveTextContent("PRESET: ZERO-G");
        expect(telemetry).toHaveTextContent("STIFFNESS 65 / DAMPING 8 / MASS 1.6");
    });

    it("engages kinetic tiles on click and increments kinetic pulse counter", () => {
        render(<InteractiveMotionLab />);

        const pulseCount = screen.getByTestId("motion-lab-pulse-count");
        expect(pulseCount).toHaveTextContent("KINETIC PULSES // 00");

        const displaceTile = screen.getByTestId("kinetic-tile-displace");
        expect(displaceTile).toHaveAttribute("aria-pressed", "false");

        fireEvent.click(displaceTile);
        expect(displaceTile).toHaveAttribute("aria-pressed", "true");
        expect(displaceTile).toHaveTextContent("ENGAGED");
        expect(pulseCount).toHaveTextContent("KINETIC PULSES // 01");

        fireEvent.click(screen.getByTestId("kinetic-tile-invert"));
        expect(pulseCount).toHaveTextContent("KINETIC PULSES // 02");
    });
});

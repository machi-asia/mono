import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ForgeWorldPage from "../app/page";

// Mock @mono/sync hooks
vi.mock("@mono/sync", async () => {
  const actual = await vi.importActual<any>("@mono/sync");
  return {
    ...actual,
    useSyncRoom: () => ({
      connected: true,
      protocol: "udp-webrtc",
      members: ["user_1", "user_2"],
      recentEvents: [],
      userId: "user_1",
      broadcastEvent: vi.fn(),
    }),
    useSyncInput: vi.fn(),
  };
});

// Mock Pixi renderer to avoid WebGL context requirements in jsdom
vi.mock("../game/pixi-renderer", () => {
  return {
    GameEngineRenderer: class {
      init = vi.fn().mockResolvedValue(undefined);
      drawWorldGrid = vi.fn();
      updatePlayers = vi.fn();
      centerCameraOn = vi.fn();
      destroy = vi.fn();
    },
  };
});

describe("ForgeWorldPage (2D Multiplayer)", () => {
  it("renders live multiplayer HUD, radar, blood gauge, and anatomical body doll", () => {
    render(<ForgeWorldPage />);
    expect(screen.getByText(/LIVE MULTIPLAYER/i)).toBeInTheDocument();
    expect(screen.getByText("SPATIAL RADAR")).toBeInTheDocument();
    expect(screen.getByText("BLOOD VOLUME")).toBeInTheDocument();
    expect(screen.getByText("STATUS & ARMOR")).toBeInTheDocument();
    expect(screen.getByText("Head")).toBeInTheDocument();
    expect(screen.getByText("Torso")).toBeInTheDocument();
    expect(screen.getByText("W")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
    expect(screen.getByText("SPACE")).toBeInTheDocument();
    expect(screen.getByText(/Left Click:/i)).toBeInTheDocument();
    expect(screen.getByText("sword")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /auto/i })).toBeInTheDocument();
    expect(screen.getByText("AUTO: OFF")).toBeInTheDocument();
  });
});

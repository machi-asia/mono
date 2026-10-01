import { describe, it, expect } from "vitest";
import {
  applyMovement,
  clampToWorldBounds,
  resolvePlayerCollisions,
} from "../game/physics";
import { PlayerState, WorldConfig, DEFAULT_WORLD_CONFIG } from "../game/types";
import { createDefaultHealthSystem } from "../game/health";

describe("2D Physics & Movement", () => {
  it("accelerates player according to input vector and applies friction", () => {
    const player: PlayerState = {
      id: "p1",
      name: "Test",
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 20,
      color: 0xff0000,
      health: createDefaultHealthSystem(),
    };

    // Press right (D)
    applyMovement(player, { x: 1, y: 0 }, DEFAULT_WORLD_CONFIG);

    expect(player.vx).toBeGreaterThan(0);
    expect(player.x).toBeGreaterThan(100);
    expect(player.y).toBe(100);
    expect(player.angle).toBe(0);
  });

  it("normalizes diagonal input vector so speed does not exceed maxSpeed", () => {
    const player: PlayerState = {
      id: "p1",
      name: "Test",
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 20,
      color: 0xff0000,
      health: createDefaultHealthSystem(),
    };

    // Repeated acceleration diagonally
    for (let i = 0; i < 30; i++) {
      applyMovement(player, { x: 1, y: 1 }, DEFAULT_WORLD_CONFIG);
    }

    const speed = Math.hypot(player.vx, player.vy);
    expect(speed).toBeLessThanOrEqual(DEFAULT_WORLD_CONFIG.maxSpeed);
  });

  it("clamps players strictly within world boundaries including radius", () => {
    const player: PlayerState = {
      id: "p1",
      name: "Test",
      x: 10, // Below minimum radius 28
      y: 3500, // Above world height 3200
      vx: -5,
      vy: 10,
      angle: 0,
      radius: 28,
      color: 0xff0000,
      health: createDefaultHealthSystem(),
    };

    clampToWorldBounds(player, DEFAULT_WORLD_CONFIG);

    expect(player.x).toBe(28);
    expect(player.vx).toBe(0);
    expect(player.y).toBe(DEFAULT_WORLD_CONFIG.height - 28);
    expect(player.vy).toBe(0);
  });
});

describe("Circle-to-Circle Collision Resolution", () => {
  it("resolves overlap and separates two colliding players", () => {
    const p1: PlayerState = {
      id: "p1",
      name: "Player 1",
      x: 100,
      y: 100,
      vx: 2,
      vy: 0,
      angle: 0,
      radius: 25,
      color: 0xff0000,
      health: createDefaultHealthSystem(),
    };

    const p2: PlayerState = {
      id: "p2",
      name: "Player 2",
      x: 130, // Distance is 30, but combined radii is 50 -> 20px overlap
      y: 100,
      vx: -2,
      vy: 0,
      angle: Math.PI,
      radius: 25,
      color: 0x0000ff,
      health: createDefaultHealthSystem(),
    };

    resolvePlayerCollisions([p1, p2]);

    const finalDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    // After resolution, distance should be equal to or greater than minimum distance (50)
    expect(finalDistance).toBeGreaterThanOrEqual(49.99);
    expect(p1.x).toBeLessThan(100);
    expect(p2.x).toBeGreaterThan(130);
  });

  it("does not displace players that are not colliding", () => {
    const p1: PlayerState = {
      id: "p1",
      name: "Player 1",
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 20,
      color: 0xff0000,
      health: createDefaultHealthSystem(),
    };

    const p2: PlayerState = {
      id: "p2",
      name: "Player 2",
      x: 200, // Distance is 100, well above 40
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 20,
      color: 0x0000ff,
      health: createDefaultHealthSystem(),
    };

    resolvePlayerCollisions([p1, p2]);

    expect(p1.x).toBe(100);
    expect(p2.x).toBe(200);
  });

  it("only displaces local player when colliding with an authoritative remote player", () => {
    const localPlayer: PlayerState = {
      id: "local",
      name: "Local",
      x: 100,
      y: 100,
      vx: 1,
      vy: 0,
      angle: 0,
      radius: 25,
      color: 0xff0000,
      isLocal: true,
      health: createDefaultHealthSystem(),
    };

    const remotePlayer: PlayerState = {
      id: "remote",
      name: "Remote",
      x: 130, // 20px overlap
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 25,
      color: 0x0000ff,
      isLocal: false,
      health: createDefaultHealthSystem(),
    };

    resolvePlayerCollisions([localPlayer, remotePlayer]);

    // Remote player must remain authoritative (not displaced)
    expect(remotePlayer.x).toBe(130);
    expect(remotePlayer.y).toBe(100);

    // Local player should take the entire separation pushback
    expect(localPlayer.x).toBeLessThan(100);
    const finalDistance = Math.hypot(remotePlayer.x - localPlayer.x, remotePlayer.y - localPlayer.y);
    expect(finalDistance).toBeGreaterThanOrEqual(49.99);
  });
});

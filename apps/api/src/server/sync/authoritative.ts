export interface AuthoritativePlayer {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  color: number;
  bloodVolume?: number;
  weapon?: string;
  lastUpdated: number;
  lastInputTimestamp?: number;
  isDashing?: boolean;
  lastDashTime?: number;
}

export interface AuthoritativeRoomConfig {
  width: number;
  height: number;
  friction: number;
  acceleration: number;
  maxSpeed: number;
  dashSpeed: number;
  dashCooldownMs: number;
  defaultRadius: number;
}

export const DEFAULT_AUTHORITATIVE_CONFIG: AuthoritativeRoomConfig = {
  width: 3200,
  height: 3200,
  friction: 0.88,
  acceleration: 1.4,
  maxSpeed: 8.0,
  dashSpeed: 24.0,
  dashCooldownMs: 800,
  defaultRadius: 28,
};

/**
 * Server-authoritative room simulation.
 * Maintains canonical player state and executes all physics and action validation.
 */
export class AuthoritativeRoomSimulation {
  private roomId: string;
  private config: AuthoritativeRoomConfig;
  private players: Map<string, AuthoritativePlayer> = new Map();

  constructor(roomId: string, config: AuthoritativeRoomConfig = DEFAULT_AUTHORITATIVE_CONFIG) {
    this.roomId = roomId;
    this.config = config;
  }

  public getPlayer(userId: string): AuthoritativePlayer | undefined {
    return this.players.get(userId);
  }

  public getOrCreatePlayer(
    userId: string,
    initial?: Partial<AuthoritativePlayer>
  ): AuthoritativePlayer {
    let player = this.players.get(userId);
    if (!player) {
      player = {
        id: userId,
        name: initial?.name || `Player ${userId.slice(0, 4)}`,
        x: initial?.x ?? 1600 + (Math.random() - 0.5) * 200,
        y: initial?.y ?? 1600 + (Math.random() - 0.5) * 200,
        vx: 0,
        vy: 0,
        angle: initial?.angle ?? 0,
        radius: initial?.radius ?? this.config.defaultRadius,
        color: initial?.color ?? 0xef4444,
        bloodVolume: initial?.bloodVolume ?? 5000,
        weapon: initial?.weapon ?? "sword",
        lastUpdated: Date.now(),
      };
      this.players.set(userId, player);
    }
    return player;
  }

  public removePlayer(userId: string): void {
    this.players.delete(userId);
  }

  /**
   * Process a player's movement input intent on the server.
   * If the input is not newer than the last processed input for this player, it is skipped.
   * Calculates new velocity, applies friction, clamps to world bounds,
   * updates the player's position, and returns the canonical player state (or null if skipped).
   */
  public processPlayerInput(
    userId: string,
    input: {
      x: number;
      y: number;
      angle?: number;
      name?: string;
      color?: number;
      weapon?: string;
      timestamp?: number;
      dash?: boolean;
    }
  ): AuthoritativePlayer | null {
    const player = this.getOrCreatePlayer(userId, {
      name: input.name,
      color: input.color,
      weapon: input.weapon,
    });

    const inputTimestamp = input.timestamp ?? Date.now();

    // Skip input if it is not the latest input received from this user
    if (player.lastInputTimestamp !== undefined && inputTimestamp < player.lastInputTimestamp) {
      return null;
    }
    player.lastInputTimestamp = inputTimestamp;

    let ix = input.x || 0;
    let iy = input.y || 0;
    const len = Math.hypot(ix, iy);

    // Handle Dash trigger (Shift key)
    const now = Date.now();
    let triggeredDash = false;
    if (input.dash && (!player.lastDashTime || now - player.lastDashTime >= this.config.dashCooldownMs)) {
      player.lastDashTime = now;
      player.isDashing = true;
      triggeredDash = true;

      // Determine dash direction: either current movement vector or facing angle
      let dashDirX = ix;
      let dashDirY = iy;
      if (len > 0.001) {
        dashDirX /= len;
        dashDirY /= len;
      } else {
        const facingAngle = input.angle !== undefined ? input.angle : player.angle;
        dashDirX = Math.cos(facingAngle);
        dashDirY = Math.sin(facingAngle);
      }

      // Instantaneous dash impulse
      player.vx = dashDirX * this.config.dashSpeed;
      player.vy = dashDirY * this.config.dashSpeed;
      player.angle = Math.atan2(dashDirY, dashDirX);
    } else {
      player.isDashing = player.lastDashTime !== undefined && now - player.lastDashTime < 180;
    }

    if (len > 0.001 && !triggeredDash) {
      ix /= len;
      iy /= len;
      player.vx += ix * this.config.acceleration;
      player.vy += iy * this.config.acceleration;

      // Update facing angle towards direction of movement or input angle
      if (input.angle !== undefined) {
        player.angle = input.angle;
      } else {
        player.angle = Math.atan2(iy, ix);
      }

      // Cap velocity while moving (allow higher speed during active dash window)
      const maxSpeed = player.isDashing ? this.config.dashSpeed : this.config.maxSpeed;
      const speed = Math.hypot(player.vx, player.vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        player.vx *= scale;
        player.vy *= scale;
      }

      // Apply standard motion friction
      player.vx *= this.config.friction;
      player.vy *= this.config.friction;
    } else if (!triggeredDash && !player.isDashing) {
      // When controls are released (zero input vector), stop immediately with zero lingering momentum
      player.vx = 0;
      player.vy = 0;
      if (input.angle !== undefined) {
        player.angle = input.angle;
      }
    } else if (player.isDashing) {
      // Slightly higher friction deceleration during dash fade
      player.vx *= 0.88;
      player.vy *= 0.88;
    }

    if (Math.abs(player.vx) < 0.01) player.vx = 0;
    if (Math.abs(player.vy) < 0.01) player.vy = 0;

    // Integrate authoritative position
    player.x += player.vx;
    player.y += player.vy;

    // Clamp within world bounds
    const minX = player.radius;
    const maxX = this.config.width - player.radius;
    const minY = player.radius;
    const maxY = this.config.height - player.radius;

    if (player.x < minX) {
      player.x = minX;
      player.vx = 0;
    } else if (player.x > maxX) {
      player.x = maxX;
      player.vx = 0;
    }

    if (player.y < minY) {
      player.y = minY;
      player.vy = 0;
    } else if (player.y > maxY) {
      player.y = maxY;
      player.vy = 0;
    }

    if (input.weapon) {
      player.weapon = input.weapon;
    }
    player.lastUpdated = Date.now();

    return player;
  }

  public getAllPlayers(): AuthoritativePlayer[] {
    return Array.from(this.players.values());
  }
}

// Global server registry for active room simulations
const roomSimulations = new Map<string, AuthoritativeRoomSimulation>();

export function getAuthoritativeRoomSimulation(
  roomId: string,
  config?: AuthoritativeRoomConfig
): AuthoritativeRoomSimulation {
  let sim = roomSimulations.get(roomId);
  if (!sim) {
    sim = new AuthoritativeRoomSimulation(roomId, config);
    roomSimulations.set(roomId, sim);
  }
  return sim;
}

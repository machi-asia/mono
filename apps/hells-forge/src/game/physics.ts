import { PlayerState, WorldConfig, InputVector } from './types';
import { calculateMovementSpeedMultiplier } from './health';

/**
 * Applies player movement based on active input vector, acceleration, friction, and maxSpeed.
 * Incorporates leg/foot injury penalties and hypovolemic blood loss speed multipliers.
 */
export function applyMovement(
  player: PlayerState,
  input: InputVector,
  config: WorldConfig
): void {
  // Movement speed modifier based on leg/foot integrity and blood volume
  const speedMultiplier = player.health ? calculateMovementSpeedMultiplier(player.health) : 1.0;

  // Normalize non-zero input vector so diagonal movement isn't faster
  let ix = input.x;
  let iy = input.y;
  const len = Math.hypot(ix, iy);

  if (len > 0.001) {
    ix /= len;
    iy /= len;
    player.vx += ix * (config.acceleration * speedMultiplier);
    player.vy += iy * (config.acceleration * speedMultiplier);

    // Update facing angle
    player.angle = Math.atan2(iy, ix);
  }

  // Cap speed
  const maxSpeed = config.maxSpeed * speedMultiplier;
  const currentSpeed = Math.hypot(player.vx, player.vy);
  if (currentSpeed > maxSpeed) {
    const scale = maxSpeed / currentSpeed;
    player.vx *= scale;
    player.vy *= scale;
  }

  // Apply friction
  player.vx *= config.friction;
  player.vy *= config.friction;

  // Zero out tiny velocities
  if (Math.abs(player.vx) < 0.01) player.vx = 0;
  if (Math.abs(player.vy) < 0.01) player.vy = 0;

  // Integrate position
  player.x += player.vx;
  player.y += player.vy;
}

/**
 * Checks if target player is within blade slash range (e.g. 75px) and forward arc (approx 90 deg cone).
 */
export function checkSlashHit(
  attacker: PlayerState,
  target: PlayerState,
  slashRange = 75,
  slashArc = Math.PI * 0.55 // ~100 degree cone
): boolean {
  if (attacker.id === target.id) return false;

  const dx = target.x - attacker.x;
  const dy = target.y - attacker.y;
  const dist = Math.hypot(dx, dy);

  // Check distance taking target radius into account
  if (dist > slashRange + target.radius) {
    return false;
  }

  // Check angle relative to attacker facing angle
  const angleToTarget = Math.atan2(dy, dx);
  let diff = Math.abs(angleToTarget - attacker.angle);
  while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);

  return diff <= slashArc / 2;
}

/**
 * Clamps player within world bounds taking their collision radius into account.
 */
export function clampToWorldBounds(player: PlayerState, config: WorldConfig): void {
  const minX = player.radius;
  const maxX = config.width - player.radius;
  const minY = player.radius;
  const maxY = config.height - player.radius;

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
}

/**
 * Resolves circle-to-circle collisions between all players.
 * Elastic separation ensures players slide around each other smoothly with zero clipping.
 */
export function resolvePlayerCollisions(players: PlayerState[]): void {
  const count = players.length;

  for (let i = 0; i < count; i++) {
    const p1 = players[i];

    for (let j = i + 1; j < count; j++) {
      const p2 = players[j];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy);
      const minDist = p1.radius + p2.radius;

      if (dist < minDist && dist > 0.0001) {
        // Overlap detected
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;

        // Determine mobility: if a player is remote (isLocal === false),
        // we do not mutate their position to prevent fighting remote client authoritative telemetry.
        const p1CanMove = p1.isLocal !== false;
        const p2CanMove = p2.isLocal !== false;

        if (p1CanMove && p2CanMove) {
          // Both can move: separate equally
          const sepX = nx * (overlap / 2);
          const sepY = ny * (overlap / 2);
          p1.x -= sepX;
          p1.y -= sepY;
          p2.x += sepX;
          p2.y += sepY;
        } else if (p1CanMove && !p2CanMove) {
          // p2 is remote/authoritative; push p1 away entirely
          p1.x -= nx * overlap;
          p1.y -= ny * overlap;
        } else if (!p1CanMove && p2CanMove) {
          // p1 is remote/authoritative; push p2 away entirely
          p2.x += nx * overlap;
          p2.y += ny * overlap;
        }

        // Impulse transfer along collision normal
        const relativeVx = p1.vx - p2.vx;
        const relativeVy = p1.vy - p2.vy;
        const velocityAlongNormal = relativeVx * nx + relativeVy * ny;

        if (velocityAlongNormal > 0) {
          const restitution = 0.5;
          const impulseMagnitude = (1 + restitution) * velocityAlongNormal * 0.5;

          if (p1CanMove) {
            p1.vx -= impulseMagnitude * nx;
            p1.vy -= impulseMagnitude * ny;
          }
          if (p2CanMove) {
            p2.vx += impulseMagnitude * nx;
            p2.vy += impulseMagnitude * ny;
          }
        }
      } else if (dist <= 0.0001) {
        // Exact overlap edge case: nudge slightly
        if (p1.isLocal !== false) p1.x -= 1;
        if (p2.isLocal !== false) p2.x += 1;
      }
    }
  }
}

import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { PlayerState, WorldConfig } from './types';

interface SlashEffect {
  x: number;
  y: number;
  angle: number;
  graphics: Graphics;
  createdAt: number;
  duration: number;
  weapon: 'sword' | 'mace';
}

interface BloodParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  graphics: Graphics;
}

interface DashGhost {
  x: number;
  y: number;
  radius: number;
  color: number;
  alpha: number;
  graphics: Graphics;
}

export class GameEngineRenderer {
  private app: Application;
  private worldContainer: Container;
  private gridGraphics: Graphics;
  private boundaryGraphics: Graphics;
  private bloodSplatterContainer: Container;
  private effectsContainer: Container;
  private playersContainer: Container;
  private playerGraphicsMap: Map<
    string,
    {
      container: Container;
      body: Graphics;
      label: Text;
      aura: Graphics;
      bloodBarBg: Graphics;
      bloodBarFill: Graphics;
    }
  > = new Map();

  private activeSlashes: SlashEffect[] = [];
  private activeBloodParticles: BloodParticle[] = [];
  private activeDashGhosts: DashGhost[] = [];
  private initialized = false;

  constructor() {
    this.app = new Application();
    this.worldContainer = new Container();
    this.gridGraphics = new Graphics();
    this.boundaryGraphics = new Graphics();
    this.bloodSplatterContainer = new Container();
    this.effectsContainer = new Container();
    this.playersContainer = new Container();
  }

  public async init(canvas: HTMLCanvasElement): Promise<void> {
    if (this.initialized) return;

    await this.app.init({
      canvas,
      resizeTo: window,
      backgroundColor: 0x0a0a0c,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.worldContainer.addChild(this.gridGraphics);
    this.worldContainer.addChild(this.boundaryGraphics);
    this.worldContainer.addChild(this.bloodSplatterContainer);
    this.worldContainer.addChild(this.playersContainer);
    this.worldContainer.addChild(this.effectsContainer);
    this.app.stage.addChild(this.worldContainer);

    this.initialized = true;
  }

  public drawWorldGrid(config: WorldConfig): void {
    if (!this.initialized) return;

    this.gridGraphics.clear();
    const cellSize = 100;

    // Draw subtle grid lines
    this.gridGraphics.setStrokeStyle({ width: 1, color: 0x181822, alpha: 0.8 });
    for (let x = 0; x <= config.width; x += cellSize) {
      this.gridGraphics.moveTo(x, 0);
      this.gridGraphics.lineTo(x, config.height);
    }
    for (let y = 0; y <= config.height; y += cellSize) {
      this.gridGraphics.moveTo(0, y);
      this.gridGraphics.lineTo(config.width, y);
    }
    this.gridGraphics.stroke();

    // Draw world boundaries with fiery glow
    this.boundaryGraphics.clear();
    this.boundaryGraphics.setStrokeStyle({ width: 6, color: 0xff3b1f, alpha: 0.9 });
    this.boundaryGraphics.rect(0, 0, config.width, config.height);
    this.boundaryGraphics.stroke();

    // Corner hazard markers
    this.boundaryGraphics.setStrokeStyle({ width: 2, color: 0xff9900, alpha: 0.5 });
    const cornerSize = 120;
    this.boundaryGraphics.rect(0, 0, cornerSize, cornerSize);
    this.boundaryGraphics.rect(config.width - cornerSize, 0, cornerSize, cornerSize);
    this.boundaryGraphics.rect(0, config.height - cornerSize, cornerSize, cornerSize);
    this.boundaryGraphics.rect(config.width - cornerSize, config.height - cornerSize, cornerSize, cornerSize);
    this.boundaryGraphics.stroke();
  }

  /**
   * Spawns weapon attack visuals: curved blade crescent for sword, golden shockwave arc for mace.
   */
  public triggerSlashEffect(x: number, y: number, angle: number, weapon: 'sword' | 'mace' = 'sword'): void {
    if (!this.initialized) return;

    const g = new Graphics();
    this.effectsContainer.addChild(g);

    this.activeSlashes.push({
      x,
      y,
      angle,
      graphics: g,
      createdAt: performance.now(),
      duration: weapon === 'mace' ? 220 : 180,
      weapon,
    });
  }

  /**
   * Spawns bleeding droplets and stains at target hit position.
   */
  public spawnBloodSplatter(x: number, y: number, count = 12): void {
    if (!this.initialized) return;

    // Permanent subtle puddle on floor
    const puddle = new Graphics();
    const puddleRadius = 6 + Math.random() * 8;
    puddle.circle(x, y, puddleRadius);
    puddle.fill({ color: 0x880808, alpha: 0.75 });
    this.bloodSplatterContainer.addChild(puddle);

    // Limit floor decals to prevent memory leak
    if (this.bloodSplatterContainer.children.length > 250) {
      const oldest = this.bloodSplatterContainer.children[0];
      this.bloodSplatterContainer.removeChild(oldest);
      oldest.destroy();
    }

    // Dynamic blood splatter droplets
    for (let i = 0; i < count; i++) {
      const g = new Graphics();
      const spreadAngle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      const radius = 2 + Math.random() * 3.5;

      g.circle(0, 0, radius);
      g.fill({ color: 0xb91c1c });
      g.x = x;
      g.y = y;
      this.effectsContainer.addChild(g);

      this.activeBloodParticles.push({
        x,
        y,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed,
        radius,
        alpha: 1.0,
        graphics: g,
      });
    }
  }

  public updateEffects(): void {
    if (!this.initialized) return;
    const now = performance.now();

    // 1. Update weapon attack arcs
    for (let i = this.activeSlashes.length - 1; i >= 0; i--) {
      const slash = this.activeSlashes[i];
      const elapsed = now - slash.createdAt;
      const progress = elapsed / slash.duration;

      if (progress >= 1.0) {
        this.effectsContainer.removeChild(slash.graphics);
        slash.graphics.destroy();
        this.activeSlashes.splice(i, 1);
      } else {
        slash.graphics.clear();
        const alpha = 1.0 - progress;

        if (slash.weapon === 'mace') {
          // Mace: Heavy blunt crushing shockwave
          const currentRadius = 30 + progress * 35;
          slash.graphics.setStrokeStyle({
            width: 7 * (1.0 - progress * 0.4),
            color: 0xf59e0b,
            alpha,
          });
          slash.graphics.arc(slash.x, slash.y, currentRadius, slash.angle - 0.75, slash.angle + 0.75);
          slash.graphics.stroke();

          // Outer shockwave ring
          slash.graphics.setStrokeStyle({
            width: 3,
            color: 0xffedd5,
            alpha: alpha * 0.9,
          });
          slash.graphics.arc(slash.x, slash.y, currentRadius + 8, slash.angle - 0.6, slash.angle + 0.6);
          slash.graphics.stroke();
        } else {
          // Sword: Razor-sharp silver blade crescent with fire trail
          const currentRadius = 38 + progress * 24;
          const startAngle = slash.angle - 0.9 + progress * 0.4;
          const endAngle = slash.angle + 0.9;

          slash.graphics.setStrokeStyle({
            width: 5 * (1.0 - progress * 0.5),
            color: 0xffffff,
            alpha,
          });
          slash.graphics.arc(slash.x, slash.y, currentRadius, startAngle, endAngle);
          slash.graphics.stroke();

          slash.graphics.setStrokeStyle({
            width: 3,
            color: 0xff4433,
            alpha: alpha * 0.8,
          });
          slash.graphics.arc(slash.x, slash.y, currentRadius - 4, startAngle + 0.1, endAngle - 0.1);
          slash.graphics.stroke();
        }
      }
    }

    // 2. Update blood droplets
    for (let i = this.activeBloodParticles.length - 1; i >= 0; i--) {
      const p = this.activeBloodParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.85;
      p.vy *= 0.85;
      p.alpha -= 0.04;

      if (p.alpha <= 0) {
        this.effectsContainer.removeChild(p.graphics);
        p.graphics.destroy();
        this.activeBloodParticles.splice(i, 1);
      } else {
        p.graphics.x = p.x;
        p.graphics.y = p.y;
        p.graphics.alpha = p.alpha;
      }
    }

    // 3. Update dash ghost trail
    for (let i = this.activeDashGhosts.length - 1; i >= 0; i--) {
      const ghost = this.activeDashGhosts[i];
      ghost.alpha -= 0.08;
      if (ghost.alpha <= 0) {
        this.effectsContainer.removeChild(ghost.graphics);
        ghost.graphics.destroy();
        this.activeDashGhosts.splice(i, 1);
      } else {
        ghost.graphics.alpha = ghost.alpha;
      }
    }
  }

  /**
   * Spawns a faded after-image ghost during player dashes.
   */
  public spawnDashGhost(x: number, y: number, radius: number, color: number): void {
    if (!this.initialized) return;
    const g = new Graphics();
    g.circle(x, y, radius);
    g.fill({ color, alpha: 0.6 });
    g.setStrokeStyle({ width: 2, color: 0xffffff, alpha: 0.8 });
    g.stroke();
    this.effectsContainer.addChild(g);
    this.activeDashGhosts.push({
      x,
      y,
      radius,
      color,
      alpha: 0.6,
      graphics: g,
    });
  }

  public updatePlayers(players: PlayerState[], localPlayerId: string): void {
    if (!this.initialized) return;

    const currentIds = new Set<string>();

    for (const player of players) {
      currentIds.add(player.id);
      let entry = this.playerGraphicsMap.get(player.id);

      if (!entry) {
        const container = new Container();
        const aura = new Graphics();
        const body = new Graphics();
        const bloodBarBg = new Graphics();
        const bloodBarFill = new Graphics();

        const style = new TextStyle({
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 'bold',
          fill: 0xffffff,
          dropShadow: {
            color: 0x000000,
            blur: 4,
            distance: 1,
          },
        });
        const label = new Text({ text: player.name, style });
        label.anchor.set(0.5, 2.3);

        container.addChild(aura);
        container.addChild(body);
        container.addChild(bloodBarBg);
        container.addChild(bloodBarFill);
        container.addChild(label);
        this.playersContainer.addChild(container);

        entry = { container, body, label, aura, bloodBarBg, bloodBarFill };
        this.playerGraphicsMap.set(player.id, entry);
      }

      // Update position
      entry.container.x = player.x;
      entry.container.y = player.y;

      // Redraw body
      entry.body.clear();
      entry.aura.clear();

      const isLocal = player.id === localPlayerId;
      const color = player.color || (isLocal ? 0xff4433 : 0x3b82f6);

      // Glowing aura
      entry.aura.circle(0, 0, player.radius + (isLocal ? 10 : 6));
      entry.aura.fill({ color, alpha: isLocal ? 0.35 : 0.2 });

      // Core avatar circle
      entry.body.circle(0, 0, player.radius);
      entry.body.fill({ color });
      entry.body.setStrokeStyle({ width: 3, color: isLocal ? 0xffffff : 0x93c5fd, alpha: 0.9 });
      entry.body.stroke();

      // Heading direction indicator
      const hx = Math.cos(player.angle) * (player.radius + 8);
      const hy = Math.sin(player.angle) * (player.radius + 8);
      entry.body.moveTo(0, 0);
      entry.body.lineTo(hx, hy);
      entry.body.setStrokeStyle({ width: 3, color: 0xffffff, alpha: 0.95 });
      entry.body.stroke();

      // Mini blood volume bar under nametag
      entry.bloodBarBg.clear();
      entry.bloodBarFill.clear();

      const bloodPercent = player.health ? Math.max(0, player.health.bloodVolume / 5000) : 1.0;
      const barW = 36;
      const barH = 4;
      const barX = -barW / 2;
      const barY = -player.radius - 14;

      entry.bloodBarBg.rect(barX, barY, barW, barH);
      entry.bloodBarBg.fill({ color: 0x1f1f23, alpha: 0.85 });
      entry.bloodBarBg.setStrokeStyle({ width: 1, color: 0x3f3f46 });
      entry.bloodBarBg.stroke();

      const fillW = Math.max(0, barW * bloodPercent);
      const barColor = bloodPercent > 0.6 ? 0xb91c1c : bloodPercent > 0.3 ? 0xea580c : 0x7f1d1d;
      entry.bloodBarFill.rect(barX, barY, fillW, barH);
      entry.bloodBarFill.fill({ color: barColor });
    }

    // Cleanup departed players
    for (const [id, entry] of this.playerGraphicsMap.entries()) {
      if (!currentIds.has(id)) {
        this.playersContainer.removeChild(entry.container);
        entry.container.destroy({ children: true });
        this.playerGraphicsMap.delete(id);
      }
    }
  }

  public centerCameraOn(player: PlayerState): void {
    if (!this.initialized) return;

    const screenW = this.app.renderer.width / (window.devicePixelRatio || 1);
    const screenH = this.app.renderer.height / (window.devicePixelRatio || 1);

    // Snap camera directly to player position — no lerp.
    // Local player position is already server-authoritative (discrete ticks),
    // so a lerp on top only adds visible lag and stutter.
    this.worldContainer.x = screenW / 2 - player.x;
    this.worldContainer.y = screenH / 2 - player.y;
  }

  public destroy(): void {
    if (!this.initialized) return;
    this.app.destroy(true, { children: true });
    this.playerGraphicsMap.clear();
    this.activeSlashes = [];
    this.activeBloodParticles = [];
    this.initialized = false;
  }
}

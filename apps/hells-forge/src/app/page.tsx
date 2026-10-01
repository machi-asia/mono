"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSyncRoom, useSyncInput, type SyncEventPayload } from "@mono/sync";
import { GameEngineRenderer } from "../game/pixi-renderer";
import {
  PlayerState,
  DEFAULT_WORLD_CONFIG,
  InputVector,
  PlayerMoveEventPayload,
  PlayerSlashPayload,
  PlayerDamagePayload,
  PlayerHealthSystem,
  BodyPartId,
  WeaponType,
} from "../game/types";
import {
  applyMovement,
  clampToWorldBounds,
  resolvePlayerCollisions,
  checkSlashHit,
} from "../game/physics";
import {
  createDefaultHealthSystem,
  getRandomBodyPart,
  applyDamageToPart,
  tickBleeding,
  calculateAttackCooldownMs,
  selectOptimalWeaponForTarget,
} from "../game/health";
import { BodyDoll } from "./body-doll";
import { Users, Compass, Shield, Zap, Radio, Droplet, Swords, HeartPulse, Hammer, Bot } from "lucide-react";

export default function ForgeWorldPage() {
  const [roomId, setRoomId] = useState("infernal-realm-1");
  const [currentWeapon, setCurrentWeapon] = useState<WeaponType>("sword");
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const autoModeRef = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameEngineRenderer | null>(null);

  // Sync ref with state
  useEffect(() => {
    autoModeRef.current = autoMode;
  }, [autoMode]);

  // Track previous moving input state to detect instantaneous release
  const wasMovingInputRef = useRef<boolean>(false);

  // Dash cooldown ref (800ms) and Shift edge-detection ref
  const lastDashTimeRef = useRef<number>(0);
  const prevShiftRef = useRef<boolean>(false);
  const [dashCooldownRatio, setDashCooldownRatio] = useState<number>(1.0);

  // Local active key state for continuous WASD physics and Shift dash
  const keysDownRef = useRef<{ w: boolean; a: boolean; s: boolean; d: boolean; shift: boolean }>({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
  });

  // Unique local player state including complete anatomical health system
  const localPlayerRef = useRef<PlayerState>({
    id: `p-${Math.random().toString(36).slice(2, 8)}`,
    name: "Gladiator",
    x: 1600 + (Math.random() - 0.5) * 200,
    y: 1600 + (Math.random() - 0.5) * 200,
    vx: 0,
    vy: 0,
    angle: 0,
    radius: DEFAULT_WORLD_CONFIG.defaultRadius,
    color: 0xff4433,
    isLocal: true,
    health: createDefaultHealthSystem(),
    weapon: "sword",
  });

  // React state mirror of local health system for reactive UI display
  const [localHealth, setLocalHealth] = useState<PlayerHealthSystem>(() =>
    createDefaultHealthSystem()
  );

  // Remote players map
  const remotePlayersRef = useRef<Map<string, PlayerState>>(new Map());

  // HUD state updated at throttled intervals
  const [hudState, setHudState] = useState({
    x: 1600,
    y: 1600,
    speed: 0,
    onlineCount: 1,
  });

  // Slash cooldown ref to prevent macro spam
  const lastSlashTimeRef = useRef<number>(0);

  // Handle realtime events directly via onEventReceived callback for zero-delay processing
  const handleRemoteEvent = useCallback((event: SyncEventPayload) => {
    // 1. Authoritative Server Player State Reflection (Zero-Discrepancy)
    if ((event.actionId === "server_player_state" || event.actionId === "player_move") && event.payload) {
      const payload = event.payload as unknown as PlayerMoveEventPayload;
      const eventTimestamp = payload.timestamp ?? event.timestamp ?? 0;

      // If the authoritative state belongs to local player, reflect coordinates strictly from server
      if (payload.id === localPlayerRef.current.id) {
        const local = localPlayerRef.current;
        local.x = payload.x;
        local.y = payload.y;
        local.vx = payload.vx;
        local.vy = payload.vy;
        if (payload.angle !== undefined) {
          local.angle = payload.angle;
        }
        if (payload.isDashing && rendererRef.current) {
          rendererRef.current.spawnDashGhost(local.x, local.y, local.radius, local.color);
        }
        return;
      }

      // If remote player
      if (payload.id && payload.id !== localPlayerRef.current.id) {
        const existing = remotePlayersRef.current.get(payload.id);

        if (existing) {
          // Drop out-of-order or stale packets to avoid rubber-banding backwards
          if (existing.lastTimestamp && eventTimestamp < existing.lastTimestamp) {
            return;
          }
          existing.lastTimestamp = eventTimestamp;
          existing.targetX = payload.x;
          existing.targetY = payload.y;
          existing.targetAngle = payload.angle;
          existing.vx = payload.vx;
          existing.vy = payload.vy;
          existing.name = payload.name;
          if (payload.weapon) {
            existing.weapon = payload.weapon;
          }
          if (payload.bloodVolume !== undefined && existing.health) {
            existing.health.bloodVolume = payload.bloodVolume;
          }
          if (payload.isDashing && rendererRef.current) {
            rendererRef.current.spawnDashGhost(existing.x, existing.y, existing.radius, existing.color);
          }
        } else {
          remotePlayersRef.current.set(payload.id, {
            id: payload.id,
            name: payload.name || `Player ${payload.id.slice(0, 4)}`,
            x: payload.x,
            y: payload.y,
            targetX: payload.x,
            targetY: payload.y,
            targetAngle: payload.angle,
            vx: payload.vx,
            vy: payload.vy,
            angle: payload.angle,
            radius: DEFAULT_WORLD_CONFIG.defaultRadius,
            color: payload.color || 0x3b82f6,
            isLocal: false,
            health: createDefaultHealthSystem(),
            weapon: payload.weapon || "sword",
            lastTimestamp: eventTimestamp,
          });
        }
      }
    }

    // 2. Remote Slash Blade Effect
    if (event.actionId === "player_slash" && event.payload) {
      const payload = event.payload as unknown as PlayerSlashPayload;
      if (payload.attackerId !== localPlayerRef.current.id && rendererRef.current) {
        rendererRef.current.triggerSlashEffect(
          payload.attackerX,
          payload.attackerY,
          payload.angle,
          payload.weapon || "sword"
        );
      }
    }

    // 3. Player Damage Received
    if (event.actionId === "player_damaged" && event.payload) {
      const payload = event.payload as unknown as PlayerDamagePayload;

      // If local player was damaged
      if (payload.targetId === localPlayerRef.current.id) {
        applyDamageToPart(
          localPlayerRef.current.health,
          payload.partId,
          payload.category,
          payload.depth,
          payload.weapon || "sword"
        );
        setLocalHealth({ ...localPlayerRef.current.health });

        if (rendererRef.current) {
          if (payload.deflected) {
            rendererRef.current.spawnBloodSplatter(
              localPlayerRef.current.x,
              localPlayerRef.current.y,
              2
            );
          } else {
            const bloodCount = payload.isFatalLoss
              ? 45
              : payload.partSevered
              ? 30
              : payload.category === "slash"
              ? 18
              : 6;
            rendererRef.current.spawnBloodSplatter(
              localPlayerRef.current.x,
              localPlayerRef.current.y,
              bloodCount
            );
          }
        }
      } else {
        // Remote player was damaged
        const target = remotePlayersRef.current.get(payload.targetId);
        if (target && target.health) {
          applyDamageToPart(
            target.health,
            payload.partId,
            payload.category,
            payload.depth,
            payload.weapon || "sword"
          );
          if (rendererRef.current) {
            if (payload.deflected) {
              rendererRef.current.spawnBloodSplatter(target.x, target.y, 2);
            } else {
              const bloodCount = payload.isFatalLoss
                ? 45
                : payload.partSevered
                ? 30
                : payload.category === "slash"
                ? 16
                : 6;
              rendererRef.current.spawnBloodSplatter(target.x, target.y, bloodCount);
            }
          }
        }
      }
    }
  }, []);

  // Realtime room sync hook with direct event listener and WebRTC UDP transport
  const { connected, protocol, members, recentEvents, userId, broadcastEvent } = useSyncRoom({
    roomId,
    userName: localPlayerRef.current.name,
    onEventReceived: handleRemoteEvent,
  });

  // Executes a slash attack in the specified facing angle and resolves damage
  const executeSlash = useCallback(
    (facingAngle: number) => {
      const now = performance.now();
      const local = localPlayerRef.current;
      if (!local.health.isConscious) return;

      const currentCooldown = calculateAttackCooldownMs(local.health);
      if (now - lastSlashTimeRef.current < currentCooldown) {
        return; // Still on attack cooldown
      }
      lastSlashTimeRef.current = now;
      local.angle = facingAngle;

      // Visual slash effect on local screen
      if (rendererRef.current) {
        rendererRef.current.triggerSlashEffect(local.x, local.y, local.angle, local.weapon);
      }

      // Broadcast slash animation
      if (broadcastEvent) {
        const slashPayload: PlayerSlashPayload = {
          attackerId: local.id,
          attackerX: Math.round(local.x),
          attackerY: Math.round(local.y),
          angle: Math.round(local.angle * 100) / 100,
          weapon: local.weapon || "sword",
        };
        broadcastEvent("player_slash", slashPayload);
      }

      // Check hit detection against remote players
      for (const remote of remotePlayersRef.current.values()) {
        const isHit = checkSlashHit(local, remote, 80, Math.PI * 0.55);
        if (isHit) {
          const hitPartId = getRandomBodyPart();
          const damageResult = applyDamageToPart(
            remote.health,
            hitPartId,
            undefined,
            undefined,
            local.weapon || "sword"
          );

          if (rendererRef.current) {
            if (damageResult.deflected) {
              rendererRef.current.spawnBloodSplatter(remote.x, remote.y, 2);
            } else {
              const bloodCount = damageResult.isFatalLoss
                ? 45
                : damageResult.partSevered
                ? 30
                : damageResult.category === "slash"
                ? 18
                : 8;
              rendererRef.current.spawnBloodSplatter(remote.x, remote.y, bloodCount);
            }
          }

          if (broadcastEvent) {
            const damagePayload: PlayerDamagePayload = {
              targetId: remote.id,
              attackerId: local.id,
              partId: damageResult.partId,
              category: damageResult.category,
              weapon: local.weapon || "sword",
              depth: damageResult.depth,
              damage: damageResult.damage,
              bleedRate: damageResult.bleedRate,
              remainingHealth: damageResult.partHealth,
              remainingBlood: Math.round(remote.health.bloodVolume),
              armorDamage: damageResult.armorDamage,
              remainingArmor: damageResult.remainingArmor,
              deflected: damageResult.deflected,
              partSevered: damageResult.partSevered,
              isFatalLoss: damageResult.isFatalLoss,
            };
            broadcastEvent("player_damaged", damagePayload);
          }
          break;
        }
      }
    },
    [broadcastEvent]
  );

  // Point-and-click Left-Mouse Slash execution with dynamic attack speed based on arm/hand integrity
  const performSlash = useCallback(
    (clientX: number, clientY: number) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const screenCenterX = rect.width / 2;
        const screenCenterY = rect.height / 2;
        const clickDx = clientX - rect.left - screenCenterX;
        const clickDy = clientY - rect.top - screenCenterY;
        const angle = Math.atan2(clickDy, clickDx);
        executeSlash(angle);
      }
    },
    [executeSlash]
  );

  // Update local player ID with session userId when available
  useEffect(() => {
    if (userId) {
      localPlayerRef.current.id = userId;
    }
  }, [userId]);

  // Hook WASD and Arrow Keys using @mono/sync dress/input
  useSyncInput({
    w: { inputType: "key", actionId: "move_up", preventDefault: true },
    W: { inputType: "key", actionId: "move_up", preventDefault: true },
    ArrowUp: { inputType: "key", actionId: "move_up", preventDefault: true },
    s: { inputType: "key", actionId: "move_down", preventDefault: true },
    S: { inputType: "key", actionId: "move_down", preventDefault: true },
    ArrowDown: { inputType: "key", actionId: "move_down", preventDefault: true },
    a: { inputType: "key", actionId: "move_left", preventDefault: true },
    A: { inputType: "key", actionId: "move_left", preventDefault: true },
    ArrowLeft: { inputType: "key", actionId: "move_left", preventDefault: true },
    d: { inputType: "key", actionId: "move_right", preventDefault: true },
    D: { inputType: "key", actionId: "move_right", preventDefault: true },
    ArrowRight: { inputType: "key", actionId: "move_right", preventDefault: true },
  });

  // Track raw keys for continuous 60fps physics movement and Spacebar weapon switching
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Spacebar switches between sword and mace
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        setCurrentWeapon((prev) => {
          const nextWeapon: WeaponType = prev === "sword" ? "mace" : "sword";
          localPlayerRef.current.weapon = nextWeapon;
          return nextWeapon;
        });
        return;
      }

      const k = e.key.toLowerCase();
      if (k === "shift" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
        keysDownRef.current.shift = true;
      }
      if (k === "w" || k === "arrowup") keysDownRef.current.w = true;
      if (k === "s" || k === "arrowdown") keysDownRef.current.s = true;
      if (k === "a" || k === "arrowleft") keysDownRef.current.a = true;
      if (k === "d" || k === "arrowright") keysDownRef.current.d = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "shift" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
        keysDownRef.current.shift = false;
      }
      if (k === "w" || k === "arrowup") keysDownRef.current.w = false;
      if (k === "s" || k === "arrowdown") keysDownRef.current.s = false;
      if (k === "a" || k === "arrowleft") keysDownRef.current.a = false;
      if (k === "d" || k === "arrowright") keysDownRef.current.d = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Handle canvas mouse click for point-and-click slash
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      performSlash(e.clientX, e.clientY);
    }
  };

  // Initialize Pixi.js Canvas and Main Game Loop
  useEffect(() => {
    let animId: number;
    let lastBroadcastTime = 0;
    let lastFrameTime = performance.now();
    let healthSyncTimer = 0;

    const renderer = new GameEngineRenderer();
    rendererRef.current = renderer;

    if (canvasRef.current) {
      renderer.init(canvasRef.current).then(() => {
        renderer.drawWorldGrid(DEFAULT_WORLD_CONFIG);

        const loop = (timestamp: number) => {
          const deltaSeconds = Math.min(0.1, (timestamp - lastFrameTime) / 1000);
          lastFrameTime = timestamp;

          const local = localPlayerRef.current;
          const keys = keysDownRef.current;

          // 1. Tick bleeding damage-over-time on local player
          if (local.health.isBleeding) {
            tickBleeding(local.health, deltaSeconds);

            // Spawn occasional blood droplet on floor when moving while bleeding
            if (
              Math.random() < 0.08 &&
              (Math.abs(local.vx) > 0.1 || Math.abs(local.vy) > 0.1)
            ) {
              renderer.spawnBloodSplatter(local.x, local.y, 1);
            }
          }

          // 2. Tick bleeding for remote players
          for (const remote of remotePlayersRef.current.values()) {
            if (remote.health && remote.health.isBleeding) {
              tickBleeding(remote.health, deltaSeconds);
            }
          }

          // 3. Calculate input vector (either manual keys or AI auto-pilot towards closest enemy)
          let input: InputVector = { x: 0, y: 0 };

          if (local.health.isConscious) {
            if (autoModeRef.current) {
              // --- AI Auto Mode Active ---
              // Find closest living enemy
              let closestTarget: PlayerState | null = null;
              let closestDist = Infinity;

              for (const remote of remotePlayersRef.current.values()) {
                if (remote.id !== local.id && (remote.health?.bloodVolume ?? 1) > 0) {
                  const d = Math.hypot(remote.x - local.x, remote.y - local.y);
                  if (d < closestDist) {
                    closestDist = d;
                    closestTarget = remote;
                  }
                }
              }

              if (closestTarget) {
                const dx = closestTarget.x - local.x;
                const dy = closestTarget.y - local.y;
                const dist = Math.hypot(dx, dy);

                // Auto-switch weapon based on target's armor status
                if (closestTarget.health) {
                  const optimalWeapon = selectOptimalWeaponForTarget(closestTarget.health);
                  if (local.weapon !== optimalWeapon) {
                    local.weapon = optimalWeapon;
                    setCurrentWeapon(optimalWeapon);
                  }
                }

                // Face the target
                if (dist > 0.001) {
                  local.angle = Math.atan2(dy, dx);
                }

                // Move closer if not in melee striking distance (~60px)
                if (dist > 60) {
                  input = {
                    x: dx / dist,
                    y: dy / dist,
                  };
                } else {
                  // Keep slight momentum or stop within melee range
                  input = { x: 0, y: 0 };
                }

                // Auto-slash if within striking range (~75px)
                if (dist <= 85) {
                  executeSlash(local.angle);
                }
              }
            } else {
              // --- Manual Player Controls ---
              input = {
                x: (keys.d ? 1 : 0) - (keys.a ? 1 : 0),
                y: (keys.s ? 1 : 0) - (keys.w ? 1 : 0),
              };
            }
          }

          // 4. Server-Authoritative Input Stream:
          // Local player coordinates are NOT mutated speculatively on client.
          // Inputs (W/A/S/D or AI direction) are transmitted to the server, which validates and authoritatively returns positions.
          const isMovingInput = Math.abs(input.x) > 0.001 || Math.abs(input.y) > 0.001;
          const justReleasedControls = !isMovingInput && wasMovingInputRef.current;
          wasMovingInputRef.current = isMovingInput;

          // Detect Shift leading edge (new press this frame) to trigger dash immediately
          const shiftNow = keys.shift;
          const shiftWasPrev = prevShiftRef.current;
          prevShiftRef.current = shiftNow;
          const now = Date.now();
          const shiftJustPressed = shiftNow && !shiftWasPrev;
          const canDash = shiftJustPressed && (now - lastDashTimeRef.current >= 800);
          if (canDash) lastDashTimeRef.current = now;

          // Dispatch at 50Hz (20ms) when moving, immediately (0ms) upon control release or dash, or 4Hz heartbeat when idle
          const minInterval = justReleasedControls || canDash ? 0 : isMovingInput ? 20 : 250;

          if ((timestamp - lastBroadcastTime > minInterval || justReleasedControls || canDash) && broadcastEvent) {
            lastBroadcastTime = timestamp;
            if (justReleasedControls) {
              // Clear local player residual velocities on client immediately
              local.vx = 0;
              local.vy = 0;
            }
            broadcastEvent("player_input", {
              x: Math.round(input.x * 100) / 100,
              y: Math.round(input.y * 100) / 100,
              angle: Math.round(local.angle * 100) / 100,
              name: local.name,
              color: local.color,
              weapon: local.weapon,
              dash: canDash || undefined,
              timestamp: now,
            });
            // Update dash cooldown ratio for HUD (throttled to ~15% of frames)
            if (Math.random() < 0.15) {
              const elapsed = now - lastDashTimeRef.current;
              setDashCooldownRatio(Math.min(1, elapsed / 800));
            }
          }

          // 5. Authoritative Actual Location Convergence for Remote Players
          for (const remote of remotePlayersRef.current.values()) {
            if (remote.targetX !== undefined && remote.targetY !== undefined) {
              const dx = remote.targetX - remote.x;
              const dy = remote.targetY - remote.y;
              const dist = Math.hypot(dx, dy);

              // If discrepancy is large (> 40px, e.g. spawn, teleport or initial sync), snap immediately
              if (dist > 40) {
                remote.x = remote.targetX;
                remote.y = remote.targetY;
              } else {
                // Ultra-responsive ground-truth glide: converges within 1-2 frames without visual overshoot
                const lerpAlpha = 1 - Math.exp(-45 * deltaSeconds);
                remote.x += dx * lerpAlpha;
                remote.y += dy * lerpAlpha;
              }

              if (remote.targetAngle !== undefined) {
                let diffAngle = (remote.targetAngle - remote.angle) % (Math.PI * 2);
                if (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                if (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                const angleAlpha = 1 - Math.exp(-35 * deltaSeconds);
                remote.angle += diffAngle * angleAlpha;
              }
            }
            clampToWorldBounds(remote, DEFAULT_WORLD_CONFIG);
          }

          // 6. World bounds clamping
          const allPlayers = [local, ...Array.from(remotePlayersRef.current.values())];
          clampToWorldBounds(local, DEFAULT_WORLD_CONFIG);

          // 7. Update Pixi rendering stage, visual effects, and camera
          renderer.updateEffects();
          renderer.updatePlayers(allPlayers, local.id);
          renderer.centerCameraOn(local);

          // 8. Synchronize React state for UI (blood gauge and body doll)
          healthSyncTimer += deltaSeconds;
          if (healthSyncTimer >= 0.1) {
            healthSyncTimer = 0;
            setLocalHealth({ ...local.health });
          }

          // 10. Update HUD state throttled
          if (Math.random() < 0.15) {
            setHudState({
              x: Math.round(local.x),
              y: Math.round(local.y),
              speed: Math.round(Math.hypot(local.vx, local.vy) * 10) / 10,
              onlineCount: allPlayers.length,
            });
          }

          animId = requestAnimationFrame(loop);
        };

        animId = requestAnimationFrame(loop);
      });
    }

    return () => {
      cancelAnimationFrame(animId);
      renderer.destroy();
    };
  }, [broadcastEvent, executeSlash]);

  // Minimap coordinates calculation
  const minimapPercentX = (hudState.x / DEFAULT_WORLD_CONFIG.width) * 100;
  const minimapPercentY = (hudState.y / DEFAULT_WORLD_CONFIG.height) * 100;

  // Blood volume stats
  const bloodVolume = Math.round(localHealth.bloodVolume);
  const bloodRatio = Math.max(0, bloodVolume / localHealth.maxBloodVolume);
  const isCriticalBlood = bloodVolume < 2000;

  return (
    <div className={`game-viewport ${isCriticalBlood ? "critical-vignette" : ""}`}>
      {/* Pixi Canvas with Left-Click Slash Attack */}
      <canvas
        ref={canvasRef}
        className="game-canvas"
        onMouseDown={handleCanvasMouseDown}
      />

      {/* Top HUD Header */}
      <header className="game-hud-top">
        <div className="hud-badge">
          <Radio size={14} className={connected ? "status-pulse" : ""} />
          <span>{connected ? `LIVE MULTIPLAYER (${protocol.toUpperCase()})` : "CONNECTING..."}</span>
          <span className="hud-room-code">ROOM: {roomId}</span>
        </div>

        <div className="hud-stats-group">
          <div className="hud-stat-pill">
            <Compass size={14} />
            <span>POS: {hudState.x}, {hudState.y}</span>
          </div>
          <div className="hud-stat-pill">
            <Zap size={14} />
            <span>SPD: {hudState.speed} px/f</span>
          </div>
          <div className="hud-stat-pill">
            <Users size={14} />
            <span>{hudState.onlineCount} EXPLORER(S)</span>
          </div>
        </div>
      </header>

      {/* Tactical Left-Side Medical HUD: Blood Volume Reservoir & Body Doll */}
      <aside className="medical-hud-left">
        {/* Blood Reservoir Gauge */}
        <div className="blood-gauge-card">
          <div className="blood-gauge-header">
            <div className="blood-gauge-title">
              <HeartPulse size={14} className="pulse-heart" />
              <span>BLOOD VOLUME</span>
            </div>
            <span className={`blood-volume-number ${isCriticalBlood ? "critical-text" : ""}`}>
              {bloodVolume} / 5000 mL
            </span>
          </div>

          <div className="blood-reservoir-bar">
            <div
              className={`blood-liquid-fill ${localHealth.isBleeding ? "is-bleeding" : ""}`}
              style={{ width: `${bloodRatio * 100}%` }}
            />
          </div>

          {localHealth.isBleeding && (
            <div className="hemorrhage-banner">
              <Droplet size={13} className="bleed-icon" />
              <span>ACTIVE HEMORRHAGE: -{localHealth.totalBleedRate} mL/s (DOT)</span>
            </div>
          )}

          {!localHealth.isConscious && (
            <div className="unconscious-banner">
              EXSANGUINATION / UNCONSCIOUS
            </div>
          )}
        </div>

        {/* Anatomical Body Doll */}
        <BodyDoll health={localHealth} />
      </aside>

      {/* Spatial Radar (Minimap) in Upper Right */}
      <div className="game-minimap-container">
        <div className="game-minimap-title">
          <Shield size={12} /> SPATIAL RADAR
        </div>
        <div className="game-minimap">
          <div
            className="minimap-player local"
            style={{
              left: `${minimapPercentX}%`,
              top: `${minimapPercentY}%`,
            }}
          />
          {Array.from(remotePlayersRef.current.values()).map((p) => {
            const rx = (p.x / DEFAULT_WORLD_CONFIG.width) * 100;
            const ry = (p.y / DEFAULT_WORLD_CONFIG.height) * 100;
            return (
              <div
                key={p.id}
                className="minimap-player remote"
                style={{
                  left: `${rx}%`,
                  top: `${ry}%`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Controls Overlay Footer with Slash & Weapon Guidance */}
      <div className="game-controls-hint">
        <div className="key-badge">W</div>
        <div className="key-badge">A</div>
        <div className="key-badge">S</div>
        <div className="key-badge">D</div>
        <span className="hint-label">Move</span>
        <div className="controls-separator" />
        <div className="key-badge mouse-badge">
          {currentWeapon === "sword" ? <Swords size={14} /> : <Hammer size={14} />}
        </div>
        <span className="hint-label">
          Left Click: {currentWeapon === "sword" ? "Slash (Deflected by ≥50% Armor)" : "Crush (5x Armor Damage & Bruising)"}
        </span>
        <div className="controls-separator" />
        <div className="key-badge space-badge">SPACE</div>
        <span className="hint-label">Switch:</span>
        <span className={`weapon-active-pill ${currentWeapon}`}>
          {currentWeapon === "sword" ? <Swords size={12} /> : <Hammer size={12} />}
          {currentWeapon}
        </span>
        <div className="controls-separator" />
        <div className="key-badge">SHIFT</div>
        <span className="hint-label">Dash (0.8s cooldown)</span>
        <div className="controls-separator" />
        <button
          type="button"
          className={`auto-mode-btn ${autoMode ? "active" : ""}`}
          onClick={() => setAutoMode((prev) => !prev)}
          title="Toggle AI Auto-Combat: chases enemies, slashes, and switches weapons based on armor"
        >
          <Bot size={14} className="auto-ai-icon" />
          <span>{autoMode ? "AUTO: ON" : "AUTO: OFF"}</span>
        </button>
      </div>
    </div>
  );
}


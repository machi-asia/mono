export type BodyPartId =
  | 'head'
  | 'torso'
  | 'hips'
  | 'lower_arm_l'
  | 'lower_arm_r'
  | 'hand_l'
  | 'hand_r'
  | 'upper_leg_l'
  | 'upper_leg_r'
  | 'foot_l'
  | 'foot_r';

export type DamageCategory = 'bruise' | 'slash';
export type WeaponType = 'sword' | 'mace'; // Sword = Sharp, Mace = Blunt

export interface Wound {
  id: string;
  category: DamageCategory;
  depth: number; // 0.1 to 1.0 (shallow to arterial)
  bleedRate: number; // mL of blood lost per second
  timestamp: number;
}

export interface BodyPartState {
  id: BodyPartId;
  name: string;
  health: number; // 0 to 100
  maxHealth: number;
  wounds: Wound[];
  isSevered?: boolean;
}

export interface ArmorPieceState {
  id: BodyPartId;
  name: string;
  durability: number; // 0 to 100
  maxDurability: number; // 100
  isBroken: boolean;
}

export interface PlayerHealthSystem {
  bloodVolume: number; // 0 to 5000 mL
  maxBloodVolume: number; // 5000 mL
  bodyParts: Record<BodyPartId, BodyPartState>;
  armor: Record<BodyPartId, ArmorPieceState>;
  isBleeding: boolean;
  totalBleedRate: number; // mL per second
  isConscious: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  targetAngle?: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  color: number; // Hex number for Pixi (e.g. 0xff4444)
  isLocal?: boolean;
  score?: number;
  health: PlayerHealthSystem;
  weapon?: WeaponType;
  lastTimestamp?: number;
  isDashing?: boolean;
}

export interface WorldConfig {
  width: number;
  height: number;
  friction: number;
  acceleration: number;
  maxSpeed: number;
  defaultRadius: number;
}

export const DEFAULT_WORLD_CONFIG: WorldConfig = {
  width: 3200,
  height: 3200,
  friction: 0.88,
  acceleration: 1.4,
  maxSpeed: 8.0,
  defaultRadius: 28,
};

export interface InputVector {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

export interface PlayerMoveEventPayload {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  color: number;
  bloodVolume?: number;
  weapon?: WeaponType;
  isDashing?: boolean;
  timestamp?: number;
  [key: string]: unknown;
}

export interface PlayerSlashPayload {
  attackerId: string;
  attackerX: number;
  attackerY: number;
  angle: number;
  weapon: WeaponType;
  [key: string]: unknown;
}

export interface PlayerDamagePayload {
  targetId: string;
  attackerId: string;
  partId: BodyPartId;
  category: DamageCategory;
  weapon: WeaponType;
  depth: number;
  damage: number;
  bleedRate: number;
  remainingHealth: number;
  remainingBlood: number;
  armorDamage: number;
  remainingArmor: number;
  deflected: boolean;
  partSevered?: boolean;
  isFatalLoss?: boolean;
  [key: string]: unknown;
}

import {
  ArmorPieceState,
  BodyPartId,
  BodyPartState,
  DamageCategory,
  PlayerHealthSystem,
  WeaponType,
  Wound,
} from "./types";

export const BODY_PART_DEFINITIONS: Record<
  BodyPartId,
  { name: string; maxHealth: number; weight: number; armorName: string }
> = {
  head: { name: "Head", maxHealth: 100, weight: 1.0, armorName: "Steel Sallet Helmet" },
  torso: { name: "Torso", maxHealth: 100, weight: 2.2, armorName: "Reinforced Cuirass" },
  hips: { name: "Hips / Pelvis", maxHealth: 100, weight: 1.5, armorName: "Plated Fauld & Tassets" },
  lower_arm_l: { name: "Left Lower Arm", maxHealth: 100, weight: 1.2, armorName: "Left Vambrace" },
  lower_arm_r: { name: "Right Lower Arm", maxHealth: 100, weight: 1.2, armorName: "Right Vambrace" },
  hand_l: { name: "Left Hand", maxHealth: 100, weight: 0.8, armorName: "Left Steel Gauntlet" },
  hand_r: { name: "Right Hand", maxHealth: 100, weight: 0.8, armorName: "Right Steel Gauntlet" },
  upper_leg_l: { name: "Left Upper Leg", maxHealth: 100, weight: 1.8, armorName: "Left Steel Cuisses" },
  upper_leg_r: { name: "Right Upper Leg", maxHealth: 100, weight: 1.8, armorName: "Right Steel Cuisses" },
  foot_l: { name: "Left Foot", maxHealth: 100, weight: 0.8, armorName: "Left Articulated Sabaton" },
  foot_r: { name: "Right Foot", maxHealth: 100, weight: 0.8, armorName: "Right Articulated Sabaton" },
};

export const MAX_BLOOD_VOLUME = 5000; // 5000 mL = 5 Liters

export function createDefaultHealthSystem(): PlayerHealthSystem {
  const bodyParts = {} as Record<BodyPartId, BodyPartState>;
  const armor = {} as Record<BodyPartId, ArmorPieceState>;

  for (const [id, def] of Object.entries(BODY_PART_DEFINITIONS)) {
    bodyParts[id as BodyPartId] = {
      id: id as BodyPartId,
      name: def.name,
      health: def.maxHealth,
      maxHealth: def.maxHealth,
      wounds: [],
    };

    armor[id as BodyPartId] = {
      id: id as BodyPartId,
      name: def.armorName,
      durability: 100,
      maxDurability: 100,
      isBroken: false,
    };
  }

  return {
    bloodVolume: MAX_BLOOD_VOLUME,
    maxBloodVolume: MAX_BLOOD_VOLUME,
    bodyParts,
    armor,
    isBleeding: false,
    totalBleedRate: 0,
    isConscious: true,
  };
}

/**
 * Chooses a random anatomical body part weighted by exposure.
 */
export function getRandomBodyPart(): BodyPartId {
  const parts = Object.keys(BODY_PART_DEFINITIONS) as BodyPartId[];
  const totalWeight = parts.reduce((acc, p) => acc + BODY_PART_DEFINITIONS[p].weight, 0);
  let random = Math.random() * totalWeight;

  for (const part of parts) {
    random -= BODY_PART_DEFINITIONS[part].weight;
    if (random <= 0) return part;
  }
  return 'torso';
}

/**
 * Inflicts damage on a player's body part with armor simulation.
 *
 * Rules:
 * 1. Sharp Weapons (Sword):
 *    - Has NO effect on flesh if armor durability is >= 50% (deflected! 0 damage, 0 bleed, 0 wounds).
 *    - Chips armor at standard rate (10 durability).
 *    - If armor < 50%, slashes penetrate and inflict damage + bleed DOT.
 * 2. Blunt Weapons (Mace):
 *    - Damages armor 5x faster than sharp weapons (50 durability per hit).
 *    - Always inflicts blunt bruising damage to the flesh, transmitting through armor (deals 5x less damage than sharp weapons).
 */
export function applyDamageToPart(
  health: PlayerHealthSystem,
  partId: BodyPartId,
  category?: DamageCategory,
  customDepth?: number,
  weapon: WeaponType = 'sword'
): {
  partId: BodyPartId;
  category: DamageCategory;
  weapon: WeaponType;
  depth: number;
  damage: number;
  bleedRate: number;
  partHealth: number;
  bloodVolume: number;
  armorDamage: number;
  remainingArmor: number;
  deflected: boolean;
  partSevered: boolean;
  isFatalLoss: boolean;
} {
  const part = health.bodyParts[partId];
  if (!part) throw new Error(`Invalid body part: ${partId}`);

  const armorPiece = health.armor[partId];
  const depth = customDepth !== undefined ? customDepth : Math.round((0.2 + Math.random() * 0.8) * 100) / 100;

  let damage = 0;
  let bleedRate = 0;
  let chosenCategory: DamageCategory = category || (weapon === 'mace' ? 'bruise' : 'slash');
  let armorDamage = 0;
  let deflected = false;

  // 1. Calculate Armor Degradation
  const currentArmor = armorPiece ? armorPiece.durability : 0;

  if (weapon === 'mace') {
    // Blunt weapons: 5x faster at damaging armor (50 durability per hit)
    armorDamage = 50;
  } else {
    // Sharp weapons: standard wear (10 durability per hit)
    armorDamage = 10;
  }

  if (armorPiece) {
    armorPiece.durability = Math.max(0, armorPiece.durability - armorDamage);
    if (armorPiece.durability === 0) {
      armorPiece.isBroken = true;
    }
  }

  // 2. Flesh Damage & Armor Deflection Checks
  if (weapon === 'sword') {
    // Sharp weapons have NO effect on armor with 50% or above durability
    if (currentArmor >= 50) {
      deflected = true;
      damage = 0;
      bleedRate = 0;
    } else {
      // Armor broken or below 50%: blade cuts flesh
      chosenCategory = 'slash';
      // Scaled by how compromised the armor is (0% armor = full damage)
      const penetrationRatio = 1.0 - currentArmor / 100;
      damage = Math.round((15 + depth * 30) * penetrationRatio);
      bleedRate = Math.round((10 + depth * 45) * penetrationRatio * 10) / 10;
    }
  } else {
    // Blunt weapons (mace): blunt impact transfers through armor, causing bruising
    // Deals 5x less flesh damage than sharp weapons ((15 + depth * 30) / 5 = 3 to 9 damage)
    chosenCategory = 'bruise';
    const baseSharpDamage = 15 + depth * 30;
    damage = Math.max(1, Math.round(baseSharpDamage / 5));
    bleedRate = depth > 0.8 ? Math.round((depth * 4 * 10) / 5) / 10 : 0; // negligible external bleed
  }

  // Deduct part health if not deflected
  const previousHealth = part.health;
  part.health = Math.max(0, part.health - damage);

  // Check if part was severed/destroyed in this strike
  let partSevered = false;
  let isFatalLoss = false;

  if (part.health === 0 && previousHealth > 0) {
    part.isSevered = true;
    partSevered = true;

    // Fatal core parts: Head, Torso, Hips/Waist -> Instant total blood loss (0 mL)
    if (partId === 'head' || partId === 'torso' || partId === 'hips') {
      isFatalLoss = true;
      health.bloodVolume = 0;
      health.isConscious = false;
    } else {
      // Limb loss: Deduct a massive percentage of blood (35% of max volume = 1,750 mL)
      const massiveBloodLoss = Math.round(health.maxBloodVolume * 0.35);
      health.bloodVolume = Math.max(0, health.bloodVolume - massiveBloodLoss);
      if (health.bloodVolume < 1200) {
        health.isConscious = false;
      }
    }
  }

  // Add wound only if damage landed
  if (damage > 0 || bleedRate > 0) {
    const wound: Wound = {
      id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      category: chosenCategory,
      depth,
      bleedRate,
      timestamp: Date.now(),
    };
    part.wounds.push(wound);
  }

  // Recalculate total bleed rate
  updateBleedingRate(health);

  return {
    partId,
    category: chosenCategory,
    weapon,
    depth,
    damage,
    bleedRate,
    partHealth: part.health,
    bloodVolume: health.bloodVolume,
    armorDamage,
    remainingArmor: armorPiece ? armorPiece.durability : 0,
    deflected,
    partSevered,
    isFatalLoss,
  };
}

/**
 * Re-sums total bleeding across all body parts.
 */
export function updateBleedingRate(health: PlayerHealthSystem): void {
  let total = 0;
  for (const part of Object.values(health.bodyParts)) {
    for (const wound of part.wounds) {
      total += wound.bleedRate;
    }
  }
  health.totalBleedRate = Math.round(total * 10) / 10;
  health.isBleeding = health.totalBleedRate > 0;
}

/**
 * Ticks bleeding over time, reducing blood volume by bleedRate * deltaSeconds.
 */
export function tickBleeding(health: PlayerHealthSystem, deltaSeconds: number): void {
  if (health.totalBleedRate > 0 && health.bloodVolume > 0) {
    const drained = health.totalBleedRate * deltaSeconds;
    health.bloodVolume = Math.max(0, health.bloodVolume - drained);
  }

  // Consciousness and death threshold
  if (health.bloodVolume < 1200) {
    health.isConscious = false;
  }
}

/**
 * Calculates movement speed multiplier (0.15 to 1.0) based on:
 * 1. Leg and foot integrity:
 *    - Left Upper Leg & Foot (50% weight of leg subsystem)
 *    - Right Upper Leg & Foot (50% weight of leg subsystem)
 *    - Severed leg/foot severely impairs locomotion
 * 2. Hypovolemic shock (blood volume)
 */
export function calculateMovementSpeedMultiplier(health: PlayerHealthSystem): number {
  if (!health || !health.isConscious || health.bloodVolume <= 0) return 0;

  const parts = health.bodyParts;

  // Legs and feet integrity (average health of 4 lower limbs: 0 to 1)
  const legL = (parts.upper_leg_l?.health ?? 100) / 100;
  const legR = (parts.upper_leg_r?.health ?? 100) / 100;
  const footL = (parts.foot_l?.health ?? 100) / 100;
  const footR = (parts.foot_r?.health ?? 100) / 100;

  const locomotionFactor = (legL * 0.35 + footL * 0.15) + (legR * 0.35 + footR * 0.15);
  const legMultiplier = Math.max(0.2, locomotionFactor);

  let bloodMultiplier = 1.0;
  if (health.bloodVolume < 1500) {
    bloodMultiplier = 0.4;
  } else if (health.bloodVolume < 3000) {
    bloodMultiplier = 0.7;
  } else if (health.bloodVolume < 4200) {
    bloodMultiplier = 0.88;
  }

  return Math.max(0.1, Math.round(legMultiplier * bloodMultiplier * 100) / 100);
}

/**
 * Calculates attack cooldown in milliseconds based on hand and arm integrity.
 * Base cooldown is 260ms. Damaged or severed arms/hands increase cooldown up to 750ms.
 */
export function calculateAttackCooldownMs(health: PlayerHealthSystem): number {
  if (!health || !health.isConscious || health.bloodVolume <= 0) return 1000;

  const parts = health.bodyParts;

  const armL = (parts.lower_arm_l?.health ?? 100) / 100;
  const armR = (parts.lower_arm_r?.health ?? 100) / 100;
  const handL = (parts.hand_l?.health ?? 100) / 100;
  const handR = (parts.hand_r?.health ?? 100) / 100;

  const armEfficiency = (armL * 0.35 + handL * 0.15) + (armR * 0.35 + handR * 0.15);
  const cooldown = 260 + (1 - armEfficiency) * 490;
  return Math.round(cooldown);
}

/**
 * Maps a body part's health (0-100) to standard tactical UI colors.
 */
export function getBodyPartColor(health: number, isBleeding: boolean): string {
  if (health <= 0) return '#18181b'; // Destroyed / Black
  if (health < 25) return isBleeding ? '#ef4444' : '#dc2626'; // Deep Red
  if (health < 50) return '#f97316'; // Orange
  if (health < 80) return '#eab308'; // Yellow
  return isBleeding ? '#eab308' : '#22c55e'; // Green (or yellow if bleeding)
}

/**
 * Maps armor durability (0-100) to tactical armor status colors.
 */
export function getArmorPieceColor(durability: number): string {
  if (durability <= 0) return '#27272a'; // Broken / Shattered (Dark)
  if (durability < 30) return '#ef4444'; // Severely compromised (Red)
  if (durability < 50) return '#f97316'; // Vulnerable to sharp blades (Orange)
  if (durability < 80) return '#eab308'; // Scratched / Dented (Yellow)
  return '#38bdf8'; // Pristine Steel Plate (Cyan / Light Blue)
}

/**
 * Determines the optimal weapon choice against a target based on their armor status.
 *
 * Logic:
 * - If target has intact armor (>=50% durability on vital/any parts), sharp attacks get deflected (0 damage).
 *   Blunt weapons (mace) crush armor 5x faster and penetrate with bruising.
 * - Once target's armor is compromised (<50% durability across most parts or destroyed),
 *   sharp weapons (sword) deal 5x more flesh damage and cause lethal bleeding.
 */
export function selectOptimalWeaponForTarget(targetHealth: PlayerHealthSystem): WeaponType {
  if (!targetHealth || !targetHealth.armor) return 'sword';

  const armorPieces = Object.values(targetHealth.armor);
  if (armorPieces.length === 0) return 'sword';

  // Core lethal targets: head, torso, hips
  const coreParts: BodyPartId[] = ['head', 'torso', 'hips'];
  const coreArmorIntact = coreParts.some((id) => {
    const piece = targetHealth.armor[id];
    return piece && piece.durability >= 50;
  });

  if (coreArmorIntact) {
    return 'mace'; // Crush armored core with mace
  }

  // Count how many total pieces are deflecting sharp blades
  const deflectingCount = armorPieces.filter((p) => p.durability >= 50).length;
  if (deflectingCount >= 3) {
    return 'mace';
  }

  // Armor is weak or broken: switch to sword for 5x damage and bleeding
  return 'sword';
}

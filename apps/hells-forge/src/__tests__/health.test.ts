import { describe, it, expect } from "vitest";
import {
  createDefaultHealthSystem,
  applyDamageToPart,
  tickBleeding,
  getBodyPartColor,
  calculateMovementSpeedMultiplier,
  calculateAttackCooldownMs,
  selectOptimalWeaponForTarget,
} from "../game/health";
import { checkSlashHit } from "../game/physics";
import { PlayerState, DEFAULT_WORLD_CONFIG } from "../game/types";

describe("Anatomical Health System", () => {
  it("initializes with 5000 mL blood and 100% health across all 11 body parts", () => {
    const health = createDefaultHealthSystem();
    expect(health.bloodVolume).toBe(5000);
    expect(health.maxBloodVolume).toBe(5000);
    expect(health.isBleeding).toBe(false);
    expect(health.totalBleedRate).toBe(0);
    expect(health.isConscious).toBe(true);

    const parts = Object.keys(health.bodyParts);
    expect(parts.length).toBe(11);
    expect(health.bodyParts.head.health).toBe(100);
    expect(health.bodyParts.torso.health).toBe(100);
    expect(health.bodyParts.hips.health).toBe(100);
    expect(health.bodyParts.lower_arm_l.health).toBe(100);
    expect(health.bodyParts.hand_l.health).toBe(100);
    expect(health.bodyParts.foot_r.health).toBe(100);
  });

  it("applies slash damage with depth-scaled bleeding rate on compromised armor", () => {
    const health = createDefaultHealthSystem();
    health.armor.torso.durability = 0; // Unarmored / broken plate

    // Inflict deep slash on torso (depth 0.8)
    const result = applyDamageToPart(health, "torso", "slash", 0.8, "sword");

    expect(result.partId).toBe("torso");
    expect(result.category).toBe("slash");
    expect(result.depth).toBe(0.8);
    expect(result.damage).toBeGreaterThan(30);
    expect(result.bleedRate).toBeGreaterThan(35); // Heavy bleed rate
    expect(health.bodyParts.torso.health).toBeLessThan(70);
    expect(health.isBleeding).toBe(true);
    expect(health.totalBleedRate).toBe(result.bleedRate);
  });

  it("applies bruise damage with lower bleeding rate", () => {
    const health = createDefaultHealthSystem();

    // Inflict bruise on lower arm (depth 0.4)
    const result = applyDamageToPart(health, "lower_arm_l", "bruise", 0.4);

    expect(result.category).toBe("bruise");
    expect(result.damage).toBeLessThan(30);
    expect(result.bleedRate).toBe(0); // Shallow bruises do not bleed externally
  });

  it("ticks bleeding over time and drains blood volume according to bleed rate", () => {
    const health = createDefaultHealthSystem();
    health.armor.torso.durability = 0;
    // Torso slash causing 40 mL/s bleed
    applyDamageToPart(health, "torso", "slash", 0.7, "sword");
    const initialBlood = health.bloodVolume;
    const bleedRate = health.totalBleedRate;

    // Simulate 2 seconds of bleeding
    tickBleeding(health, 2.0);

    const expectedBlood = initialBlood - bleedRate * 2.0;
    expect(Math.abs(health.bloodVolume - expectedBlood)).toBeLessThan(0.01);
  });

  it("causes loss of consciousness when blood volume drops below critical threshold", () => {
    const health = createDefaultHealthSystem();
    health.bloodVolume = 1100;
    health.totalBleedRate = 50;

    tickBleeding(health, 1.0);

    expect(health.isConscious).toBe(false);
  });

  it("deducts a massive percentage (35%) of blood when losing a non-vital limb", () => {
    const health = createDefaultHealthSystem();
    // Reduce hand to low health and broken armor first
    health.bodyParts.hand_l.health = 10;
    health.armor.hand_l.durability = 0;

    // Strike that destroys the hand (health reaches 0)
    const result = applyDamageToPart(health, "hand_l", "slash", 0.9, "sword");

    expect(result.partSevered).toBe(true);
    expect(result.isFatalLoss).toBe(false);
    expect(health.bodyParts.hand_l.health).toBe(0);
    expect(health.bodyParts.hand_l.isSevered).toBe(true);
    // Max blood is 5000 mL, 35% loss = 1750 mL deducted -> 3250 mL remaining
    expect(health.bloodVolume).toBe(3250);
  });

  it("instantly loses all blood (0 mL) when losing head, torso, or hips/waist", () => {
    // 1. Head destruction
    const healthHead = createDefaultHealthSystem();
    healthHead.bodyParts.head.health = 5;
    healthHead.armor.head.durability = 0;
    const resultHead = applyDamageToPart(healthHead, "head", "slash", 0.9, "sword");
    expect(resultHead.partSevered).toBe(true);
    expect(resultHead.isFatalLoss).toBe(true);
    expect(healthHead.bloodVolume).toBe(0);
    expect(healthHead.isConscious).toBe(false);

    // 2. Torso destruction
    const healthTorso = createDefaultHealthSystem();
    healthTorso.bodyParts.torso.health = 15;
    healthTorso.armor.torso.durability = 0;
    const resultTorso = applyDamageToPart(healthTorso, "torso", "slash", 0.9, "sword");
    expect(resultTorso.partSevered).toBe(true);
    expect(resultTorso.isFatalLoss).toBe(true);
    expect(healthTorso.bloodVolume).toBe(0);
    expect(healthTorso.isConscious).toBe(false);

    // 3. Hips / Waist destruction
    const healthHips = createDefaultHealthSystem();
    healthHips.bodyParts.hips.health = 10;
    healthHips.armor.hips.durability = 0;
    const resultHips = applyDamageToPart(healthHips, "hips", "slash", 0.9, "sword");
    expect(resultHips.partSevered).toBe(true);
    expect(resultHips.isFatalLoss).toBe(true);
    expect(healthHips.bloodVolume).toBe(0);
    expect(healthHips.isConscious).toBe(false);
  });

  it("reduces movement speed significantly when legs or feet are damaged or severed", () => {
    const health = createDefaultHealthSystem();

    // Pristine health = 1.0 multiplier
    expect(calculateMovementSpeedMultiplier(health)).toBe(1.0);

    // Severe damage to left and right upper legs
    health.bodyParts.upper_leg_l.health = 20;
    health.bodyParts.upper_leg_r.health = 20;
    const damagedSpeed = calculateMovementSpeedMultiplier(health);
    expect(damagedSpeed).toBeLessThan(0.6);

    // Sever both legs and feet
    health.bodyParts.upper_leg_l.health = 0;
    health.bodyParts.upper_leg_r.health = 0;
    health.bodyParts.foot_l.health = 0;
    health.bodyParts.foot_r.health = 0;
    const severedSpeed = calculateMovementSpeedMultiplier(health);
    // Severed legs cap locomotion down towards 0.2 crawl speed
    expect(severedSpeed).toBeLessThanOrEqual(0.25);
  });

  it("increases attack cooldown when arms or hands are damaged or severed", () => {
    const health = createDefaultHealthSystem();

    // Pristine health = base attack cooldown (260ms)
    expect(calculateAttackCooldownMs(health)).toBe(260);

    // Destroy left arm and hand
    health.bodyParts.lower_arm_l.health = 0;
    health.bodyParts.hand_l.health = 0;
    const oneArmCooldown = calculateAttackCooldownMs(health);
    expect(oneArmCooldown).toBeGreaterThan(450); // Significant attack delay

    // Destroy both arms and hands
    health.bodyParts.lower_arm_r.health = 0;
    health.bodyParts.hand_r.health = 0;
    const noArmsCooldown = calculateAttackCooldownMs(health);
    expect(noArmsCooldown).toBe(750); // Maximum attack penalty
  });

  it("returns proper color coding based on part health and bleeding status", () => {
    expect(getBodyPartColor(100, false)).toBe("#22c55e"); // Green
    expect(getBodyPartColor(70, false)).toBe("#eab308"); // Yellow
    expect(getBodyPartColor(40, false)).toBe("#f97316"); // Orange
    expect(getBodyPartColor(15, false)).toBe("#dc2626"); // Red
    expect(getBodyPartColor(0, false)).toBe("#18181b"); // Black / Destroyed
  });

  describe("Armor & Weapon Mechanics", () => {
    it("sharp weapon (sword) is deflected by armor with 50% or above durability (0 damage, 0 bleed)", () => {
      const health = createDefaultHealthSystem();
      expect(health.armor.torso.durability).toBe(100);

      // Attack torso with sword
      const result = applyDamageToPart(health, "torso", undefined, 0.8, "sword");

      expect(result.deflected).toBe(true);
      expect(result.damage).toBe(0);
      expect(result.bleedRate).toBe(0);
      expect(health.bodyParts.torso.health).toBe(100);
      expect(health.armor.torso.durability).toBe(90); // 10 standard armor degradation
      expect(health.bodyParts.torso.wounds.length).toBe(0); // No flesh wound
    });

    it("sharp weapon (sword) cuts flesh once armor drops below 50% durability", () => {
      const health = createDefaultHealthSystem();
      // Compromise torso armor to 40%
      health.armor.torso.durability = 40;

      const result = applyDamageToPart(health, "torso", undefined, 0.8, "sword");

      expect(result.deflected).toBe(false);
      expect(result.damage).toBeGreaterThan(0);
      expect(result.bleedRate).toBeGreaterThan(0);
      expect(result.category).toBe("slash");
      expect(health.bodyParts.torso.health).toBeLessThan(100);
      expect(health.armor.torso.durability).toBe(30);
      expect(health.isBleeding).toBe(true);
    });

    it("blunt weapon (mace) damages armor 5x faster (50 durability) and inflicts bruising through intact armor", () => {
      const health = createDefaultHealthSystem();
      expect(health.armor.head.durability).toBe(100);

      // Attack head with mace
      const result = applyDamageToPart(health, "head", undefined, 0.5, "mace");

      expect(result.deflected).toBe(false);
      expect(result.armorDamage).toBe(50); // 5x faster than sharp (10)
      expect(result.remainingArmor).toBe(50);
      expect(result.category).toBe("bruise");
      expect(result.damage).toBeGreaterThan(0);
      expect(health.bodyParts.head.health).toBeLessThan(100);
    });

    it("blunt weapons deal 5x less flesh damage than sharp weapons", () => {
      const depth = 0.5;
      const baseSharpDamage = 15 + depth * 30; // 30

      // Sharp strike on unarmored part
      const healthSharp = createDefaultHealthSystem();
      healthSharp.armor.torso.durability = 0;
      const sharpResult = applyDamageToPart(healthSharp, "torso", undefined, depth, "sword");

      // Blunt strike
      const healthBlunt = createDefaultHealthSystem();
      const bluntResult = applyDamageToPart(healthBlunt, "torso", undefined, depth, "mace");

      expect(sharpResult.damage).toBe(baseSharpDamage);
      expect(bluntResult.damage).toBe(Math.round(baseSharpDamage / 5));
      expect(sharpResult.damage / bluntResult.damage).toBe(5);
    });

    it("selects mace when target has intact armor (>=50% durability) and sword when armor is depleted", () => {
      const target = createDefaultHealthSystem();
      // Pristine armor (100% durability) deflects swords -> AI chooses mace to crush plate
      expect(selectOptimalWeaponForTarget(target)).toBe("mace");

      // Deplete all armor pieces below 50%
      for (const piece of Object.values(target.armor)) {
        piece.durability = 20;
      }
      // Target vulnerable to sharp blades -> AI chooses sword for 5x damage and bleeding
      expect(selectOptimalWeaponForTarget(target)).toBe("sword");
    });
  });
});

describe("Combat Slash Hit Detection", () => {
  it("detects hit when target is within melee range and forward cone", () => {
    const attacker: PlayerState = {
      id: "a1",
      name: "Attacker",
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0, // Facing right (+x)
      radius: 28,
      color: 0xff0000,
      health: createDefaultHealthSystem(),
    };

    const targetInFront: PlayerState = {
      id: "t1",
      name: "Target Front",
      x: 150, // 50px away in front
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 28,
      color: 0x0000ff,
      health: createDefaultHealthSystem(),
    };

    expect(checkSlashHit(attacker, targetInFront, 80)).toBe(true);
  });

  it("misses when target is behind the attacker", () => {
    const attacker: PlayerState = {
      id: "a1",
      name: "Attacker",
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0, // Facing right (+x)
      radius: 28,
      color: 0xff0000,
      health: createDefaultHealthSystem(),
    };

    const targetBehind: PlayerState = {
      id: "t2",
      name: "Target Behind",
      x: 50, // 50px away behind
      y: 100,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 28,
      color: 0x0000ff,
      health: createDefaultHealthSystem(),
    };

    expect(checkSlashHit(attacker, targetBehind, 80)).toBe(false);
  });
});

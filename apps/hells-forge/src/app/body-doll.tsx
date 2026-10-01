"use client";

import React from "react";
import { BodyPartId, PlayerHealthSystem } from "../game/types";
import { getBodyPartColor, getArmorPieceColor } from "../game/health";
import { Droplet, Shield, HeartPulse } from "lucide-react";

interface BodyDollProps {
  health: PlayerHealthSystem;
  onPartClick?: (partId: BodyPartId) => void;
}

export function BodyDoll({ health, onPartClick }: BodyDollProps) {
  const parts = health.bodyParts;
  const armor = health.armor;

  // Helper to render an SVG body part segment with flesh base and armor overlay
  const renderPart = (
    id: BodyPartId,
    fleshShape: React.ReactNode,
    armorShape: React.ReactNode,
    label: string,
    isBleedingPart: boolean
  ) => {
    const part = parts[id];
    const armPiece = armor ? armor[id] : undefined;
    const hp = part ? part.health : 100;
    const armorDurability = armPiece ? armPiece.durability : 0;

    const fleshFill = getBodyPartColor(hp, isBleedingPart);
    const fleshStroke = isBleedingPart ? "#ff3333" : "#3f3f46";

    const armorStroke = getArmorPieceColor(armorDurability);
    const hasArmor = armorDurability > 0;

    const tooltipText = `${label}: ${Math.round(hp)}% HP (${part?.wounds.length || 0} wounds, ${
      isBleedingPart ? "Bleeding" : "Stable"
    }) | ${armPiece?.name || "Armor"}: ${Math.round(armorDurability)}% (${
      armorDurability >= 50
        ? "Deflects Sharp Blades"
        : armorDurability > 0
        ? "Vulnerable"
        : "Broken"
    })`;

    return (
      <g
        key={id}
        className="doll-part-group"
        onClick={() => onPartClick?.(id)}
        style={{ cursor: "pointer" }}
      >
        <title>{tooltipText}</title>
        {/* Base Flesh Silhouette */}
        {React.cloneElement(fleshShape as React.ReactElement<React.SVGProps<SVGElement>>, {
          fill: fleshFill,
          stroke: fleshStroke,
          strokeWidth: isBleedingPart ? 1.5 : 1,
          className: `doll-part ${isBleedingPart ? "pulsing-bleed" : ""}`,
        })}

        {/* Overlay Armor Piece */}
        {hasArmor &&
          React.cloneElement(armorShape as React.ReactElement<React.SVGProps<SVGElement>>, {
            fill: "none",
            stroke: armorStroke,
            strokeWidth: armorDurability >= 50 ? 2.5 : 1.5,
            strokeDasharray: armorDurability < 50 ? "3 2" : undefined,
            className: "doll-armor-overlay",
            style: {
              filter:
                armorDurability >= 50
                  ? "drop-shadow(0 0 2px rgba(56, 189, 248, 0.6))"
                  : undefined,
              pointerEvents: "none",
            },
          })}
      </g>
    );
  };

  return (
    <div className="body-doll-card">
      <div className="body-doll-header">
        <div className="body-doll-title-wrap">
          <HeartPulse size={13} className="text-rose-500" />
          <span className="body-doll-title">STATUS & ARMOR</span>
        </div>

        {health.isBleeding && (
          <span className="bleed-badge">
            <Droplet size={11} className="pulse-drop" />
            <span>-{health.totalBleedRate} mL/s</span>
          </span>
        )}
      </div>

      <div className="body-doll-content">
        {/* SVG Paperdoll Silhouette with Overlaid Armor */}
        <div className="doll-svg-container">
          <svg viewBox="0 0 160 250" className="doll-svg">
            {/* Head: flesh circle + armor helmet cap/arc overlay */}
            {renderPart(
              "head",
              <circle cx="80" cy="24" r="16" />,
              <path d="M 62,24 A 18 18 0 0 1 98,24 L 97,32 L 91,28 L 69,28 L 63,32 Z" />,
              "Head",
              (parts.head?.wounds.length || 0) > 0 && parts.head.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Torso: flesh path + cuirass breastplate outline */}
            {renderPart(
              "torso",
              <path d="M 60,44 L 100,44 L 96,105 L 64,105 Z" />,
              <path d="M 58,43 L 102,43 L 98,105 L 62,105 Z" />,
              "Torso",
              (parts.torso?.wounds.length || 0) > 0 && parts.torso.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Hips / Pelvis: flesh path + tassets/fauld overlay */}
            {renderPart(
              "hips",
              <path d="M 64,108 L 96,108 L 91,130 L 69,130 Z" />,
              <path d="M 63,107 L 97,107 L 92,131 L 68,131 Z" />,
              "Hips",
              (parts.hips?.wounds.length || 0) > 0 && parts.hips.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Left Lower Arm: vambrace overlay */}
            {renderPart(
              "lower_arm_l",
              <rect x="42" y="52" width="14" height="42" rx="4" />,
              <rect x="40" y="51" width="18" height="44" rx="5" />,
              "Left Lower Arm",
              (parts.lower_arm_l?.wounds.length || 0) > 0 && parts.lower_arm_l.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Right Lower Arm: vambrace overlay */}
            {renderPart(
              "lower_arm_r",
              <rect x="104" y="52" width="14" height="42" rx="4" />,
              <rect x="102" y="51" width="18" height="44" rx="5" />,
              "Right Lower Arm",
              (parts.lower_arm_r?.wounds.length || 0) > 0 && parts.lower_arm_r.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Left Hand: gauntlet overlay */}
            {renderPart(
              "hand_l",
              <circle cx="49" cy="103" r="6.5" />,
              <circle cx="49" cy="103" r="8.5" />,
              "Left Hand",
              (parts.hand_l?.wounds.length || 0) > 0 && parts.hand_l.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Right Hand: gauntlet overlay */}
            {renderPart(
              "hand_r",
              <circle cx="111" cy="103" r="6.5" />,
              <circle cx="111" cy="103" r="8.5" />,
              "Right Hand",
              (parts.hand_r?.wounds.length || 0) > 0 && parts.hand_r.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Left Upper Leg: cuisse plate overlay */}
            {renderPart(
              "upper_leg_l",
              <rect x="63" y="134" width="14" height="66" rx="5" />,
              <rect x="61" y="133" width="18" height="68" rx="6" />,
              "Left Upper Leg",
              (parts.upper_leg_l?.wounds.length || 0) > 0 && parts.upper_leg_l.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Right Upper Leg: cuisse plate overlay */}
            {renderPart(
              "upper_leg_r",
              <rect x="83" y="134" width="14" height="66" rx="5" />,
              <rect x="81" y="133" width="18" height="68" rx="6" />,
              "Right Upper Leg",
              (parts.upper_leg_r?.wounds.length || 0) > 0 && parts.upper_leg_r.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Left Foot: sabaton overlay */}
            {renderPart(
              "foot_l",
              <path d="M 57,204 L 77,204 L 75,216 L 55,216 Z" />,
              <path d="M 55,203 L 79,203 L 77,218 L 53,218 Z" />,
              "Left Foot",
              (parts.foot_l?.wounds.length || 0) > 0 && parts.foot_l.wounds.some((w) => w.bleedRate > 0)
            )}

            {/* Right Foot: sabaton overlay */}
            {renderPart(
              "foot_r",
              <path d="M 83,204 L 103,204 L 105,216 L 85,216 Z" />,
              <path d="M 81,203 L 105,203 L 107,218 L 83,218 Z" />,
              "Right Foot",
              (parts.foot_r?.wounds.length || 0) > 0 && parts.foot_r.wounds.some((w) => w.bleedRate > 0)
            )}
          </svg>
        </div>

        {/* Anatomical & Armor Combined Breakdown List */}
        <div className="doll-parts-list">
          {Object.values(parts).map((p) => {
            const hasBleed = p.wounds.some((w) => w.bleedRate > 0);
            const armPiece = armor ? armor[p.id] : undefined;
            const armorDurability = armPiece ? armPiece.durability : 0;
            const fleshDotColor = getBodyPartColor(p.health, hasBleed);
            const armorColor = getArmorPieceColor(armorDurability);

            return (
              <div key={p.id} className="doll-part-row">
                <span className="doll-part-name">
                  <span className="status-dot" style={{ backgroundColor: fleshDotColor }} />
                  {p.name}
                </span>

                <div className="doll-part-indicators">
                  {p.health === 0 ? (
                    <span className="part-severed-tag">SEVERED</span>
                  ) : (
                    <>
                      {hasBleed && (
                        <span className="part-bleed-tag" title="Bleeding wound">
                          <Droplet size={10} />
                        </span>
                      )}
                      <span className="doll-part-hp">{Math.round(p.health)}%</span>
                      {armPiece && (
                        <span
                          className="doll-part-armor"
                          style={{ color: armorColor }}
                          title={`${armPiece.name}: ${Math.round(armorDurability)}% durability`}
                        >
                          <Shield size={9} />
                          {Math.round(armorDurability)}%
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  PresentationDeck,
  PresentationPinnedSection,
  PresentationHorizontal,
  PresentationZoom,
  PresentationCardStack,
  PresentationSplit,
  PresentationParallax,
  PresentationPopOutCard,
  type PresentationZoomMode,
  type PresentationSplitDirection,
} from "@mono/components";
import "./presentation-test.css";

const DECK_SECTIONS = [
  { id: "pres-pinned", label: "1. Pinned Background & Steps" },
  { id: "pres-horizontal", label: "2. Horizontal Scroll Lock" },
  { id: "pres-zoom", label: "3. Scroll Zoom & Portal" },
  { id: "pres-stack", label: "4. Sticky Card Stack" },
  { id: "pres-split", label: "5. Split Shutter Doors" },
  { id: "pres-parallax", label: "6. Multi-Layer Parallax" },
  { id: "pres-popout", label: "7. 3D Pop-Out Illusion Card" },
];

const PINNED_STEPS = [
  {
    id: "step-1",
    badge: "Phase 01 · Lock",
    title: "Sticky Background Runway",
    description:
      "The outer container creates a 300vh scroll runway while the inner 100vh stage locks in place. Background layers scale subtly as you scrub.",
    visual: (
      <div
        className="pres-stage-card"
        style={{
          minHeight: "34vh",
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        }}
      >
        <h3>Viewport Locked</h3>
        <p>Scroll down to crossfade into Phase 02 while the backdrop stays anchored.</p>
      </div>
    ),
  },
  {
    id: "step-2",
    badge: "Phase 02 · Scrub",
    title: "Spring-Damped Step Transitions",
    description:
      "Each step maps its slice of scrollYProgress to opacity, vertical translation, and scale through Framer Motion useSpring + useTransform.",
    visual: (
      <div
        className="pres-stage-card"
        style={{
          minHeight: "34vh",
          background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
        }}
      >
        <h3>Choreographed Sequence</h3>
        <p>Scroll back up at any point to reverse the timeline smoothly.</p>
      </div>
    ),
  },
  {
    id: "step-3",
    badge: "Phase 03 · Release",
    title: "Natural Scroll Hand-Off",
    description:
      "Once the final step completes at 100% progress, the sticky container reaches the bottom of its runway and releases vertical scroll naturally.",
    visual: (
      <div
        className="pres-stage-card"
        style={{
          minHeight: "34vh",
          background: "linear-gradient(135deg, #10b981, #059669)",
        }}
      >
        <h3>Ready for Release</h3>
        <p>Keep scrolling to transition seamlessly into the Horizontal Scroll Lock.</p>
      </div>
    ),
  },
];

const HORIZONTAL_SLIDES = [
  {
    title: "01 · Architecture Overview",
    subtitle: "Vertical Scroll → Horizontal Pan",
    bg: "linear-gradient(135deg, #d97706, #b45309)",
  },
  {
    title: "02 · Spring Physics Engine",
    subtitle: "Framer Motion useScroll + useSpring",
    bg: "linear-gradient(135deg, #7c3aed, #db2777)",
  },
  {
    title: "03 · Zero Layout Thrashing",
    subtitle: "GPU-Accelerated translate3d & scale",
    bg: "linear-gradient(135deg, #059669, #0284c7)",
  },
  {
    title: "04 · Responsive Viewports",
    subtitle: "Automatic Slide Count & Progress Bar",
    bg: "linear-gradient(135deg, #4f46e5, #06b6d4)",
  },
];

const STACK_CARDS = [
  {
    badge: "Deck Card 01",
    title: "Foundation Layer",
    desc: "Pins at the top of the viewport and scales down backward as Card 02 slides up over it.",
    bg: "linear-gradient(145deg, #1e1b4b, #4338ca)",
  },
  {
    badge: "Deck Card 02",
    title: "Interactive Middleware",
    desc: "Offsets by 24px so the previous card's top edge remains visible in a physical stack.",
    bg: "linear-gradient(145deg, #3b0764, #7e22ce)",
  },
  {
    badge: "Deck Card 03",
    title: "Presentation Surface",
    desc: "Completes the stack before releasing scroll to the next presentation section.",
    bg: "linear-gradient(145deg, #064e3b, #047857)",
  },
];

export function PresentationTestingView() {
  const [smooth, setSmooth] = useState(true);
  const [zoomMode, setZoomMode] = useState<PresentationZoomMode>("portal");
  const [splitDir, setSplitDir] = useState<PresentationSplitDirection>("horizontal");
  const [runwayMultiplier, setRunwayMultiplier] = useState<number>(3);

  return (
    <PresentationDeck sections={DECK_SECTIONS} smooth={smooth}>
      <div className="pres-page">
        <header className="pres-hero">
          <span className="pres-badge">Framer Motion Scrollytelling Suite</span>
          <h1>Presentation Transitions Playground</h1>
          <p>
            Interactive test bench for Framer Motion scroll-locked presentation components:
            pinned background timelines, vertical-to-horizontal scroll hijacks, portal zoom
            reveals, sticky card decks, parting shutter doors, and multi-layer parallax.
          </p>
        </header>

        {/* Interactive Sandbox Controls */}
        <div className="pres-controls" role="region" aria-label="Presentation sandbox controls">
          <div className="pres-control-group">
            <span className="pres-control-label">Spring Smoothing:</span>
            <button
              type="button"
              className="pres-btn"
              data-active={smooth}
              onClick={() => setSmooth((prev) => !prev)}
            >
              {smooth ? "Smooth (useSpring)" : "Raw (1:1 Scroll)"}
            </button>
          </div>

          <div className="pres-control-group">
            <label htmlFor="pres-zoom-mode" className="pres-control-label">
              Zoom Mode:
            </label>
            <select
              id="pres-zoom-mode"
              className="pres-select"
              value={zoomMode}
              onChange={(e) => setZoomMode(e.target.value as PresentationZoomMode)}
            >
              <option value="portal">portal (expand frame + reveal)</option>
              <option value="zoom-in">zoom-in (grow into place)</option>
              <option value="zoom-out">zoom-out (shrink away)</option>
            </select>
          </div>

          <div className="pres-control-group">
            <label htmlFor="pres-split-dir" className="pres-control-label">
              Split Direction:
            </label>
            <select
              id="pres-split-dir"
              className="pres-select"
              value={splitDir}
              onChange={(e) => setSplitDir(e.target.value as PresentationSplitDirection)}
            >
              <option value="horizontal">horizontal (left / right doors)</option>
              <option value="vertical">vertical (top / bottom doors)</option>
            </select>
          </div>

          <div className="pres-control-group">
            <label htmlFor="pres-runway" className="pres-control-label">
              Pin Runway:
            </label>
            <select
              id="pres-runway"
              className="pres-select"
              value={runwayMultiplier}
              onChange={(e) => setRunwayMultiplier(Number(e.target.value))}
            >
              <option value={2}>2x Viewport (Fast)</option>
              <option value={3}>3x Viewport (Balanced)</option>
              <option value={4}>4x Viewport (Cinematic)</option>
            </select>
          </div>
        </div>

        {/* 1. PresentationPinnedSection */}
        <section id="pres-pinned" className="pres-section">
          <div className="pres-section-header">
            <h2>1. PresentationPinnedSection · Locked Background & Step Scrubbing</h2>
            <p>
              Locks the background stage while sequentially crossfading foreground presentation steps.
            </p>
          </div>

          <PresentationPinnedSection
            smooth={smooth}
            length={runwayMultiplier}
            background={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  background:
                    "radial-gradient(circle at 20% 25%, var(--color-primary-tint, rgb(255 255 255 / 8%)), transparent 55%), radial-gradient(circle at 80% 75%, rgb(44 78 255 / 18%), var(--shade-obsidian, #050507))",
                }}
              />
            }
            steps={PINNED_STEPS}
          />
        </section>

        {/* 2. PresentationHorizontal */}
        <section id="pres-horizontal" className="pres-section">
          <div className="pres-section-header">
            <h2>2. PresentationHorizontal · Vertical-to-Horizontal Scroll Lock</h2>
            <p>
              Locks vertical scroll and translates a multi-slide horizontal track sideways across the viewport.
            </p>
          </div>

          <PresentationHorizontal
            smooth={smooth}
            length={runwayMultiplier}
            header={
              <div style={{ color: "var(--color-primary, #fff)", fontWeight: 700 }}>
                Horizontal Showcase Track · Keep Scrolling Down
              </div>
            }
          >
            {HORIZONTAL_SLIDES.map((slide) => (
              <div
                key={slide.title}
                className="pres-stage-card"
                style={{ background: slide.bg, maxWidth: "820px", minHeight: "62vh" }}
              >
                <h3>{slide.title}</h3>
                <p>{slide.subtitle}</p>
              </div>
            ))}
          </PresentationHorizontal>
        </section>

        {/* 3. PresentationZoom */}
        <section id="pres-zoom" className="pres-section">
          <div className="pres-section-header">
            <h2>3. PresentationZoom · Scroll Zoom & Portal Reveal</h2>
            <p>
              Current mode: <strong>{zoomMode}</strong>. Scales the focal target across the pinned scroll runway and reveals the inner overlay.
            </p>
          </div>

          <PresentationZoom
            smooth={smooth}
            mode={zoomMode}
            length={runwayMultiplier}
            backdrop={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  background: "radial-gradient(circle at center, #1e1b4b, #09090b)",
                }}
              />
            }
            overlay={
              <div
                style={{
                  padding: "24px 32px",
                  borderRadius: "16px",
                  background: "rgb(0 0 0 / 65%)",
                  border: "1px solid var(--color-primary-border, rgb(255 255 255 / 20%))",
                  color: "#fff",
                  textAlign: "center",
                  backdropFilter: "blur(8px)",
                }}
              >
                <h3 style={{ margin: "0 0 8px", fontSize: "1.6rem" }}>
                  Inner Portal Revealed
                </h3>
                <p style={{ margin: 0, opacity: 0.85 }}>
                  This overlay fades and slides into place once zoom progress passes 50%.
                </p>
              </div>
            }
          >
            <div
              className="pres-stage-card"
              style={{
                width: "min(560px, 80vw)",
                minHeight: "44vh",
                background: "linear-gradient(135deg, var(--sp-blue, #2c4eff), var(--sp-violet, #ab9bf2))",
              }}
            >
              <h3>Zoom Focal Frame</h3>
              <p>Scroll to scale this frame ({zoomMode} mode).</p>
            </div>
          </PresentationZoom>
        </section>

        {/* 4. PresentationCardStack */}
        <section id="pres-stack" className="pres-section">
          <div className="pres-section-header">
            <h2>4. PresentationCardStack · Sticky Pull-Back Card Deck</h2>
            <p>
              Cards pin to the top and scale down in 3D depth as subsequent cards slide over them.
            </p>
          </div>

          <PresentationCardStack smooth={smooth} itemHeight="72vh">
            {STACK_CARDS.map((card) => (
              <div
                key={card.title}
                className="pres-stage-card"
                style={{ background: card.bg, minHeight: "66vh" }}
              >
                <span className="pres-badge" style={{ background: "rgb(255 255 255 / 15%)", color: "#fff" }}>
                  {card.badge}
                </span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </PresentationCardStack>
        </section>

        {/* 5. PresentationSplit */}
        <section id="pres-split" className="pres-section">
          <div className="pres-section-header">
            <h2>5. PresentationSplit · Parting Shutter Doors</h2>
            <p>
              Direction: <strong>{splitDir}</strong>. Two shutter panels part along the chosen axis to unveil the stage underneath.
            </p>
          </div>

          <PresentationSplit
            smooth={smooth}
            direction={splitDir}
            length={runwayMultiplier}
            panelA={
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary, #fff)" }}>
                SHUTTER A
              </div>
            }
            panelB={
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text, #fff)" }}>
                SHUTTER B
              </div>
            }
          >
            <div
              className="pres-stage-card"
              style={{
                minHeight: "80vh",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #0f766e, #1d4ed8)",
              }}
            >
              <h3>Unveiled Center Stage</h3>
              <p>The shutters part smoothly as you scroll through the pinned section.</p>
            </div>
          </PresentationSplit>
        </section>

        {/* 6. PresentationParallax */}
        <section id="pres-parallax" className="pres-section">
          <div className="pres-section-header">
            <h2>6. PresentationParallax · Multi-Layer Depth Drift</h2>
            <p>
              Background, midground, and foreground layers drift at independent speeds as the section crosses the viewport.
            </p>
          </div>

          <PresentationParallax
            smooth={smooth}
            height="72vh"
            layers={[
              {
                id: "deep-bg",
                speed: -0.45,
                scale: [1.05, 1.15],
                content: (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "16px",
                      background:
                        "radial-gradient(circle at 30% 30%, #4338ca, #09090b 75%)",
                    }}
                  />
                ),
              },
              {
                id: "mid-orb",
                speed: 0.35,
                content: (
                  <div
                    style={{
                      width: "260px",
                      height: "260px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, var(--color-primary-border, rgb(255 255 255 / 20%)), transparent 70%)",
                      filter: "blur(12px)",
                    }}
                  />
                ),
              },
            ]}
          >
            <div
              className="pres-stage-card"
              style={{
                maxWidth: "560px",
                minHeight: "32vh",
                background: "var(--color-surface-glass, rgb(10 10 12 / 85%))",
                border: "1px solid var(--color-border, #1f1f27)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3>Multi-Depth Parallax Stage</h3>
              <p>
                Deep background recedes (-0.45x), golden aura advances (+0.35x), and this card anchors the foreground.
              </p>
            </div>
          </PresentationParallax>
        </section>

        {/* 7. PresentationPopOutCard */}
        <section id="pres-popout" className="pres-section">
          <div className="pres-section-header">
            <h2>7. PresentationPopOutCard · Two-Halves Out-of-Bounds Illusion Card</h2>
            <p>
              Divided into two halves: the top half holds the image expanding beyond the card boundaries while facing the mouse cursor in 3D. The bottom half sits one layer higher, burying about 5% of the image bottom to look like it is emerging from within the card.
            </p>
          </div>

          <PresentationPopOutCard
            imageSrc="/images/popout-camera-sample.png"
            imageAlt="Triple Cameras to capture more details"
            badge="Optical Architecture"
            title="Triple Cameras to Capture More Details"
            description="Ultra Wide 5 MP, Wide 50 MP, Macro 2 MP and Front Camera 13 MP lenses designed with out-of-bounds emergence above the card boundary."
            faceMouse={true}
            maxTiltAngle={14}
            cardBackground="linear-gradient(155deg, #18181b 0%, #09090b 100%)"
            cardTextColor="#f4f4f5"
          >
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <span className="pres-badge" style={{ margin: 0, background: "rgba(212, 175, 55, 0.2)" }}>
                Faces Mouse 3D
              </span>
              <span className="pres-badge" style={{ margin: 0, background: "rgba(255, 255, 255, 0.1)", color: "#fff", borderColor: "rgba(255, 255, 255, 0.2)" }}>
                5% Buried Bottom Seam
              </span>
            </div>
          </PresentationPopOutCard>
        </section>
      </div>
    </PresentationDeck>
  );
}

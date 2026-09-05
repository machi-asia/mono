"use client";

import {
  ComponentShowcase,
  type ShowcasePropOption,
} from "@mono/components";
import {
  RoseChatModalProvider,
  RoseChatModal,
  RoseChatModalActionButton,
  RoseChatModalFloatingButton,
  RoseChat,
  RoseVoiceOverlay,
  UsageBar,
} from "@mono/rose";
import { MockAuthProvider } from "@mono/auth/mock";

const booleanOptions: ShowcasePropOption[] = [
  { label: "true", value: "true" },
  { label: "false", value: "false" },
];

const sizeOptions: ShowcasePropOption[] = [
  { label: "Small (sm)", value: "sm" },
  { label: "Medium (md)", value: "md" },
  { label: "Large (lg)", value: "lg" },
];

const tierOptions: ShowcasePropOption[] = [
  { label: "Authenticated User", value: "user" },
  { label: "Guest Tier", value: "guest" },
  { label: "Admin Tier", value: "admin" },
];

const emotionOptions: ShowcasePropOption[] = [
  { label: "Happy", value: "happy" },
  { label: "Bright", value: "bright" },
  { label: "Thinking", value: "thinking" },
  { label: "Researching", value: "researching" },
  { label: "Coding", value: "coding" },
  { label: "Surprised", value: "surprised" },
  { label: "Confused", value: "confused" },
  { label: "Sleeping", value: "sleeping" },
  { label: "Sad", value: "sad" },
];

export function RoseShowcase() {
  return (
    <MockAuthProvider state="signed-in">
      <ComponentShowcase
        packageName="mono/rose"
        description="Rose AI companion package exports. Features generalized intelligence, hands-free Voice Mode with speech-to-text and spoken synthesis, Google Gemini runner, web search, interactive option picker, long-term memory ('remember') system, personalization settings (custom instructions, nickname, tone), full memories management (view, add, edit, delete), Obsidian-flavored Markdown rendering, tiered message usage quotas, and chat modal overlays."
        components={[
          {
            name: "RoseChatModal",
            uses: 'import { RoseChatModalProvider, RoseChatModal, RoseChatModalActionButton } from "@mono/rose"',
            description:
              "Full modal overlay containing the Rose AI chat interface. Automatically closes with ESC or backdrop click and locks body scroll. Click the action button below to trigger the live modal.",
            render: () => (
              <RoseChatModalProvider>
                <div style={{ padding: "16px 0" }}>
                  <RoseChatModalActionButton label="Launch Rose Modal Demo" />
                  <RoseChatModal
                    title="Rose — AI Companion"
                    subtitle="Interactive Monorepo Agent"
                    showUsage={true}
                  />
                </div>
              </RoseChatModalProvider>
            ),
          },
          {
            name: "RoseChatModalActionButton",
            uses: 'import { RoseChatModalActionButton } from "@mono/rose"',
            description:
              "A button trigger that connects to the nearest RoseChatModalProvider to open the Rose chat modal. Supports custom labels and icons.",
            render: () => (
              <RoseChatModalProvider>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <RoseChatModalActionButton label="Chat with Rose" />
                  <RoseChatModalActionButton label="Ask AI Assistant" />
                  <RoseChatModal title="Rose AI" />
                </div>
              </RoseChatModalProvider>
            ),
          },
          {
            name: "RoseChatModalFloatingButton",
            uses: 'import { RoseChatModalFloatingButton } from "@mono/rose"',
            description:
              "A stylish floating action button (FAB) for triggering the Rose AI chat modal with optional notification badges. Demo rendered statically inline below.",
            render: () => (
              <RoseChatModalProvider>
                <div style={{ position: "relative", height: "80px", padding: "12px" }}>
                  <RoseChatModalFloatingButton
                    badgeText="AI"
                    className="demo-inline-fab"
                    ariaLabel="Open Rose AI"
                  />
                  <RoseChatModal title="Rose AI Companion" />
                </div>
              </RoseChatModalProvider>
            ),
          },
          {
            name: "RoseChat",
            uses: 'import { RoseChat } from "@mono/rose"',
            description:
              "Embedded Rose AI chat view featuring live Obsidian Markdown rendering (@mono/components), emotion avatars, interactive option buttons from askQuestion tool, command slash menu, and live message traces.",
            propControls: [
              {
                prop: "showUsage",
                label: "Show Usage Bar",
                options: booleanOptions,
                defaultValue: "true",
              },
            ],
            render: ({ showUsage }) => (
              <div style={{ height: "520px", border: "1px solid var(--color-border, #26262a)", borderRadius: "12px", overflow: "hidden" }}>
                <RoseChat
                  title="Rose Embedded View"
                  subtitle="General-purpose Assistant"
                  showUsage={showUsage === "true"}
                  initialMessage="### Hello from Rose! ✨\n\nI am your versatile AI assistant. I render rich markdown including callouts, code blocks, tables, and tags.\n\n> [!tip] Try It\n> Ask me a question or test commands!"
                />
              </div>
            ),
          },
          {
            name: "UsageBar",
            uses: 'import { UsageBar } from "@mono/rose"',
            description:
              "Visual quota and rate limit indicator for Rose AI messages, powered by the @mono/components Usage component. Automatically displays tier badges and progress thresholds.",
            propControls: [
              {
                prop: "size",
                label: "Size",
                options: sizeOptions,
                defaultValue: "sm",
              },
              {
                prop: "tier",
                label: "User Tier",
                options: tierOptions,
                defaultValue: "user",
              },
            ],
            render: ({ size, tier }) => {
              const mockUsage =
                tier === "admin"
                  ? {
                      allowed: true,
                      count: 0,
                      limit: Infinity,
                      week: "2026-W36",
                      dailyCount: 0,
                      dailyLimit: Infinity,
                      day: "2026-09-03",
                      remaining: Infinity,
                      role: "admin" as const,
                    }
                  : tier === "guest"
                  ? {
                      allowed: true,
                      count: 14,
                      limit: 50,
                      week: "2026-W36",
                      dailyCount: 7,
                      dailyLimit: 10,
                      day: "2026-09-03",
                      remaining: 3,
                      role: "guest" as const,
                    }
                  : {
                      allowed: true,
                      count: 42,
                      limit: 200,
                      week: "2026-W36",
                      dailyCount: 16,
                      dailyLimit: 20,
                      day: "2026-09-03",
                      remaining: 4,
                      role: "authenticated" as const,
                    };

              return (
                <div style={{ maxWidth: "480px" }}>
                  <UsageBar usage={mockUsage} size={size as any} />
                </div>
              );
            },
          },
          {
            name: "RoseVoiceOverlay",
            uses: 'import { RoseVoiceOverlay } from "@mono/rose"',
            description:
              "Immersive dimmed voice conversation overlay displaying a prominent picture of Rose, active emotion styling, ambient pulsating auras, dynamic audio waves, and live speech transcription.",
            propControls: [
              {
                prop: "emotion",
                label: "Rose Emotion",
                options: emotionOptions,
                defaultValue: "happy",
              },
              {
                prop: "isSpeaking",
                label: "Rose Speaking",
                options: booleanOptions,
                defaultValue: "false",
              },
              {
                prop: "isListening",
                label: "Mic Listening",
                options: booleanOptions,
                defaultValue: "true",
              },
            ],
            render: ({ emotion, isSpeaking, isListening }) => (
              <div style={{ position: "relative", height: "460px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--color-border, #26262a)" }}>
                <RoseVoiceOverlay
                  isOpen={true}
                  onClose={() => {}}
                  currentEmotion={emotion}
                  isSpeaking={isSpeaking === "true"}
                  isListening={isListening === "true"}
                  transcript={isSpeaking === "true" ? "I am glad to help you today!" : "Hello Rose, how are you?"}
                  autoSpeak={true}
                />
              </div>
            ),
          },
        ]}
      />
    </MockAuthProvider>
  );
}

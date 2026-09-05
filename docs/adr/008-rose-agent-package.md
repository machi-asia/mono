# ADR-008: Rose AI Agent Package and Chat Modal Integration

## Status

Accepted

## Date

2026-09-03

## Context

The Rose AI companion was previously implemented with site-specific portfolio tools and specialized delegates. To make Rose a reusable, general-purpose AI companion and assistant across the monorepo apps, Rose needs to be encapsulated in a dedicated library package (`@mono/rose`).

Furthermore, the agent system instructions need to be generalized, retaining only core, general-purpose tools (`webSearch` and `askQuestion` interactive option picker). Rose responses must render through the Obsidian-flavored `MarkdownRenderer` from `@mono/components`, support interactive choice buttons, display emotion states, provide chat modal components (`RoseChatModal`, triggers), and track tiered message quotas using `@mono/components`'s `Usage` component.

## Decision

1. **New Package `@mono/rose`**: Located under `packages/rose` with feature folders `src/agent`, `src/usage`, and `src/chat-modal`.
2. **Generalized System Instructions**: Rose is instructed as a versatile general-purpose AI assistant. It is provided a comprehensive list of Obsidian-compatible Markdown formatting rules (callouts, code blocks, tables, wikilinks, tags, task lists, highlights, and footnotes) which it must strictly employ.
3. **General-Purpose Tools**: Removed portfolio/specialist tools and kept:
   - `webSearch`: Live web lookup with SerpAPI or Gemini Search fallback.
   - `askQuestion`: Interactive option picker returning structured payloads rendered as clickable button choices.
4. **Chat Modal UI**:
   - `RoseChatModalProvider` & `useRoseChatModal`: Context state management.
   - `RoseChatModal`: Accessible full modal overlay with ESC key handling and scroll locking.
   - `RoseChatModalActionButton` & `RoseChatModalFloatingButton`: Action and FAB triggers.
   - `RoseChat`: Embedded and modal chat UI using `@mono/components` `MarkdownRenderer`, emotion avatars, and trace indicators.
5. **Tiered Usage Tracking with `@mono/components`**:
   - Role quotas (`admin` unlimited, `authenticated` 20/day 200/week, `guest` 10/day 50/week).
   - Integrated `UsageBar` component leveraging `@mono/components` `Usage` progress bars.
6. **Documentation and Showcase**: Live interactive showcase added to `apps/docs/src/app/components/rose/page.tsx`.

## Consequences

- Any app in the monorepo can easily embed or modalize Rose AI by importing `RoseChatModal`, `RoseChatModalActionButton`, or `RoseChat`.
- Chat responses consistently leverage rich Obsidian-flavored callouts, code syntax, and interactive option buttons.
- Tiered quotas are transparently displayed to users using standard design system progress bars.

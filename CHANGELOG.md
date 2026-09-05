# Changelog

All notable changes to this monorepo will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.17.2] - 2026-09-05

### Changed

- Enforced a 500-line limit across all codebase files for cleanliness and maintainability:
  - Added Rule 18 in `AGENTS.md` and updated `DESIGN.md` and `CONTRIBUTING.md` requiring all single code, style, and test files to remain strictly under 500 lines.
  - Decomposed `packages/auth/src/account-settings/account-settings.tsx` (557 lines -> 198 lines) by extracting `mfa-section.tsx` (222 lines) and `providers-section.tsx` (110 lines).
  - Decomposed `packages/components/src/markdown/markdown.tsx` (690 lines -> 304 lines) by extracting `markdown-inline.tsx` (189 lines), `markdown-callout.tsx` (124 lines), and `markdown-code-block.tsx` (44 lines).
  - Decomposed `packages/components/src/medialibrary/medialibrary.tsx` (655 lines -> 395 lines) by extracting `media-modal.tsx` (196 lines), `media-utils.tsx` (82 lines), and `media-types.ts` (24 lines).
  - Decomposed `packages/components/src/medialibrary/medialibrary.css` (647 lines -> 312 lines) by extracting `media-modal.css` (254 lines) and importing it at the top of `medialibrary.css`.

## [0.17.1] - 2026-09-05

### Changed

- Aligned voice recognition with `smarter-home` architecture:
  - Uses native browser `SpeechRecognition` with `interimResults: true` by default for real-time live subtitle transcription as words are spoken.
  - Added periodic live interim transcription to `createClientWhisperRecorder` so partial subtitles display live on screen while speaking before natural silence auto-submits.
  - Added live pulsating streaming dot indicator and active "Listening to you speak…" placeholder during speech detection.
  - Automatically finalizes and sends the prompt upon natural silence/pause without needing manual button taps.
  - Removed the pause button and keep the microphone continuously unpaused and listening while Voice Mode is open.
- Added real-time microphone loudness wave visualization to `<RoseVoiceOverlay />` in `@mono/rose`:
  - Utilizes Web Audio API `AudioContext` + `AnalyserNode` to compute live RMS amplitude from user's mic stream.
  - Dynamically scales multiple concentric glowing wave rings around Rose's avatar and drives equalizer bars in sync with speaking volume.
  - Updates overlay status title to "Hearing you speak…" upon voice detection to give clear visual feedback that microphone is active and catching speech.
- Auth sign-in errors (email/password, Google, GitHub, guest) now surface as dismissable toasts instead of an inline red paragraph in the sign-in modal.
- `AuthProvider` mounts `ToastProvider` internally so all auth components have toast access without extra wiring.
- `MockAuthProvider` also wraps with `ToastProvider` so docs showcase demos continue working.
- Added `@mono/components` as a dependency of `@mono/auth`.
- Added `ToastProvider` to all three app root layouts (`machi-asia`, `rose`, `docs`) so page-level code can call `useToast()` directly.
- Added `suppressHydrationWarning` to `<html>` in `machi-asia` and `rose` layouts (mirrors the fix applied to `docs` in 0.17.0).

## [0.17.0] - 2026-09-04

### Changed

- Added hands-free Voice Mode to Rose AI companion (`@mono/rose`):
  - Placed Voice Mode toggle button directly next to the Submit button in the chat input bar with active pulse states and tooltips.
  - Built `<RoseVoiceOverlay />` with dimmed screen backdrop blur, large picture of Rose reflecting her active emotion, glowing aura pulses, dynamic audio wave equalizer bars, and live subtitle transcription.
  - Integrated zero-token Web Speech API service (`cleanTextForSpeech`, `speakText`, `createSpeechRecognition`) and custom hook `useVoiceChat`.
  - Added speech-to-text integration with `faster-whisper-ts`:
    - Created Next.js server route `/api/rose/transcribe` calling `handleRoseTranscribe()` in `@mono/rose/server` with dynamic `WhisperModel` loading and configurable model paths.
    - Implemented `createFasterWhisperRecorder()` and `transcribeAudioBlob()` to record user microphone audio and submit multipart/form-data for transcription.
    - Added transparent client fallback to browser `SpeechRecognition` if CTranslate2 native binaries or model weights are missing in the runtime.
  - Automatically cleans markdown formatting, Obsidian callouts, code blocks, wikilinks, and emotion tags prior to spoken playback.
  - Prioritizes gentle female English voices for Rose with warm pitch/rate tuning.
  - Supports continuous conversational dialogue loop: speech recognition automatically resumes after Rose finishes speaking her response.
  - Added ADR-011 and live interactive showcase demo in `apps/docs`.
- Enforced strict use of `@mono/components` across all apps and packages in system documentation (`AGENTS.md`, `DESIGN.md`, `CONTRIBUTING.md`):
  - Updated `AGENTS.md` Rule 13, `DESIGN.md` Component Rules, and `CONTRIBUTING.md` Package Rules to mandate building UI with `@mono/components` (`Button`, `Card`, `Row`, `Col`, `Tooltip`, etc.) and explicitly forbid hand-rolling raw buttons or custom card divs.
  - Refactored `RoseSettingsModal` and `RoseChat` in `@mono/rose` to replace raw `<button>`, form cards, and container elements with `<Button>` and `<Card>` from `@mono/components`.
- Added Settings modal, Personalization, and Memories management for Rose AI agent:
  - Added Settings trigger button under the conversations list in Rose's sidebar.
  - Built `<RoseSettingsModal />` with Personalization tab (nickname, tone selection, persistent custom instructions, and help tooltips) and Memories tab (view, add, edit, delete memories with tags and importance badges).
  - Created `rose_personalization` table in `@mono/database` and migration `20260904000001_rose_personalization.sql` with user-isolated RLS policies.
  - Added `updateMemory`, `deleteMemory`, `getPersonalization`, `savePersonalization` helpers in `@mono/database`.
  - Injected both user personalization and active memories into system prompt context across all conversations and prompts.
  - Added `ADR-010: Rose Settings - Personalization and Memories Management`.
- Added long-term memory system for Rose AI agent (`rememberTool` in `@mono/rose` and persistence in `@mono/database`):
  - Created `rose_memories` Supabase database table following Postgres best practices (64-bit identity primary key, `timestamptz`, cached `(select auth.uid())` RLS policies, and composite `(user_id, created_at desc)` index).
  - Added server-side data access helpers `saveMemory` and `listMemories` in `@mono/database`.
  - Added `rememberTool` to `@mono/rose` supporting structured recording of facts, preferences, and instructions with scoped user context and guest/test in-memory fallback.
    - Automatically loads and injects the 10 most recent user memories into Rose's conversation context on chat turn startup.
    - Fixed `rememberTool` server database persistence by passing the active server database client into `setRememberToolContext` and prioritizing `SUPABASE_SECRET_KEY` on the backend for reliable server execution.
    - Integrated `rememberTool` executions with Langfuse server-side span tracing.
  - Added migration `packages/database/migrations/20260904000000_rose_memories.sql` and `docs/adr/009-long-term-memory-system.md`.
- Reintroduced `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` specifically for browser client initialization (`AuthProvider` and browser Supabase client via `@supabase/ssr`).
- Added `SUPABASE_SECRET_KEY` on the server to handle privileged backend and database operations securely.
- Enforced strict server-only execution for all database operations: direct database querying and mutations from client components are forbidden. All database and storage operations occur via server components, route handlers, or server utilities (`@mono/database/server`).
- Updated `AGENTS.md` (Rules 4, 7, and 17), `SECURITY.md`, `DESIGN.md`, and `docs/ARCHITECTURE.md` to establish the clear separation between browser authentication keys, server database secret keys, and server-only database operations.
- Integrated Groq for tool output processing in `@mono/rose`: Google Gemini acts as the main conversational agent and tool caller; after tools execute, their output is structured as JSON and processed via Groq (`callGroq` / `callGroqStream`) to synthesize the final response into rich Obsidian Markdown.
- Added Langfuse observability and tracing to `@mono/rose`: server-side tracing with `RoseLangfuseTrace` captures user sessions, turns, Gemini orchestrator generations, tool spans with structured JSON outputs, Groq synthesis generations, latency, and emotion tags. Runs gracefully and non-blockingly when keys are absent.
- Hardened agent response pipeline with defensive tool call extraction (`extractToolCallsFromText`): catches tool calls emitted in output text (such as `webSearch`, `askQuestion`, or custom actions in JSON format or code fences), automatically executes them on the server, feeds the results back into the agent pipeline for synthesis, cleanly strips raw JSON blocks from the chat output, and parses interactive option buttons into `optionsPayload`.
- Added `GROQ_API_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_PUBLIC_KEY` (Non-Config) and `GROQ_MODEL`, `LANGFUSE_BASEURL` (Config) to `.env.sample` and `.env.local` files with automatic fallback to Gemini synthesis when Groq keys are not present.

## [0.16.0] - 2026-09-03

### Added

- Added `variant="help"` to `@mono/components` `Tooltip` component featuring a built-in accessible circular `?` button trigger and styled multi-line help box.
- Added Rule 16 to `AGENTS.md` and updated `DESIGN.md` requiring the use of `<Tooltip variant="help">` on any complex or otherwise vague UI features, metrics, or settings.
- Integrated the circular `?` help Tooltip beside Rose's Usage Tier pill displaying all tiers (Guest, User, Admin) and daily/weekly quotas.
- Expanded the Rose chat modal to 90% screen width/height and fixed details accordion scrolling and clipping.

## [0.15.0] - 2026-09-03

### Added

- Added new package **`@mono/rose`** (`packages/rose`) providing a generalized AI companion and assistant with Google Gemini integration.
- General AI agent runner with comprehensive Obsidian Markdown formatting instructions (callouts, tables, code blocks, wikilinks, tags, task lists, and footnotes).
- General-purpose agent tools: `webSearch` (live real-time web query engine) and `askQuestion` (interactive option picker).
- Chat modal features: `RoseChatModalProvider`, `useRoseChatModal`, `RoseChatModal`, `RoseChatModalActionButton`, `RoseChatModalFloatingButton`, and `RoseChat` with `@mono/components` `MarkdownRenderer` and interactive choice buttons.
- Tiered usage quotas integration with `UsageBar` component leveraging `@mono/components` `Usage` progress bars (`sm`, `md`, `lg` sizes, tier badges).
- Added `ADR-008: Rose AI Agent Package and Chat Modal Integration`.
- Added live interactive showcase page at `apps/docs/src/app/components/rose/page.tsx`.
- Added comprehensive unit test suites in `packages/rose` across agent runner, emotion extraction, tools, command registry, usage, and chat modal UI.

## [0.14.0] - 2026-09-03

### Added

- Added new `@mono/components` **Usage** component for tracking resource usage and quota metrics with color-coded progress bar thresholds (normal gold, warning amber, danger red, exceeded animated pulse), formatted numbers, percentage display, and multiple sizes (`sm`, `md`, `lg`).
- Added 7 unit tests in `packages/components/src/usage/usage.test.tsx` verifying thresholds, formatting, and aria progressbar accessibility.
- Added live interactive showcase entry in `apps/docs` with `level` and `size` prop controls.

## [0.13.0] - 2026-09-03

### Added

- Added new `@mono/components` **MarkdownRenderer** component with authentic Obsidian-flavored markdown rendering and styling.
- Supported Obsidian callouts / admonitions (`> [!note]`, `> [!tip]`, `> [!warning]`, `> [!danger]`, `> [!example]`, `> [!todo]`, `> [!success]`, `> [!abstract]`, `> [!question]`) with foldable syntax (`+` / `-`), custom titles, Lucide icons, and theme colors.
- Supported Obsidian wikilinks (`[[Note]]` and `[[Note|Alias]]`) with `onWikilinkClick` callback.
- Supported Obsidian taxonomy tags (`#tag` and `#tag/subtag`) with pill badges and `onTagClick` callback.
- Supported interactive task checkboxes (`- [ ]` and `- [x]`) with `onTaskToggle` event.
- Supported Obsidian highlight marks (`==highlight==`) and strikethrough (`~~deleted~~`).
- Supported fenced code blocks with language labels and one-click copy to clipboard.
- Supported GFM tables and footnotes (`[^1]`).
- Added `ADR-007: Obsidian-Flavored Markdown Renderer`.
- Added interactive demo with sample note presets on the docs showcase page.

## [0.12.0] - 2026-09-03

### Added

- Connected `@mono/components` **MediaLibrary** to database and storage with private user isolation (`media/users/{userId}/...` paths and `media_files` table support).
- Added multi-format file uploads supporting images (`image/*`), PDF (`.pdf`), and Microsoft Word (`.docx`) with dedicated file-type filters (`All`, `Images`, `PDFs`, `DOCX`).
- Added an item inspection modal showing file preview (image preview or document type card), metadata (file name, type, size, upload date), and the public bucket URL with a quick-copy button.
- Added file deletion capability with confirmation step in the inspection modal.
- Added pagination controls with current item count, current page indicators, and Prev/Next page navigation.
- Installed and integrated `lucide-react` in `@mono/components` for modern UI icons (`ImageIcon`, `FileText`, `FileSpreadsheet`, `Upload`, `Copy`, `Check`, `Trash2`, `ChevronLeft`, `ChevronRight`, `X`, `ExternalLink`).
- Added `ADR-006: Database-Connected Media Library with User Isolation`.
- Updated docs showcase demo with choice/enum prop controls (`initialFilter`, `pageSize`) and live interactive preview.

## [0.11.1] - 2026-09-03

### Changed

- Updated `AGENTS.md` and `CONTRIBUTING.md` workflow guidelines: `latest.commit.txt` must always be generated by checking `git status`, `git diff`, and all untracked/uncommitted changes across the entire repository so all modified packages and apps are captured in the commit summary rather than only the last isolated edit.

## [0.11.0] - 2026-09-03

### Added

- Added the primary brand logo for all sites to a shared `assets/branding/` folder (`logo.svg` + `logo.png`), the single reusable source of truth for the monorepo.
- Set the logo as the browser favicon on every app by placing `src/app/icon.png` in `apps/docs`, `apps/rose`, and `apps/machi-asia` (Next.js App Router icon file convention serves it automatically as `/icon.png`).

## [0.10.0] - 2026-09-03

### Added

- `@mono/components` **TimePicker** was rebuilt as three aligned editable comboboxes (hour, minute, and AM/PM) with matching labels and control heights. Each field is a click-to-open dropdown *and* a typeable input: pick a value from the list (hours 0-23 or 1-12, minutes in 5-min steps, AM/PM) or type one directly; invalid typed input is ignored and reverts on blur. AM/PM is a compact two-button toggle. No separate monolithic input remains, and the label/box/separator are vertically aligned.
- `@mono/components` **DatePicker** now includes a text input so the date can be typed directly (`YYYY-MM-DD`). Valid typed dates update the calendar view and fire `onChange`; invalid input is ignored and resets to the current value on blur.

## [0.9.5] - 2026-09-03

### Added

- Set `outputFileTracingRoot` to the workspace root in `apps/docs`, `apps/rose`, and `apps/machi-asia` Next configs to silence Next.js's warning that the workspace directory is outside the Git repository during `next dev`/`next build`.

## [0.9.4] - 2026-09-03

### Changed

- `@mono/components` **ThemeProvider** now defaults `enableSystem` to `false` so the app always loads in **dark mode** per the design system, instead of being overridden by the OS light preference. System/dark/light switching remains available via explicit props.
- `@mono/components` **Accordion**: content no longer snaps into existence — the panel stays mounted and expands via a CSS grid `0fr → 1fr` transition (real content height, no hardcoded cap), so the box and contents grow together smoothly at `--duration-base` (260ms).

## [0.9.2] - 2026-09-03

### Fixed

- `@mono/components` **Dropdown**, **Popup**, and **Navbar** auth menu were snapping open instead of animating: their enter animation (CSS keyframes on a freshly-mounted element) did not reliably replay. Reworked `useMotionMount` so it mounts the element and flips an `entered` class on the next double `requestAnimationFrame`, driving a GPU-composited `opacity`/`transform` transition that replays smoothly on every open and exit.

## [0.9.1] - 2026-09-03

### Fixed

- `@mono/components` **Dropdown**: menu enter animation now uses `--duration-base` (260ms) instead of the snappier 150ms, and the menu is keyed by an open-count so the enter animation reliably restarts on every reopen (previously the second open appeared instant/non-smooth because the finished animation didn't replay).
- `@mono/components` **Popup** and **Navbar** auth menu: keyed by an open-count so the enter animation restarts on each open.

## [0.9.0] - 2026-09-03

### Added

- `@mono/components` internal `useMotionMount` hook (`src/motion/motion.ts`) that keeps an element mounted briefly during its exit animation, enabling smooth enter + exit transitions for conditionally-rendered overlays.

### Changed

- `@mono/components` **Dropdown**: menu now animates in and out with a fade + vertical scale (transform-origin top), using the design duration/easing tokens.
- `@mono/components` **Popup**: content animates in/out with fade + slide + scale, per-position variants (top/bottom/left/right) for both enter and exit.
- `@mono/components` **Accordion**: content animates in with fade + slide + expand; icon now animates a 45° rotation when open instead of swapping `+`/`−` glyphs.
- `@mono/components` **Navbar**: auth dropdown menu now animates in/out with fade + scale (transform-origin top right).

## [0.8.1] - 2026-09-03

### Changed

- Docs app navbar link labels no longer carry the `@mono/` package prefix (`Auth`, `Components`, `Database`).

### Added

- `@mono/auth` new `GoogleIcon` and `GithubIcon` React components (feature folder `src/icons/`), derived from the `public/icons/*.svg` assets and exported from `@mono/auth`.
- `@mono/auth` GitHub OAuth sign-in: new `signInWithGithub` on `AuthContextValue`/`AuthProvider`/mock, plus a "Continue with GitHub" button in the sign-in modal.

### Changed

- Sign-in modal provider buttons now render their provider logo (Google/GitHub) with a flex icon+label layout.
- Account Settings "Linked Providers" section now shows the Google/GitHub logo next to each provider name.

## [0.8.0] - 2026-09-03

### Added

- `@mono/auth` **Account Settings modal** (`src/account-settings/`): sidebar with a Security tab (future tabs reserved), and four security subsections — **Change Password** (new password + confirm, via `supabase.auth.updateUser`), **Passkeys** (experimental, WebAuthn detection, `signInWithPasskey`), **Linked Providers** (list/link/unlink OAuth identities via `linkIdentity`/`unlinkIdentity` with redirect flow), and **Multi-Factor Authentication** (list TOTP/WebAuthn factors, enroll TOTP with QR code + manual key + 6-digit verify, unenroll).
- `@mono/auth` package: new `./account-settings` sub-path export; exported `AccountSettings` from `@mono/auth`.
- `@mono/components` Navbar: new `NavbarAuthMenuItem` interface and `menuItems` prop on `NavbarAuth` for generic dropdown items before Sign out.
- Docs app: "Account settings" menu item wired into the Navbar auth dropdown, rendering the new `AccountSettings` modal.

## [0.7.0] - 2026-09-03

### Changed

- Enforced the **canonical Supabase project** (`https://zyatzdkapdqngwyhiqqn.supabase.co`) as the single target for all database edits. Documented and enforced in `AGENTS.md` (rule 15), `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/adr/003-centralized-auth-and-database.md`, and `README.md`. All migrations, DDL, edge functions, and data changes must target this project; `NEXT_PUBLIC_SUPABASE_URL` must resolve here and any mismatched target must be corrected before applying changes.

## [0.6.1] - 2026-09-03

### Added

- New package convention (AGENTS.md rule 14): every exported component is organized by a feature folder within each package's `src/` — its `.tsx`, `.css`, subcomponents, hooks, helper types, and tests all live together under a feature-named folder (e.g. `src/showcase/showcase.tsx`, `src/showcase/showcase.css`). `src/index.ts` only re-exports from these feature folders.

## [0.6.0] - 2026-09-02

### Added

- `@mono/components` design system: token-based colors and spacing/easing as CSS custom properties (`src/tokens.css`), with **dark mode primary and gold accents** and a light variant derived from the same tokens.
- `@mono/components` `ThemeProvider` (wraps `next-themes`) for SSR-safe theme switching with `class` attribute, system-preference support, and dark default.
- `@mono/components` layout primitives: `Row`, `Col`, `Card` (`src/layout.tsx` + `layout.css`), consumed strictly from the package.
- New exports in `@mono/components` index (`ThemeProvider`, `Row`, `Col`, `Card` + props types) and `next-themes` dependency.
- Tests for `Row`/`Col`/`Card` (grid math, variants) and `ThemeProvider` (defaults, children).
- Live interactive showcase entries for `ThemeProvider`, `Row`, `Col`, `Card` (with prop dropdowns) in `apps/docs/src/app/components/components/`; docs app now depends on `next-themes`.
- Design-system conventions documented: `DESIGN.md` (Color & Theme, Motion, Spacing & Minimal Clutter, Component Rules, Content Density), `AGENTS.md` (rule 13), `CONTRIBUTING.md`, `README.md`, `docs/ARCHITECTURE.md`, and `docs/adr/005-design-system-theming.md`.

## [0.5.0] - 2026-09-02

### Added

- `ComponentShowcase` (in `@mono/components`) now renders **live interactive demos** with a **dropdown for every prop**:
  - New `ShowcaseItemPropControl` (`{ prop, label?, options, defaultValue? }`) and a `render(values)` API replacing the old static `demo` node. `ComponentShowcase` renders a `<select>` per control and re-invokes `render` with the selected values.
  - Backward-incompatible: `ShowcaseItem.demo` removed in favor of `render` + `propControls`; every showcase entry updated accordingly.
- `@mono/auth` `MockAuthProvider` (`@mono/auth/mock`) — a controlled auth-provider stand-in whose `state` prop (loading / signed-out / guest / signed-in) drives `AuthProvider`'s context for live demos; `AuthContext` is now exported for reuse.
- Docs showcase pages now render components live:
  - `apps/docs/src/app/components/auth/page.tsx` — live `AuthProvider`, `AuthGate`, `SignInModal` demos against `MockAuthProvider` with a mock auth-state dropdown (new `auth-showcase.tsx` + `auth-demo.css`).
  - `apps/docs/src/app/components/components/page.tsx` — live `ComponentShowcase` demo with a `packageName` dropdown (new `components-showcase.tsx`).
- `docs/adr/004-component-showcase-pages.md` updated, and the rule enforced in markdowns on every component create/update: `AGENTS.md` (rule 12), `CONTRIBUTING.md`, `DESIGN.md`, `README.md`, `docs/ARCHITECTURE.md` — every exported component must render live via `render(values)` with a `propControls` dropdown for every choice/enum prop.
- Tests: `ComponentShowcase` dropdown rendering + live re-render; `MockAuthProvider` driving `AuthGate`/`SignInModal`.

## [0.4.0] - 2026-09-02

### Added

- `@mono/components` `ComponentShowcase` — the shared reusable **list-view layout** that every package's component showcase page uses. Accepts a `packageName`, `description`, and a list of exported components (`name`, `uses`, `description`, optional `demo`).
- Showcase pages in the `apps/docs` app, one per package, listing all exported components via `ComponentShowcase`:
  - `apps/docs/src/app/components/auth/page.tsx` — `@mono/auth` (`AuthProvider`, `AuthGate`, `SignInModal`).
  - `apps/docs/src/app/components/components/page.tsx` — `@mono/components` (`ComponentShowcase`).
  - `apps/docs/src/app/components/database/page.tsx` — `@mono/database` (no UI components currently exported).
- Docs home page lists links to each package showcase.
- ADR-004: Component Showcase Pages.
- Convention enforced in markdowns: `AGENTS.md` (rule 12), `CONTRIBUTING.md`, `DESIGN.md`, `README.md`, `docs/ARCHITECTURE.md` — every package's exported components must be listed on its showcase page using `ComponentShowcase`.

## [0.3.0] - 2026-09-02

### Added

- `@mono/auth` `AuthGate` — client gate that renders the sign-in modal until a session exists.
- `@mono/auth` `SignInModal` — sign-in dialog with **no exit/cancel controls**: Google OAuth, email/password sign-in or register, and **Continue as Guest** (Supabase anonymous).
- `signInWithGoogle` auth method on `AuthProvider`.
- Guest detection corrected to use Supabase `user.is_anonymous`.
- `AuthProvider` + `AuthGate` wired into every app root layout (`machi-asia`, `rose`, `docs`) — no signed-out user can access any page.
- Real Supabase credentials placed in each app's `.env.local`.
- `@mono/auth` now includes `vitest` + `stylelint` tooling and tests for `AuthGate`.
- Docs app page documenting the auth components.
- `scripts/check-env.js` placeholder detection made precise (no longer flags URLs containing `xxx` as placeholders).

### Changed

- ADR-003 and `docs/ARCHITECTURE.md` updated for the mandatory `AuthProvider` + `AuthGate` requirement.
- `AGENTS.md` updated to require `AuthProvider` + `AuthGate` and describe the sign-in options.

### Fixed

- `@mono/auth`, `@mono/database`, and `@mono/components` now resolve from `src` TypeScript instead of a pre-built `dist`. Previously `next dev` could fail with `Module not found: Can't resolve '...dist/provider.js'` or `Can't resolve './auth-gate.css'` (the `tsc` build emitted JS that referenced a CSS file it never copied to `dist`, and stale `.next`/`dist` caches pointed Next at the broken output). No build step is required to consume the packages in the apps; stale `dist` and `.next` caches were removed.

## [0.2.0] - 2026-09-02

### Added

- Dev tooling for every app: `eslint`, `stylelint`, `typecheck`, `vitest`.
- Global `npm run test` runs all quality checks in parallel via Turborepo.
- Environment verification: `npm run env` compares `.env.local` against `.env.sample`.
- `.env.sample` files declaring Supabase env keys for all apps.
- `scripts/check-env.js` — script-based env check that never exposes secret values.

### Changed

- `npm run dev` at the repo root runs all apps and packages.
- Convention docs now require every env key to be declared in `.env.sample`.

## [0.1.0] - 2026-09-01

### Added

- Monorepo scaffolding with Turborepo.
- Next.js apps with placeholder pages: `machi-asia`, `rose`, `docs`.
- `apps/machi-asia` — Showcase and subscription billing hub.
- `apps/rose` — Custom AI agent application.
- `apps/docs` — Documentation site for components and user manuals.
- `packages/auth` — Centralized authentication package with Supabase Auth.
  - `AuthProvider` — Required by every app. Supports guest and authenticated users.
  - `useAuth` hook — Client-side auth state and methods.
  - Server client factory for Server Components and Route Handlers.
  - Middleware helper for route protection.
- `packages/database` — Centralized data/store package with Supabase.
  - Client and server client factories.
  - TypeScript database types.
- `packages/components` — Shared UI component library.
- Supabase integration: `@supabase/ssr`, `@supabase/supabase-js`.
- Documentation: `README.md`, `CONTRIBUTING.md`, `DESIGN.md`, `SECURITY.md`, `AGENTS.md`.
- Architecture docs: `docs/ARCHITECTURE.md`, `docs/API.md`.
- Architecture Decision Records: `docs/adr/`.
- `CHANGELOG.md` initialization.

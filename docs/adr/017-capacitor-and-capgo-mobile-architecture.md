# ADR-017: Capacitor and Capgo Multi-Platform Mobile Architecture

## Status
**Accepted** (2026-10-07)

## Context
All client-facing applications in the Machi Asia ecosystem (`calculator`, `docs`, `hells-forge`, `machi-asia`, `rose`) require unified distribution across both modern Web browsers and Android mobile platforms (Google Play Store). Furthermore, native mobile releases demand immediate bug-fix and content propagation without waiting for manual app store review cycles.

## Decision
1. **Capacitor Hybrid Shell**: Adopt `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android` across all client apps to package Next.js static export bundles (`out/`) into native Android Gradle applications.
2. **Standardized Application IDs**: Use `asia.machi.<appname>` for Google Play Store package identifiers.
3. **Capgo Over-The-Air (OTA) Updates**: Integrate `@capgo/capacitor-updater` with automated background update checks, channel distribution (`production`), and seamless asset swapping.
4. **Real-Time OTA Progress Notification**: Embed `<OtaUpdateNotifier />` from `@mono/components` in the root layout of every client app. The component renders a sleek glassmorphism progress pill at the top of the viewport during active live updates, automatically dismissing upon completion.
5. **Dual-Mode Build Strategy**: Enable static export conditionally via `STATIC_EXPORT=true next build` (`npm run build:mobile`), generating `out/` for Capacitor sync while preserving standard dynamic builds for web.

## Consequences
- Single codebase powers responsive web and Android native app store builds.
- Instant OTA hot updates via Capgo Cloud bypass app store review latency for web asset updates.
- Transparent user feedback via `<OtaUpdateNotifier />` with zero desktop browser overhead.

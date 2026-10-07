# ADR-017: Capacitor & OtaKit Mobile Architecture (Web + Android)

## Status
**Accepted** (2026-10-07)

## Context
All client applications in the Machi Asia ecosystem (`calculator`, `docs`, `hells-forge`, `machi-asia`, `rose`) require dual distribution on both Web browsers and Android mobile platforms via Google Play Store, supported by instant over-the-air (OTA) updates.

## Decision
1. **Capacitor Hybrid Bridge**: Integrate `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android` across all client-facing applications.
2. **Standardized Package IDs**: Standardize on `asia.machi.<appname>` for Google Play Store application identifiers.
3. **OtaKit OTA Live Updates**: Implement `@otakit/capacitor-updater` with automated channel checks on application launch and resume.
4. **Top OTA Progress Popup**: Provide `<OtaUpdateNotifier />` in `@mono/components` and mount it in the root `layout.tsx` of every client app. The popup floats at the top during downloads, displays real-time percent completion, and automatically dismisses once the update is installed.
5. **Dual-Mode Build**: Use `npm run build:mobile` (`STATIC_EXPORT=true next build`) to generate static `out/` directories for Capacitor sync.
6. **Automated CI/CD**: Upload and release OTA bundles to OtaKit via `.github/workflows/otakit-ota.yml` and `npm run deploy:ota`.

## Consequences
- Cross-platform parity across Web and Android from a single shared codebase.
- Hot OTA updates deployed instantly via OtaKit without app store review delays.
- Clean visual progress indicators for users during live updates.

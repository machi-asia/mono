export { createClient } from "./client";
export { AuthProvider, useAuth, useUserRole } from "./components/provider/provider";
export { AuthGate } from "./components/auth-gate/auth-gate";
export { SignInModal } from "./components/sign-in-modal/sign-in-modal";
export { AccountSettings, type TopLevelTab } from "./components/account-settings/account-settings";
export { ProfileSection } from "./components/account-settings/profile-section";
export { UsageSection } from "./components/account-settings/usage-section";
export { DataPrivacyModal } from "./components/account-settings/data-privacy-modal";
export { PrivacySection } from "./components/account-settings/privacy-section";
export { SupportModal } from "./components/account-settings/support-modal";
export { SupportSection } from "./components/account-settings/support-section";
export {
  UsageProvider,
  UsageContext,
  useUsage,
  buildMetricState,
  type UsageProviderProps,
  type UsageContextValue,
  type UsageMetricState,
  type UseUsageOptions,
  type UseUsageReturn,
} from "./components/usage/usage-provider";
export {
  UsageTracker,
  type UsageTrackerProps,
} from "./components/usage/usage-tracker";
export {
  UsageGate,
  type UsageGateProps,
  type UsageGateMode,
} from "./components/usage/usage-gate";
export {
  MonoAppShell,
  type MonoAppShellProps,
} from "./components/app-shell/app-shell";
export {
  AuthNavbar,
  type AuthNavbarProps,
  type AuthNavbarMenuItem,
} from "./components/auth-navbar/auth-navbar";
export {
  useApiClient,
  type UseApiClientOptions,
} from "./components/use-api-client";
export {
  getUserDisplayName,
  getUserAvatarUrl,
  getUserInitials,
  getUserProfileInfo,
  type UserProfileInfo,
} from "./utils/user-profile";
export {
  PRIVACY_DISCLOSURES_REGISTRY,
  registerPrivacyDisclosure,
  listPrivacyDisclosures,
  resolvePrivacyStorageKey,
  getPrivacyConsent,
  setPrivacyConsent,
  usePrivacyConsent,
  type AppDataDisclosure,
} from "./utils/privacy-registry";
export { GoogleIcon } from "./components/icons/google";
export { GithubIcon } from "./components/icons/github";
export { getAuthRedirectUrl } from "./utils/redirect";
export type { AuthContextValue, AuthState, SavedAccount, UserRole } from "./types";

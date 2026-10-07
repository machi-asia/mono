"use client";

import {
  useEffect,
  useState,
  useMemo,
  useSyncExternalStore,
  useTransition,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  constructRelayUrl,
  generateMobileAppUrls,
  type AppMetadata,
} from "../../lib/redirect-resolver";
import {
  Calculator,
  BookOpen,
  Flame,
  Globe,
  Bot,
  ExternalLink,
  Smartphone,
  Globe2,
} from "lucide-react";
import "./redirect.css";

const APP_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  calculator: Calculator,
  docs: BookOpen,
  "hells-forge": Flame,
  portal: Globe,
  rose: Bot,
};

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "";
  const isMobileUA = /android|iphone|ipad|ipod|windows phone|mobile/i.test(ua);
  const isTouch = navigator.maxTouchPoints > 0;
  return isMobileUA || (isTouch && window.innerWidth <= 768);
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot(): boolean {
  return isMobileDevice();
}

function getServerSnapshot(): boolean {
  return false;
}

function RedirectContent() {
  const searchParams = useSearchParams();
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [, startTransition] = useTransition();

  const { targetUrl, app, mobileUrls } = useMemo(() => {
    const returnTo = searchParams.get("returnTo");
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const { targetUrl: resolvedTarget, app: resolvedApp } = constructRelayUrl(returnTo, searchParams, hash);
    const urls = generateMobileAppUrls(resolvedApp, resolvedTarget);
    return {
      targetUrl: resolvedTarget,
      app: resolvedApp,
      mobileUrls: urls,
    };
  }, [searchParams]);

  // Desktop: Immediate redirect
  useEffect(() => {
    if (!isMobile && targetUrl && typeof window !== "undefined") {
      window.location.replace(targetUrl);
    }
  }, [isMobile, targetUrl]);

  // 5-second countdown on mobile before auto-continuing to browser
  useEffect(() => {
    if (!isMobile || isPaused || countdown <= 0 || !targetUrl) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.replace(targetUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMobile, isPaused, countdown, targetUrl]);

  function handleOpenApp() {
    if (!mobileUrls) return;
    setIsPaused(true);

    // Try custom scheme first, fallback to Android intent or browser
    const start = Date.now();
    window.location.href = mobileUrls.customSchemeUrl;

    setTimeout(() => {
      // If still in the same tab after 1.5s, app might not be installed, attempt Android intent or browser fallback
      if (Date.now() - start < 2000 && targetUrl) {
        window.location.href = mobileUrls.androidIntentUrl;
      }
    }, 1200);
  }

  function handleContinueBrowser() {
    setIsPaused(true);
    if (targetUrl) {
      startTransition(() => {
        window.location.replace(targetUrl);
      });
    }
  }

  // Loading state during initial resolution
  if (isMobile === null || !app) {
    return (
      <div className="redirect-container">
        <div className="redirect-card">
          <div className="redirect-spinner" />
          <p className="redirect-desc">Verifying authentication & redirecting...</p>
        </div>
      </div>
    );
  }

  // Desktop immediate redirecting state
  if (!isMobile) {
    return (
      <div className="redirect-container">
        <div className="redirect-card">
          <div className="redirect-spinner" />
          <h1 className="redirect-title">Redirecting...</h1>
          <p className="redirect-desc">Returning you to {app.name}</p>
          <div className="redirect-destination">
            <ExternalLink size={12} />
            <span>{targetUrl}</span>
          </div>
        </div>
      </div>
    );
  }

  const AppIcon = APP_ICONS[app.id] || Globe;

  return (
    <div className="redirect-container">
      <div className="redirect-card">
        <div className="redirect-icon-wrap">
          <AppIcon size={32} />
        </div>

        <div className="redirect-header">
          <h1 className="redirect-title">Continue to {app.name}</h1>
          <p className="redirect-desc">How would you like to open this application?</p>
        </div>

        <div className="redirect-destination">
          <Globe2 size={12} />
          <span>{app.subdomain}</span>
        </div>

        <div className="redirect-actions">
          <button
            type="button"
            className="redirect-btn redirect-btn-primary"
            onClick={handleOpenApp}
          >
            <Smartphone size={18} />
            <span>Open in App</span>
          </button>

          <button
            type="button"
            className="redirect-btn redirect-btn-secondary"
            onClick={handleContinueBrowser}
          >
            <Globe2 size={18} />
            <span>Continue in Browser</span>
          </button>
        </div>

        {countdown > 0 && !isPaused && (
          <div className="redirect-timer">
            <span>Continuing in browser in {countdown}s...</span>
            <button
              type="button"
              className="redirect-timer-cancel"
              onClick={() => setIsPaused(true)}
            >
              Pause
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="redirect-container">
          <div className="redirect-card">
            <div className="redirect-spinner" />
            <p className="redirect-desc">Loading authentication redirect...</p>
          </div>
        </div>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}

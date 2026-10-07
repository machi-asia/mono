"use client";

import type { User } from "@supabase/supabase-js";
import { MediaLibrary } from "@mono/components";

interface MediaSectionProps {
  user: User;
}

export function MediaSection({ user }: MediaSectionProps) {
  const userRole = (user.app_metadata?.role || user.user_metadata?.role || (user.is_anonymous ? "guest" : "member")) as "guest" | "member" | "pro" | "admin";
  const role = userRole;

  return (
    <section className="auth-settings-section auth-media-section">
      <div className="auth-media-header-wrap">
        <div>
          <h2 className="auth-settings-section-title">Media Library</h2>
          <p className="auth-settings-section-desc">
            Your personal cloud media repository. Files uploaded here are privately isolated and can be used across any Machi Asia application.
          </p>
        </div>
      </div>

      <div className="auth-media-container">
        <MediaLibrary userId={user.id} connected={true} pageSize={8} role={role} />
      </div>
    </section>
  );
}

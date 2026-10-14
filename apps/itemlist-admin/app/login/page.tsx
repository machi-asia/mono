"use client";

import React, { useState } from "react";
import { getAdminSupabaseClient } from "../../lib/supabase";
import { ShieldCheck, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [sentMagicLink, setSentMagicLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMsg("");

    const supabase = getAdminSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // Enforce no new signups: only existing registered admin accounts can sign in
        shouldCreateUser: false,
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("signups not allowed") || error.message.toLowerCase().includes("user not found")) {
        setErrorMsg("Access denied. Registration is closed and this email is not authorized as an administrator.");
      } else {
        setErrorMsg(error.message);
      }
    } else {
      setSentMagicLink(true);
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    setOauthLoading(provider);
    setErrorMsg("");

    const supabase = getAdminSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/` : undefined,
      },
    });

    if (error) {
      setOauthLoading(null);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3 shadow-inner">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">ItemList Admin Portal</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sign in with an authorized administrator account to oversee issue reports and community overrides.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-700/60 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {sentMagicLink ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-center space-y-2">
            <h3 className="text-sm font-semibold text-emerald-300">Magic Link Dispatched</h3>
            <p className="text-xs text-zinc-300">
              A secure one-time login link has been sent to <span className="font-mono text-white">{email}</span>. Please click the link in your email to authenticate.
            </p>
            <button
              type="button"
              onClick={() => setSentMagicLink(false)}
              className="text-xs text-zinc-400 hover:text-white underline pt-2 block mx-auto cursor-pointer"
            >
              Back to sign in options
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleOAuth("github")}
                disabled={Boolean(oauthLoading) || loading}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-800/90 hover:bg-zinc-800 text-xs font-medium text-white border border-zinc-700/80 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {oauthLoading === "github" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="font-semibold">GitHub</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={Boolean(oauthLoading) || loading}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-800/90 hover:bg-zinc-800 text-xs font-medium text-white border border-zinc-700/80 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {oauthLoading === "google" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="font-semibold">Google</span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] uppercase font-mono text-zinc-500">Or Magic Link</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Email Magic Link Form */}
            <form onSubmit={handleMagicLink} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@itemlist.online"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg bg-black/40 border border-zinc-800 focus:border-indigo-500 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || Boolean(oauthLoading)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Send Login Link</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-zinc-800/80 text-center">
              <p className="text-[10px] text-zinc-500">
                Registration is closed. Unauthorized accounts will be blocked by Supabase security policies.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

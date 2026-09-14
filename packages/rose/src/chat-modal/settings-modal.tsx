"use client";

import { useState, useEffect, type FormEvent } from "react";
import { X, Sliders, Brain, Check, AlertCircle, Sparkles } from "lucide-react";
import { Tooltip, Button, Navbar, Dropdown } from "@mono/components";
import { RoseMemoriesTab, type RoseMemoryItem } from "./settings-memories";

export type { RoseMemoryItem };

export interface RosePersonalizationData {
  user_id?: string;
  custom_instructions: string;
  nickname?: string | null;
  tone?: string | null;
  updated_at?: string;
}

export interface RoseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBasePath?: string;
}

const TONE_OPTIONS = [
  "Warm & Helpful",
  "Concise & Direct",
  "Enthusiastic & Playful",
  "Professional & Formal",
  "Empathetic & Gentle",
  "Analytical & Technical",
];

const TONE_DROPDOWN_ITEMS = TONE_OPTIONS.map((opt) => ({ label: opt, value: opt }));

const LOCAL_STORAGE_PERSONALIZATION_KEY = "mono_rose_local_personalization";

export function RoseSettingsModal({
  isOpen,
  onClose,
  apiBasePath = "/api/rose",
}: RoseSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"personalization" | "memories">("personalization");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [memoryCount, setMemoryCount] = useState(0);

  // Personalization state
  const [customInstructions, setCustomInstructions] = useState("");
  const [nickname, setNickname] = useState("");
  const [tone, setTone] = useState("Warm & Helpful");

  const loadPersonalization = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${apiBasePath}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data.personalization) {
          setCustomInstructions(data.personalization.custom_instructions || "");
          setNickname(data.personalization.nickname || "");
          setTone(data.personalization.tone || "Warm & Helpful");
        }
        return;
      }
    } catch {
      // ignore network failure, fallback to localStorage
    }

    try {
      const storedP = localStorage.getItem(LOCAL_STORAGE_PERSONALIZATION_KEY);
      if (storedP) {
        const parsed = JSON.parse(storedP);
        setCustomInstructions(parsed.custom_instructions || "");
        setNickname(parsed.nickname || "");
        setTone(parsed.tone || "Warm & Helpful");
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPersonalization();
    }
  }, [isOpen, apiBasePath]);

  const handleSavePersonalization = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      action: "save_personalization",
      customInstructions: customInstructions.trim(),
      nickname: nickname.trim(),
      tone,
    };

    try {
      const res = await fetch(`${apiBasePath}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMsg("Personalization saved successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_PERSONALIZATION_KEY,
          JSON.stringify({
            custom_instructions: customInstructions.trim(),
            nickname: nickname.trim(),
            tone,
          })
        );
        setSuccessMsg("Personalization saved locally.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch {
        setErrorMsg("Failed to save personalization.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="m-rose-settings-backdrop" role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title">
      <div className="m-rose-settings-modal">
        {/* Header */}
        <header className="m-rose-settings-header">
          <div className="m-rose-settings-header-title">
            <Sliders size={18} className="m-rose-settings-icon" />
            <h2 id="settings-dialog-title">Rose Settings</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="m-rose-header-icon-btn"
            onClick={onClose}
            title="Close Settings"
            aria-label="Close Settings"
            icon={<X size={18} />}
          />
        </header>

        {/* Tabs Navbar */}
        <Navbar
          variant="tabs"
          className="m-rose-settings-navbar"
          links={[
            {
              label: "Personalization",
              active: activeTab === "personalization",
              icon: <Sliders size={14} />,
              onClick: () => setActiveTab("personalization"),
            },
            {
              label: `Memories (${memoryCount})`,
              active: activeTab === "memories",
              icon: <Brain size={14} />,
              onClick: () => setActiveTab("memories"),
            },
          ]}
        />

        {/* Personalization Status Messages */}
        {successMsg && activeTab === "personalization" && (
          <div className="m-rose-settings-alert success" role="status">
            <Check size={14} />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && activeTab === "personalization" && (
          <div className="m-rose-settings-alert error" role="alert">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="m-rose-settings-content">
          {activeTab === "personalization" ? (
            <form onSubmit={handleSavePersonalization} className="m-rose-personalization-form">
              <div className="m-rose-settings-field">
                <div className="m-rose-settings-label-row">
                  <label htmlFor="pref-nickname">Preferred Nickname / Name</label>
                  <Tooltip
                    variant="help"
                    triggerAriaLabel="Help for Preferred Nickname"
                    content="Specify how Rose should address you throughout chats and greetings."
                  />
                </div>
                <input
                  id="pref-nickname"
                  type="text"
                  className="m-rose-settings-input"
                  placeholder="e.g. Captain, Alex, Sensei"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div className="m-rose-settings-field">
                <div className="m-rose-settings-label-row">
                  <label htmlFor="pref-tone">Personality & Tone Style</label>
                  <Tooltip
                    variant="help"
                    triggerAriaLabel="Help for Tone Style"
                    content="Select Rose's predominant conversational tone across responses."
                  />
                </div>
                <Dropdown
                  items={TONE_DROPDOWN_ITEMS}
                  value={tone}
                  onChange={(val) => setTone(val)}
                  className="m-rose-settings-dropdown"
                />
              </div>

              <div className="m-rose-settings-field">
                <div className="m-rose-settings-label-row">
                  <label htmlFor="pref-instructions">Custom Instructions</label>
                  <Tooltip
                    variant="help"
                    triggerAriaLabel="Help for Custom Instructions"
                    content="Provide guidelines, topics of interest, or constraints that Rose will remember and follow in every conversation."
                  />
                </div>
                <textarea
                  id="pref-instructions"
                  className="m-rose-settings-textarea"
                  rows={5}
                  placeholder="What would you like Rose to know about you to provide better responses? (e.g. Always respond with TypeScript examples, keep answers concise)"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                />
              </div>

              <div className="m-rose-settings-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSaving}
                  icon={<Sparkles size={14} />}
                >
                  {isSaving ? "Saving…" : "Save Personalization"}
                </Button>
              </div>
            </form>
          ) : (
            <RoseMemoriesTab
              isOpen={isOpen}
              apiBasePath={apiBasePath}
              onCountChange={setMemoryCount}
              onStatus={(msg, kind) => {
                if (kind === "error") setErrorMsg(msg);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
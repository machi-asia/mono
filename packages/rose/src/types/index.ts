export type { RoseUsage } from "@mono/database";

export interface RoseMemoryItem {
  id: string;
  content: string;
  type?: "fact" | "preference" | "goal" | "general";
  created_at?: string;
}

export interface RosePersonalizationData {
  persona: "friendly" | "concise" | "expert" | "creative";
  voiceSpeed?: number;
  voicePitch?: number;
  voiceProvider?: "web-speech" | "client-whisper" | "auto";
  memories?: RoseMemoryItem[];
}

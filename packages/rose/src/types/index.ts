export interface RoseUsage {
  allowed: boolean;
  count: number;
  limit: number;
  week: string;
  dailyCount: number;
  dailyLimit: number;
  day: string;
  exceededType?: "daily" | "weekly";
  remaining: number;
  role?: "admin" | "guest" | "authenticated";
}

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

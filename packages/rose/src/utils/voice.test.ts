import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cleanTextForSpeech,
  isSpeechSynthesisSupported,
  isSpeechRecognitionSupported,
  isMediaRecorderSupported,
  getBestFemaleVoice,
  speakText,
  stopSpeaking,
  createSpeechRecognition,
  transcribeAudioBlob,
} from "./speechService";

describe("Rose Voice & Speech Service", () => {
  describe("cleanTextForSpeech", () => {
    it("returns empty string for null, undefined, or non-string input", () => {
      expect(cleanTextForSpeech("")).toBe("");
      expect(cleanTextForSpeech(null)).toBe("");
      expect(cleanTextForSpeech(undefined)).toBe("");
    });

    it("strips <emotion> tags completely", () => {
      const input = "Hello there! <emotion>happy</emotion> How are you?";
      expect(cleanTextForSpeech(input)).toBe("Hello there! How are you?");
    });

    it("strips code blocks completely", () => {
      const input = "Here is an example:\n```typescript\nconst a = 10;\n```\nLet me know what you think!";
      expect(cleanTextForSpeech(input)).toBe("Here is an example: Let me know what you think!");
    });

    it("cleans bold, italic, inline code, strikethrough and highlights", () => {
      const input = "Rose has **deep** empathy, *warm* words, `code skills`, ~~mistakes~~, and ==highlights==.";
      expect(cleanTextForSpeech(input)).toBe("Rose has deep empathy, warm words, code skills, mistakes, and highlights.");
    });

    it("converts GitHub and Obsidian style callouts to readable prefixes", () => {
      const input = "> [!NOTE]\n> Meeting is scheduled for 3 PM.";
      expect(cleanTextForSpeech(input)).toBe("Note: Meeting is scheduled for 3 PM.");

      const warn = "> [!WARNING]\n> Storage quota is almost full.";
      expect(cleanTextForSpeech(warn)).toBe("Warning: Storage quota is almost full.");
    });

    it("converts wikilinks properly", () => {
      const input = "Read more in [[Architecture Guide]] or [[docs/API|API Docs]].";
      expect(cleanTextForSpeech(input)).toBe("Read more in Architecture Guide or API Docs.");
    });

    it("cleans headers and list markers", () => {
      const input = "### Rose Features\n- Natural voice\n- Memory storage\n1. Quick response";
      expect(cleanTextForSpeech(input)).toBe("Rose Features. Natural voice Memory storage Quick response");
    });
  });

  describe("Browser Feature Detection", () => {
    it("returns boolean for synthesis support", () => {
      expect(typeof isSpeechSynthesisSupported()).toBe("boolean");
    });

    it("returns boolean for recognition support", () => {
      expect(typeof isSpeechRecognitionSupported()).toBe("boolean");
    });
  });

  describe("getBestFemaleVoice", () => {
    it("returns null for empty voices array", () => {
      expect(getBestFemaleVoice([])).toBeNull();
      expect(getBestFemaleVoice(null)).toBeNull();
    });

    it("matches preferred female voice names", () => {
      const mockVoices = [
        { name: "Microsoft David", lang: "en-US" },
        { name: "Microsoft Jenny Online (Natural)", lang: "en-US" },
        { name: "Generic Male", lang: "en-US" },
      ] as unknown as SpeechSynthesisVoice[];

      const voice = getBestFemaleVoice(mockVoices);
      expect(voice?.name).toBe("Microsoft Jenny Online (Natural)");
    });

    it("finds keywords like female, woman, or zira in voice name", () => {
      const mockVoices = [
        { name: "Microsoft Mark", lang: "en-US" },
        { name: "English Female Voice", lang: "en-US" },
      ] as unknown as SpeechSynthesisVoice[];

      const voice = getBestFemaleVoice(mockVoices);
      expect(voice?.name).toBe("English Female Voice");
    });

    it("falls back to standard English voice if no explicit female voice found", () => {
      const mockVoices = [
        { name: "French Voice", lang: "fr-FR" },
        { name: "English Generic", lang: "en-US" },
      ] as unknown as SpeechSynthesisVoice[];

      const voice = getBestFemaleVoice(mockVoices);
      expect(voice?.name).toBe("English Generic");
    });
  });

  describe("speakText & stopSpeaking", () => {
    let mockSpeak: ReturnType<typeof vi.fn>;
    let mockCancel: ReturnType<typeof vi.fn>;
    let mockGetVoices: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockSpeak = vi.fn();
      mockCancel = vi.fn();
      mockGetVoices = vi.fn().mockReturnValue([
        { name: "Microsoft Jenny Online (Natural)", lang: "en-US" },
      ]);

      (globalThis as any).window = globalThis.window || {};
      (globalThis as any).window.speechSynthesis = {
        speak: mockSpeak,
        cancel: mockCancel,
        getVoices: mockGetVoices,
        onvoiceschanged: null,
      };

      (globalThis as any).SpeechSynthesisUtterance = class {
        text: string;
        voice: any;
        rate: number = 1;
        pitch: number = 1.05;
        volume: number = 1;
        onstart: (() => void) | null = null;
        onend: (() => void) | null = null;
        onerror: ((e: any) => void) | null = null;
        constructor(text: string) {
          this.text = text;
        }
      };
      (globalThis as any).window.SpeechSynthesisUtterance = (globalThis as any).SpeechSynthesisUtterance;
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("calls speak on window.speechSynthesis and cancels prior speech", () => {
      const onStart = vi.fn();
      const onEnd = vi.fn();

      const cancelFn = speakText("Hello, I am Rose!", { onStart, onEnd });
      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();

      cancelFn();
      expect(mockCancel).toHaveBeenCalledTimes(2);
    });

    it("stopSpeaking cancels active speech", () => {
      stopSpeaking();
      expect(mockCancel).toHaveBeenCalled();
    });
  });

  describe("createSpeechRecognition", () => {
    let mockInstance: any;

    beforeEach(() => {
      class MockSpeechRecognition {
        continuous = false;
        interimResults = true;
        lang = "en-US";
        start = vi.fn();
        stop = vi.fn();
        abort = vi.fn();
        onstart: (() => void) | null = null;
        onresult: ((e: any) => void) | null = null;
        onerror: ((e: any) => void) | null = null;
        onend: (() => void) | null = null;

        constructor() {
          mockInstance = this;
        }
      }

      (globalThis as any).window = globalThis.window || {};
      (globalThis as any).window.SpeechRecognition = MockSpeechRecognition;
    });

    it("creates speech recognition instance with start and stop handles", () => {
      const onResult = vi.fn();
      const rec = createSpeechRecognition({ onResult });

      expect(rec).not.toBeNull();
      rec?.start();
      expect(mockInstance.start).toHaveBeenCalled();

      rec?.stop();
      expect(mockInstance.stop).toHaveBeenCalled();

      rec?.abort();
      expect(mockInstance.abort).toHaveBeenCalled();
    });

    it("processes interim and final transcripts", () => {
      const onResult = vi.fn();
      createSpeechRecognition({ onResult });

      // Interim result event
      const interimEvent = {
        resultIndex: 0,
        results: [[{ transcript: "hello" }]],
      };
      (interimEvent.results[0] as any).isFinal = false;
      mockInstance.onresult(interimEvent);
      expect(onResult).toHaveBeenCalledWith("hello", false);

      // Final result event
      const finalEvent = {
        resultIndex: 0,
        results: [[{ transcript: "hello rose" }]],
      };
      (finalEvent.results[0] as any).isFinal = true;
      mockInstance.onresult(finalEvent);
      expect(onResult).toHaveBeenCalledWith("hello rose", true);
    });
  });

  describe("transcribeAudioBlob (faster-whisper-ts)", () => {
    it("reports boolean for isMediaRecorderSupported", () => {
      expect(typeof isMediaRecorderSupported()).toBe("boolean");
    });

    it("sends audio blob via FormData to /api/rose/transcribe", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          ok: true,
          transcript: "Hello from faster whisper",
          provider: "faster-whisper",
        }),
      });
      (globalThis as any).fetch = mockFetch;

      const dummyBlob = new Blob(["fake-audio"], { type: "audio/webm" });
      const res = await transcribeAudioBlob(dummyBlob, {
        apiEndpoint: "/api/rose/transcribe",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/rose/transcribe",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );
      expect(res.ok).toBe(true);
      expect(res.transcript).toBe("Hello from faster whisper");
      expect(res.provider).toBe("faster-whisper");
    });

    it("gracefully returns fallbackToClient on HTTP failure", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      (globalThis as any).fetch = mockFetch;

      const dummyBlob = new Blob(["fake-audio"], { type: "audio/webm" });
      const res = await transcribeAudioBlob(dummyBlob);

      expect(res.ok).toBe(false);
      expect(res.fallbackToClient).toBe(true);
    });
  });
});

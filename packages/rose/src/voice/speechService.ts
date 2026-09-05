/**
 * Speech Service Utility for Zero-Token Voice Chat & Synthesis in @mono/rose
 * Utilizes the browser's native Web Speech API (speechSynthesis & SpeechRecognition).
 * Requires 0 API tokens and incurs 0 cost.
 */

/**
 * Cleans markdown formatting, callouts/admonitions, wikilinks, code blocks,
 * badges, and emotion tags from text so Rose speaks natural, fluent sentences.
 */
export function cleanTextForSpeech(text: string | null | undefined): string {
  if (!text || typeof text !== "string") return "";

  let cleaned = text;

  // 1. Remove [ERROR] prefix and replace with 'Error: '
  cleaned = cleaned.replace(/^\[ERROR\]\s*/i, "Error: ");

  // 2. Remove emotion tags completely (<emotion>happy</emotion>)
  cleaned = cleaned.replace(/<emotion>[\s\S]*?<\/emotion>/gi, "");

  // 3. Remove code blocks completely (```language ... ```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "");

  // 4. Remove Obsidian/GitHub style alert headers (> [!NOTE], > [!TIP], etc.)
  cleaned = cleaned.replace(
    />\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|DANGER)\]/gi,
    (_match, type) => {
      return `${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}: `;
    }
  );

  // 5. Clean custom badges: ![badge:color:label] -> label
  cleaned = cleaned.replace(/!\[badge:[^:]+:([^\]]+)\]/g, "$1");

  // 6. Clean markdown images: ![alt](url) -> ''
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // 7. Clean markdown links: [label](url) -> label
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 8. Clean wikilinks: [[Page Title]] or [[Page Title|Display Name]]
  cleaned = cleaned.replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, "$1");

  // 9. Clean highlights ==text== and strikethrough ~~text~~
  cleaned = cleaned.replace(/==([^=]+)==/g, "$1");
  cleaned = cleaned.replace(/~~(.*?)~~/g, "$1");

  // 10. Clean headers: ### Title -> Title.
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, "$1. ");

  // 11. Clean table formatting: | Col 1 | Col 2 | -> Col 1, Col 2
  cleaned = cleaned.replace(/\|[\s-:]+\|/g, "");
  cleaned = cleaned.replace(/\|/g, ", ");

  // 12. Clean bold, italic, inline code
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, "$2");
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, "$2");
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  // 13. Clean list bullets and blockquotes
  cleaned = cleaned.replace(/^[\s*+-]+\s+/gm, "");
  cleaned = cleaned.replace(/^\d+\.\s+/gm, "");
  cleaned = cleaned.replace(/^>\s+/gm, "");

  // 14. Clean horizontal rules
  cleaned = cleaned.replace(/^[-*_]{3,}$/gm, "");

  // 15. Normalize whitespace, punctuation, and multi-breaks
  cleaned = cleaned
    .replace(/\s+/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/\.\s*\./g, ".")
    .trim();

  return cleaned;
}

/**
 * Checks if the browser supports Speech Synthesis (TTS)
 */
export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

/**
 * Checks if the browser supports Speech Recognition (STT)
 */
export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

/**
 * Selects the best natural feminine/female English voice from available browser voices for Rose.
 * Prioritizes natural, neural, gentle voices (Microsoft Jenny Natural, Aria Natural, Google UK Female, Samantha, etc.).
 */
export function getBestFemaleVoice(
  voices: SpeechSynthesisVoice[] | null | undefined
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Preferred gentle female voice names in priority order
  const preferredFemaleNames = [
    "Microsoft Jenny Online (Natural)",
    "Microsoft Aria Online (Natural)",
    "Microsoft Michelle Online (Natural)",
    "Microsoft Ana Online (Natural)",
    "Microsoft Sonia Online (Natural)",
    "Google UK English Female",
    "Google US English Female",
    "Google English (Female)",
    "Samantha",
    "Victoria",
    "Karen",
    "Moira",
    "Tessa",
    "Fiona",
    "Zira",
    "Microsoft Zira",
    "Microsoft Jenny",
    "Microsoft Aria",
  ];

  // 1. Exact or partial match with preferred female natural voices
  for (const name of preferredFemaleNames) {
    const found = voices.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (found) return found;
  }

  // 2. Any English voice with explicit 'female' or feminine indicators in its name
  const femaleKeywords = [
    "female",
    "woman",
    "jenny",
    "aria",
    "samantha",
    "victoria",
    "karen",
    "zira",
    "sonia",
    "michelle",
  ];
  const explicitFemaleEn = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
  );
  if (explicitFemaleEn) return explicitFemaleEn;

  // 3. Any English voice marked as 'natural' or 'neural'
  const naturalEn = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.toLowerCase().includes("natural") ||
        v.name.toLowerCase().includes("neural"))
  );
  if (naturalEn) return naturalEn;

  // 4. Any standard en-US or en-GB voice
  const standardEn = voices.find(
    (v) =>
      v.lang === "en-US" || v.lang === "en-GB" || v.lang.startsWith("en")
  );
  if (standardEn) return standardEn;

  // 5. Default system voice
  return voices.find((v) => v.default) || voices[0];
}

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * Synthesizes speech using the browser's native SpeechSynthesis.
 * Splits long text into natural sentence chunks to prevent Web Speech API silent cutoff bugs.
 */
export function speakText(
  text: string,
  options: SpeakOptions = {}
): () => void {
  if (!isSpeechSynthesisSupported()) {
    if (options.onError) {
      options.onError(new Error("SpeechSynthesis is not supported in this browser."));
    }
    return () => {};
  }

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) {
    if (options.onEnd) options.onEnd();
    return () => {};
  }

  // Cancel any currently playing speech before starting a new one
  window.speechSynthesis.cancel();

  // Split text into reasonable chunks (~150-200 characters or by sentences)
  const sentenceRegex = /[^.!?]+[.!?]+|[^.!?]+$/g;
  const chunks = cleanText.match(sentenceRegex) || [cleanText];
  const trimmedChunks = chunks.map((c) => c.trim()).filter(Boolean);

  if (trimmedChunks.length === 0) {
    if (options.onEnd) options.onEnd();
    return () => {};
  }

  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = getBestFemaleVoice(voices);

  let currentChunkIndex = 0;
  let isCancelled = false;

  const speakNextChunk = () => {
    if (isCancelled || currentChunkIndex >= trimmedChunks.length) {
      if (!isCancelled && options.onEnd) {
        options.onEnd();
      }
      return;
    }

    const chunk = trimmedChunks[currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.05; // Gentle, warm feminine resonance for Rose
    utterance.volume = options.volume ?? 1.0;

    if (currentChunkIndex === 0 && options.onStart) {
      utterance.onstart = () => {
        if (!isCancelled && options.onStart) options.onStart();
      };
    }

    utterance.onend = () => {
      currentChunkIndex++;
      speakNextChunk();
    };

    utterance.onerror = (e: any) => {
      // Ignore 'canceled' or 'interrupted' errors when intentionally stopped
      if (e.error === "canceled" || e.error === "interrupted") {
        isCancelled = true;
        return;
      }
      console.warn("[SpeechService] SpeechSynthesis error:", e);
      if (options.onError) options.onError(e);
      if (options.onEnd) options.onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  // If voices list is not yet loaded, wait for voiceschanged
  if (voices.length === 0 && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      if (!isCancelled) speakNextChunk();
    };
  } else {
    speakNextChunk();
  }

  return () => {
    isCancelled = true;
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  };
}

/**
 * Stops all ongoing speech synthesis immediately.
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeechRecognitionController {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export interface SpeechRecognitionOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  lang?: string;
}

/**
 * Creates and initializes a browser SpeechRecognition instance (STT).
 */
export function createSpeechRecognition({
  onResult,
  onStart,
  onEnd,
  onError,
  lang = "en-US",
}: SpeechRecognitionOptions): SpeechRecognitionController | null {
  if (!isSpeechRecognitionSupported()) {
    if (onError) {
      onError(new Error("SpeechRecognition is not supported in this browser."));
    }
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = lang;

  recognition.onstart = () => {
    console.log("[SpeechService] recognition.onstart fired");
    if (onStart) onStart();
  };

  recognition.onaudiostart = () => {
    console.log("[SpeechService] recognition.onaudiostart — audio capturing started");
  };

  recognition.onsoundstart = () => {
    console.log("[SpeechService] recognition.onsoundstart — sound detected");
  };

  recognition.onspeechstart = () => {
    console.log("[SpeechService] recognition.onspeechstart — speech detected");
  };

  recognition.onspeechend = () => {
    console.log("[SpeechService] recognition.onspeechend — speech ended (silence detected)");
  };

  recognition.onaudioend = () => {
    console.log("[SpeechService] recognition.onaudioend — audio capture ended");
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const item = event.results[i];
      const transcript = item[0].transcript;
      if (item.isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    const text = finalTranscript || interimTranscript;
    const isFinal = Boolean(finalTranscript);
    console.log("[SpeechService] recognition.onresult:", JSON.stringify(text), "isFinal:", isFinal);

    if (onResult) {
      onResult(text, isFinal);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn("[SpeechService] SpeechRecognition error event:", event.error, event);
    // Ignore harmless 'no-speech' or 'aborted' events
    if (event.error === "no-speech" || event.error === "aborted") {
      if (onEnd) onEnd();
      return;
    }
    if (onError) onError(event);
    if (onEnd) onEnd();
  };

  recognition.onend = () => {
    console.log("[SpeechService] recognition.onend fired");
    if (onEnd) onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (err) {
        console.warn("[SpeechService] Recognition already started or error:", err);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // Safe ignore
      }
    },
    abort: () => {
      try {
        recognition.abort();
      } catch {
        // Safe ignore
      }
    },
  };
}

/**
 * Checks if audio recording via MediaRecorder is supported in browser.
 */
export function isMediaRecorderSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof window.MediaRecorder === "function"
  );
}

export interface TranscribeAudioOptions {
  apiEndpoint?: string;
  language?: string;
}

export interface TranscribeAudioResult {
  ok: boolean;
  transcript?: string;
  provider?: string;
  fallbackToClient?: boolean;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Sends recorded audio blob to the server-side /api/rose/transcribe faster-whisper-ts handler.
 */
export async function transcribeAudioBlob(
  audioBlob: Blob,
  options: TranscribeAudioOptions = {}
): Promise<TranscribeAudioResult> {
  const endpoint = options.apiEndpoint || "/api/rose/transcribe";

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  if (options.language) {
    formData.append("language", options.language);
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return {
        ok: false,
        fallbackToClient: true,
        error: {
          code: `http_${res.status}`,
          message: `Transcription request failed with status ${res.status}`,
        },
      };
    }

    const data: TranscribeAudioResult = await res.json();
    return data;
  } catch (err) {
    return {
      ok: false,
      fallbackToClient: true,
      error: {
        code: "network_error",
        message: err instanceof Error ? err.message : "Failed to contact transcription service.",
      },
    };
  }
}

export interface FasterWhisperRecorderOptions {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (err: any) => void;
  onEnd?: () => void;
  lang?: string;
  apiEndpoint?: string;
}

/**
 * Creates a push-to-talk audio recorder that posts audio to the faster-whisper-ts server endpoint.
 * Recording runs until the caller invokes .stop() (e.g. user clicks the mic button again).
 * Works in all MediaRecorder-capable browsers including Firefox.
 */
export function createFasterWhisperRecorder({
  onStart,
  onResult,
  onError,
  onEnd,
  lang,
  apiEndpoint = "/api/rose/transcribe",
}: FasterWhisperRecorderOptions): SpeechRecognitionController | null {
  if (!isMediaRecorderSupported()) {
    if (onError) {
      onError(new Error("MediaRecorder or microphone is not supported in this browser."));
    }
    return null;
  }

  let mediaRecorder: MediaRecorder | null = null;
  let audioStream: MediaStream | null = null;
  let audioChunks: Blob[] = [];
  let isAborted = false;

  return {
    start: async () => {
      try {
        isAborted = false;
        audioChunks = [];
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

        mediaRecorder = mimeType
          ? new MediaRecorder(audioStream, { mimeType })
          : new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstart = () => {
          if (onStart) onStart();
        };

        mediaRecorder.onstop = async () => {
          if (audioStream) {
            audioStream.getTracks().forEach((track) => track.stop());
            audioStream = null;
          }

          if (isAborted) {
            if (onEnd) onEnd();
            return;
          }

          if (audioChunks.length === 0) {
            if (onEnd) onEnd();
            return;
          }

          const blobType = mediaRecorder?.mimeType || "audio/webm";
          const completeBlob = new Blob(audioChunks, { type: blobType });

          const result = await transcribeAudioBlob(completeBlob, {
            apiEndpoint,
            language: lang,
          });

          if (result.ok && result.transcript) {
            if (onResult) onResult(result.transcript, true);
          } else if (result.fallbackToClient) {
            if (onError) onError(new Error(result.error?.message || "Server transcription unavailable"));
          } else if (result.error) {
            if (onError) onError(new Error(result.error.message));
          }

          if (onEnd) onEnd();
        };

        mediaRecorder.start();
      } catch (err) {
        if (onError) onError(err);
        if (onEnd) onEnd();
      }
    },
    stop: () => {
      try {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      } catch { /* ignore */ }
    },
    abort: () => {
      try {
        isAborted = true;
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
        if (audioStream) {
          audioStream.getTracks().forEach((track) => track.stop());
          audioStream = null;
        }
      } catch { /* ignore */ }
    },
  };
}

export interface ClientWhisperRecorderOptions {
  onStart?: () => void;
  onStream?: (stream: MediaStream) => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (err: any) => void;
  onEnd?: () => void;
  onModelLoading?: () => void;
  onModelReady?: () => void;
  lang?: string;
}

let cachedPipeline: any = null;
let pipelinePromise: Promise<any> | null = null;

async function getWhisperPipeline(
  onModelLoading?: () => void,
  onModelReady?: () => void
): Promise<any> {
  if (cachedPipeline) {
    return cachedPipeline;
  }
  if (pipelinePromise) {
    console.log("[ClientWhisper] model already loading, awaiting existing promise…");
    return pipelinePromise;
  }

  console.log("[ClientWhisper] loading whisper-tiny model…");
  if (onModelLoading) onModelLoading();

  pipelinePromise = (async () => {
    try {
      const { pipeline, env } = await import("@huggingface/transformers");
      console.log("[ClientWhisper] @huggingface/transformers imported");

      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const p = await pipeline(
        "automatic-speech-recognition",
        "onnx-community/whisper-tiny",
        {
          dtype: "q4",
          device: "wasm",
          progress_callback: (progress: any) => {
            if (progress.status === "progress") {
              console.log(
                `[ClientWhisper] download ${progress.file}: ${(progress.progress || 0).toFixed(1)}%`
              );
            } else if (progress.status === "done") {
              console.log(`[ClientWhisper] download ${progress.file} done ✓`);
            }
          },
        }
      );

      cachedPipeline = p;
      console.log("[ClientWhisper] model ready ✓");
      if (onModelReady) onModelReady();
      return p;
    } catch (err) {
      pipelinePromise = null;
      console.error("[ClientWhisper] failed to load whisper model:", err);
      throw err;
    }
  })();

  return pipelinePromise;
}

async function blobToFloat32At16kHz(blob: Blob): Promise<Float32Array> {
  console.log("[ClientWhisper] decoding audio blob:", blob.size, "bytes,", blob.type);
  const arrayBuffer = await blob.arrayBuffer();
  const decoded = await new AudioContext().decodeAudioData(arrayBuffer);
  console.log("[ClientWhisper] decoded audio duration:", decoded.duration.toFixed(2), "s, sampleRate:", decoded.sampleRate);
  const offlineCtx = new OfflineAudioContext(
    1,
    Math.ceil(decoded.duration * 16000),
    16000
  );
  const src = offlineCtx.createBufferSource();
  src.buffer = decoded;
  src.connect(offlineCtx.destination);
  src.start(0);
  const resampled = await offlineCtx.startRendering();
  const f32 = resampled.getChannelData(0);
  console.log("[ClientWhisper] resampled to 16kHz Float32Array, length:", f32.length);
  return f32;
}

/**
 * Creates a push-to-talk recorder that transcribes speech entirely on the client side
 * using Transformers.js (Whisper-tiny via ONNX WASM). No server roundtrip, no Web Worker.
 * Works in all MediaRecorder-capable browsers including Firefox.
 * The Whisper model (~40 MB) is downloaded once and cached in the browser.
 */
export function createClientWhisperRecorder({
  onStart,
  onStream,
  onResult,
  onError,
  onEnd,
  onModelLoading,
  onModelReady,
  lang,
}: ClientWhisperRecorderOptions): SpeechRecognitionController | null {
  console.log("[ClientWhisper] createClientWhisperRecorder called, isMediaRecorderSupported:", isMediaRecorderSupported());

  if (!isMediaRecorderSupported()) {
    console.error("[ClientWhisper] MediaRecorder not supported in this browser");
    if (onError) onError(new Error("MediaRecorder or microphone is not supported in this browser."));
    return null;
  }

  let mediaRecorder: MediaRecorder | null = null;
  let audioStream: MediaStream | null = null;
  let audioChunks: Blob[] = [];
  let isAborted = false;
  let stopRequested = false;

  // Voice Activity Detection (VAD) & Interim Transcription via AudioContext
  let vadAudioCtx: AudioContext | null = null;
  let vadInterval: any = null;
  let hasSpoken = false;
  let silenceStartTime: number | null = null;
  let isTranscribing = false;
  let isInterimRunning = false;
  let lastInterimRunTime = 0;

  const cleanupVAD = () => {
    if (vadInterval) {
      clearInterval(vadInterval);
      vadInterval = null;
    }
    if (vadAudioCtx && vadAudioCtx.state !== "closed") {
      vadAudioCtx.close().catch(() => {});
      vadAudioCtx = null;
    }
  };

  return {
    start: async () => {
      console.log("[ClientWhisper] start() called");
      try {
        isAborted = false;
        stopRequested = false;
        hasSpoken = false;
        silenceStartTime = null;
        isTranscribing = false;
        isInterimRunning = false;
        lastInterimRunTime = 0;
        audioChunks = [];

        console.log("[ClientWhisper] requesting microphone via getUserMedia…");
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // stop() or abort() was called while getUserMedia was pending — bail out
        if (stopRequested) {
          console.log("[ClientWhisper] stop was requested before getUserMedia resolved — aborting");
          audioStream.getTracks().forEach((t) => t.stop());
          audioStream = null;
          if (onEnd) onEnd();
          return;
        }

        console.log("[ClientWhisper] microphone granted ✓, tracks:", audioStream.getTracks().map(t => t.label));
        if (onStream) onStream(audioStream);

        // Preload whisper model in background so transcription is snappy
        getWhisperPipeline(onModelLoading, onModelReady).catch((err) => {
          console.warn("[ClientWhisper] background model preload warning:", err);
        });

        // Set up VAD via AudioContext to detect speaking, stream interim transcripts, and auto-stop on silence
        try {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          vadAudioCtx = new AudioCtx();
          const source = vadAudioCtx.createMediaStreamSource(audioStream);
          const analyser = vadAudioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          vadInterval = setInterval(async () => {
            if (isTranscribing || isAborted || !mediaRecorder || mediaRecorder.state !== "recording") return;

            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const avg = sum / bufferLength;
            const volume = avg / 128; // 0 to ~1

            // Threshold for voice detection
            if (volume > 0.08) {
              if (!hasSpoken) {
                console.log("[ClientWhisper] VAD: speech detected 🎙️");
                hasSpoken = true;
              }
              silenceStartTime = null;
            } else if (hasSpoken) {
              // User was speaking, now there is silence
              if (silenceStartTime === null) {
                silenceStartTime = Date.now();
              } else if (Date.now() - silenceStartTime > 1300) {
                // 1.3 seconds of silence after speaking — finalize and transcribe
                console.log("[ClientWhisper] VAD: silence detected after speech, auto-stopping to transcribe");
                silenceStartTime = null;
                isTranscribing = true;
                cleanupVAD();
                if (mediaRecorder && mediaRecorder.state === "recording") {
                  mediaRecorder.stop();
                }
                return;
              }
            }

            // Periodic live interim transcription while speaking
            const now = Date.now();
            if (
              hasSpoken &&
              !isInterimRunning &&
              !isTranscribing &&
              audioChunks.length >= 3 &&
              now - lastInterimRunTime > 1200
            ) {
              lastInterimRunTime = now;
              isInterimRunning = true;
              try {
                const chunksSnapshot = audioChunks.slice();
                const blob = new Blob(chunksSnapshot, {
                  type: mediaRecorder?.mimeType || "audio/webm",
                });
                const audio = await blobToFloat32At16kHz(blob);
                const model = await getWhisperPipeline();
                const res = await model(audio, {
                  language: lang ? lang.split("-")[0] : "english",
                  task: "transcribe",
                  return_timestamps: false,
                });
                const interimText =
                  res && typeof res === "object" && "text" in res
                    ? (res as { text: string }).text.trim()
                    : "";
                if (interimText && onResult && !isTranscribing && !isAborted) {
                  console.log(
                    `%c[Voice Debug] 🗣️ Interim: "${interimText}"`,
                    "color: #38bdf8; font-weight: bold; background: #0f172a; padding: 2px 6px; border-radius: 4px;"
                  );
                  onResult(interimText, false);
                }
              } catch (interimErr) {
                // Non-fatal, just log and continue recording
                console.debug("[ClientWhisper] interim decode error (non-fatal):", interimErr);
              } finally {
                isInterimRunning = false;
              }
            }
          }, 100);
        } catch (vadErr) {
          console.warn("[ClientWhisper] VAD setup warning:", vadErr);
        }

        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
        console.log("[ClientWhisper] selected mimeType:", mimeType || "(browser default)");

        mediaRecorder = mimeType
          ? new MediaRecorder(audioStream, { mimeType })
          : new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunks.push(event.data);
            console.log("[ClientWhisper] ondataavailable chunk:", event.data.size, "bytes, total chunks:", audioChunks.length);
          }
        };

        mediaRecorder.onstart = () => {
          console.log("[ClientWhisper] MediaRecorder started 🎙️ — recorder state:", mediaRecorder?.state);
          if (onStart) onStart();
        };

        mediaRecorder.onstop = async () => {
          console.log("[ClientWhisper] MediaRecorder stopped, chunks collected:", audioChunks.length, "isAborted:", isAborted);
          cleanupVAD();

          if (audioStream) {
            audioStream.getTracks().forEach((t) => t.stop());
            audioStream = null;
          }

          if (isAborted) {
            console.log("[ClientWhisper] aborted — skipping transcription");
            if (onEnd) onEnd();
            return;
          }
          if (audioChunks.length === 0) {
            console.warn("[ClientWhisper] no audio chunks captured — did you speak?");
            if (onEnd) onEnd();
            return;
          }

          try {
            const blob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || "audio/webm" });
            console.log("[ClientWhisper] audio blob:", blob.size, "bytes");
            const audio = await blobToFloat32At16kHz(blob);

            console.log("[ClientWhisper] running Whisper inference…");
            const model = await getWhisperPipeline(onModelLoading, onModelReady);
            const result = await model(audio, {
              language: lang ? lang.split("-")[0] : "english",
              task: "transcribe",
              return_timestamps: false,
            });

            console.log("[ClientWhisper] raw result:", result);

            const text: string =
              result && typeof result === "object" && "text" in result
                ? (result as { text: string }).text.trim()
                : "";

            console.log(
              `%c[Voice Debug] ✅ Final Transcript: "${text}"`,
              "color: #4ade80; font-weight: bold; background: #064e3b; padding: 3px 8px; border-radius: 4px;"
            );

            if (text && onResult) onResult(text, true);
            else if (!text) console.warn("[ClientWhisper] transcript was empty");
          } catch (err) {
            console.error("[ClientWhisper] transcription error:", err);
            if (onError) onError(err);
          }

          if (onEnd) onEnd();
        };

        console.log("[ClientWhisper] calling MediaRecorder.start()");
        mediaRecorder.start(250); // timeslice of 250ms so chunks arrive continuously
      } catch (err) {
        console.error("[ClientWhisper] start error:", err);
        cleanupVAD();
        if (onError) onError(err);
        if (onEnd) onEnd();
      }
    },
    stop: () => {
      console.log("[ClientWhisper] stop() called, recorder state:", mediaRecorder?.state ?? "null (getUserMedia still pending)");
      stopRequested = true;
      cleanupVAD();
      try {
        if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
      } catch { /* ignore */ }
    },
    abort: () => {
      console.log("[ClientWhisper] abort() called");
      stopRequested = true;
      isAborted = true;
      cleanupVAD();
      try {
        if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
        if (audioStream) { audioStream.getTracks().forEach((t) => t.stop()); audioStream = null; }
      } catch { /* ignore */ }
    },
  };
}



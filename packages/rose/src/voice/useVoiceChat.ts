"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  isMediaRecorderSupported,
  speakText as serviceSpeakText,
  stopSpeaking as serviceStopSpeaking,
  createSpeechRecognition,
  createClientWhisperRecorder,
  type SpeechRecognitionController,
} from "./speechService";

const AUTO_SPEAK_STORAGE_KEY = "mono_rose_auto_speak";

export type SpeechProvider = "web-speech" | "client-whisper" | "auto";

export interface UseVoiceChatOptions {
  onFinalSpoken?: (transcript: string) => void;
  lang?: string;
  provider?: SpeechProvider;
}

export function useVoiceChat(options: UseVoiceChatOptions = {}) {
  const {
    onFinalSpoken,
    lang = "en-US",
    provider = "auto",
  } = options;

  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [activeProvider, setActiveProvider] = useState<"client-whisper" | "web-speech">(
    provider === "client-whisper" ? "client-whisper" : "web-speech"
  );

  const recognitionRef = useRef<SpeechRecognitionController | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const stopSpeechFnRef = useRef<(() => void) | null>(null);
  const onFinalCallbackRef = useRef<((text: string) => void) | undefined>(onFinalSpoken);
  const isVoiceModeRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // Synchronous guard — prevents double-invocation from stale React state closures
  const isListeningRef = useRef(false);

  const setListening = useCallback((val: boolean) => {
    isListeningRef.current = val;
    setIsListening(val);
  }, []);

  useEffect(() => { isVoiceModeRef.current = isVoiceMode; }, [isVoiceMode]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { onFinalCallbackRef.current = onFinalSpoken; }, [onFinalSpoken]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(AUTO_SPEAK_STORAGE_KEY);
        if (saved !== null) setAutoSpeak(saved === "true");
      } catch { /* ignore */ }
    }
  }, []);

  const toggleAutoSpeak = useCallback(() => {
    setAutoSpeak((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        try { localStorage.setItem(AUTO_SPEAK_STORAGE_KEY, String(next)); } catch { /* ignore */ }
      }
      if (!next && isSpeaking) { serviceStopSpeaking(); setIsSpeaking(false); }
      return next;
    });
  }, [isSpeaking]);

  useEffect(() => {
    return () => {
      if (stopSpeechFnRef.current) stopSpeechFnRef.current();
      if (recognitionRef.current) recognitionRef.current.abort();
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (stopSpeechFnRef.current) { stopSpeechFnRef.current(); stopSpeechFnRef.current = null; }
    serviceStopSpeaking();
    setIsSpeaking(false);
  }, []);

  const stopListening = useCallback(() => {
    console.log("[useVoiceChat] stopListening called, ref state:", isListeningRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    recognitionRef.current = null;
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setMicStream(null);
    setListening(false);
  }, [setListening]);

  const startListeningWithWebSpeech = useCallback(
    (activeCallback?: (text: string) => void) => {
      console.log("[useVoiceChat] startListeningWithWebSpeech invoked");

      if (!isSpeechRecognitionSupported()) {
        console.warn("[useVoiceChat] SpeechRecognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
        setListening(false);
        return;
      }

      const rec = createSpeechRecognition({
        lang,
        onStart: () => {
          console.log("[useVoiceChat] SpeechRecognition started");
          setListening(true);
        },
        onResult: (text: string, isFinal: boolean) => {
          console.log(
            `%c[Voice Debug WebSpeech] ${isFinal ? "🏁 [FINAL]" : "⏳ [STREAMING]"} Words: "${text}"`,
            isFinal
              ? "color: #34d399; font-weight: bold;"
              : "color: #67e8f9; font-style: italic;"
          );
          setTranscript(text);
          if (isFinal && activeCallback) {
            console.log("[useVoiceChat] SpeechRecognition final text received, submitting:", text);
            setListening(false);
            if (micStreamRef.current) {
              micStreamRef.current.getTracks().forEach((t) => t.stop());
              micStreamRef.current = null;
            }
            setMicStream(null);
            activeCallback(text);
          }
        },
        onEnd: () => {
          console.log("[useVoiceChat] SpeechRecognition ended");
          setListening(false);
          if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach((t) => t.stop());
            micStreamRef.current = null;
          }
          setMicStream(null);
        },
        onError: (e) => {
          console.warn("[useVoiceChat] SpeechRecognition error:", e);
          setListening(false);
          if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach((t) => t.stop());
            micStreamRef.current = null;
          }
          setMicStream(null);
        },
      });

      if (rec) {
        recognitionRef.current = rec;
        setActiveProvider("web-speech");
        // Start recognition synchronously immediately
        rec.start();
      }

      // Concurrently obtain mic stream for loudness wave ring animation
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            console.log("[useVoiceChat] getUserMedia stream acquired for loudness rings ✓");
            micStreamRef.current = stream;
            setMicStream(stream);
          })
          .catch((err) => {
            console.warn("[useVoiceChat] getUserMedia for visualizer stream warning:", err);
          });
      }
    },
    [lang, setListening]
  );

  const startListening = useCallback(
    (onFinalResult?: (text: string) => void) => {
      const activeCallback = onFinalResult || onFinalCallbackRef.current;

      console.log("[useVoiceChat] startListening called — provider:", provider, "isListeningRef:", isListeningRef.current);

      stopSpeaking();

      // Use ref (not state) so this guard is never stale
      if (isListeningRef.current) {
        console.log("[useVoiceChat] already listening (ref=true) — ignoring duplicate start call");
        return;
      }

      // Mark as listening synchronously before any async work
      isListeningRef.current = true;
      setTranscript("");

      // Determine which engine to use:
      // If browser supports native SpeechRecognition (Chrome, Edge, Safari) and provider isn't explicitly client-whisper:
      if (provider !== "client-whisper" && isSpeechRecognitionSupported()) {
        console.log("[useVoiceChat] using native SpeechRecognition for real-time streaming STT");
        startListeningWithWebSpeech(activeCallback);
        return;
      }

      // Universal client-side Whisper (Firefox, or when explicitly requested):
      if (isMediaRecorderSupported()) {
        console.log("[useVoiceChat] using client-whisper recorder with VAD silence auto-submission");
        const recorder = createClientWhisperRecorder({
          lang,
          onStart: () => {
            console.log("[useVoiceChat] recorder onStart fired");
            setIsListening(true);
            setActiveProvider("client-whisper");
          },
          onStream: (stream) => {
            console.log("[useVoiceChat] micStream received");
            micStreamRef.current = stream;
            setMicStream(stream);
          },
          onResult: (text: string, isFinal: boolean) => {
            console.log(
              `%c[Voice Debug Hook] ${isFinal ? "🏁 [FINAL]" : "⏳ [STREAMING]"} Words: "${text}"`,
              isFinal
                ? "color: #34d399; font-weight: bold;"
                : "color: #67e8f9; font-style: italic;"
            );
            setTranscript(text);
            if (isFinal && activeCallback) {
              setListening(false);
              activeCallback(text);
            }
          },
          onError: (err) => {
            console.warn("[useVoiceChat] client-whisper error:", err);
            setMicStream(null);
            setListening(false);
          },
          onEnd: () => {
            console.log("[useVoiceChat] recorder onEnd fired");
            setMicStream(null);
            setListening(false);
          },
        });

        if (recorder) {
          console.log("[useVoiceChat] recorder created, calling start()");
          recognitionRef.current = recorder;
          recorder.start();
          return;
        }
      }

      // Last fallback
      console.log("[useVoiceChat] falling back to web-speech");
      startListeningWithWebSpeech(activeCallback);
    },
    [lang, provider, startListeningWithWebSpeech, stopListening, stopSpeaking, setListening]
  );

  const speak = useCallback(
    (text: string, onSpeechFinished?: () => void) => {
      if (!text) return;
      stopSpeaking();
      setIsSpeaking(true);
      const cancelFn = serviceSpeakText(text, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          stopSpeechFnRef.current = null;
          if (onSpeechFinished) {
            onSpeechFinished();
          } else if (isVoiceModeRef.current) {
            startListening(onFinalCallbackRef.current);
          }
        },
        onError: (err) => {
          console.warn("[useVoiceChat] Voice playback error:", err);
          setIsSpeaking(false);
          stopSpeechFnRef.current = null;
          if (isVoiceModeRef.current) startListening(onFinalCallbackRef.current);
        },
      });
      stopSpeechFnRef.current = cancelFn;
    },
    [startListening, stopSpeaking]
  );

  const toggleVoiceMode = useCallback(
    (onFinalResult?: (text: string) => void) => {
      const willEnable = !isVoiceModeRef.current;
      console.log("[useVoiceChat] toggleVoiceMode called — willEnable:", willEnable);
      setIsVoiceMode(willEnable);

      if (willEnable) {
        setAutoSpeak(true);
        try { localStorage.setItem(AUTO_SPEAK_STORAGE_KEY, "true"); } catch { /* ignore */ }
        if (onFinalResult) onFinalCallbackRef.current = onFinalResult;
        startListening(onFinalResult);
      } else {
        stopListening();
        stopSpeaking();
      }
    },
    [startListening, stopListening, stopSpeaking]
  );

  return {
    isVoiceMode,
    setIsVoiceMode,
    isListening,
    isSpeaking,
    autoSpeak,
    transcript,
    setTranscript,
    micStream,
    activeProvider,
    toggleVoiceMode,
    toggleAutoSpeak,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isRecognitionSupported: isSpeechRecognitionSupported() || isMediaRecorderSupported(),
    isSynthesisSupported: isSpeechSynthesisSupported(),
  };
}

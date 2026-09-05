import React, { useEffect, useState, useRef } from "react";
import { Button } from "@mono/components";
import { X, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { ROSE_EMOTIONS } from "../agent/roseEmotions";

export interface RoseVoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  currentEmotion?: string;
  autoSpeak?: boolean;
  micStream?: MediaStream | null;
  onToggleAutoSpeak?: () => void;
}

export function RoseVoiceOverlay({
  isOpen,
  onClose,
  isListening,
  isSpeaking,
  transcript,
  currentEmotion = "happy",
  autoSpeak = true,
  micStream = null,
  onToggleAutoSpeak,
}: RoseVoiceOverlayProps) {
  const [loudness, setLoudness] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen || !micStream) {
      setLoudness(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      return;
    }

    let isMounted = true;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(micStream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLoudness = () => {
        if (!isMounted) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(1, (avg / 128) * 1.5);
        setLoudness(normalized);

        animFrameRef.current = requestAnimationFrame(updateLoudness);
      };

      updateLoudness();
    } catch (err) {
      console.warn("[RoseVoiceOverlay] AudioContext analyser error:", err);
    }

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isOpen, micStream]);

  if (!isOpen) return null;

  const avatarSrc = ROSE_EMOTIONS[currentEmotion] || "/rose/happy.png";

  const statusTitle = isSpeaking
    ? "Rose is talking to you…"
    : loudness > 0.05
    ? "Hearing you speak…"
    : "Listening… speak naturally";

  // Dynamic scale calculations based on live mic loudness
  const scale1 = 1 + loudness * 0.4;
  const scale2 = 1 + loudness * 0.75;
  const scale3 = 1 + loudness * 1.15;
  const opacity = 0.25 + loudness * 0.75;

  return (
    <div
      className="m-rose-voice-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Rose Voice Mode"
    >
      {/* Top Header Actions */}
      <div className="m-rose-voice-header">
        <div className="m-rose-voice-badge">
          <span className="m-rose-voice-dot" />
          <span>Voice Mode</span>
        </div>

        <div className="m-rose-voice-header-btns">
          {onToggleAutoSpeak && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="m-rose-voice-icon-btn"
              onClick={onToggleAutoSpeak}
              title={autoSpeak ? "Mute Voice Output" : "Enable Voice Output"}
              aria-label={autoSpeak ? "Mute Voice Output" : "Enable Voice Output"}
              icon={autoSpeak ? <Volume2 size={18} /> : <VolumeX size={18} />}
            />
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="m-rose-voice-icon-btn m-rose-voice-close-btn"
            onClick={onClose}
            title="Close Voice Mode"
            aria-label="Close Voice Mode Overlay"
            icon={<X size={20} />}
          />
        </div>
      </div>

      {/* Center Hero Stage */}
      <div className="m-rose-voice-center">
        {/* Large Avatar Stage with ambient pulsating aura + dynamic expanding loudness wave rings */}
        <div
          className={`m-rose-voice-hero-wrap ${
            isSpeaking ? "speaking" : "listening"
          }`}
        >
          {/* Dynamic Mic Loudness Rings */}
          {!isSpeaking && (
            <div className="m-rose-voice-mic-waves" aria-hidden="true">
              <div
                className="m-rose-voice-mic-ring ring-1"
                style={{
                  transform: `scale(${scale1})`,
                  opacity: opacity * 0.8,
                }}
              />
              <div
                className="m-rose-voice-mic-ring ring-2"
                style={{
                  transform: `scale(${scale2})`,
                  opacity: opacity * 0.5,
                }}
              />
              <div
                className="m-rose-voice-mic-ring ring-3"
                style={{
                  transform: `scale(${scale3})`,
                  opacity: opacity * 0.3,
                }}
              />
            </div>
          )}

          <div className="m-rose-voice-aura-outer" />
          <div className="m-rose-voice-aura-inner" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt="Rose Voice Avatar"
            className="m-rose-voice-hero-img"
            style={!isSpeaking && loudness > 0.02 ? { transform: `scale(${1 + loudness * 0.08})` } : undefined}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/rose/happy.png";
            }}
          />

          {/* Live Audio Waves under or around avatar */}
          <div className="m-rose-voice-waves-container">
            <span
              className="m-rose-voice-wave-bar wave-1"
              style={!isSpeaking ? { height: `${Math.max(6, loudness * 32)}px` } : undefined}
            />
            <span
              className="m-rose-voice-wave-bar wave-2"
              style={!isSpeaking ? { height: `${Math.max(6, loudness * 40)}px` } : undefined}
            />
            <span
              className="m-rose-voice-wave-bar wave-3"
              style={!isSpeaking ? { height: `${Math.max(6, loudness * 48)}px` } : undefined}
            />
            <span
              className="m-rose-voice-wave-bar wave-4"
              style={!isSpeaking ? { height: `${Math.max(6, loudness * 38)}px` } : undefined}
            />
            <span
              className="m-rose-voice-wave-bar wave-5"
              style={!isSpeaking ? { height: `${Math.max(6, loudness * 28)}px` } : undefined}
            />
          </div>
        </div>

        {/* Emotion & Status */}
        <div className="m-rose-voice-status-wrap">
          <h3 className="m-rose-voice-status-title">{statusTitle}</h3>
          <p className="m-rose-voice-emotion-label">
            Mood: <span className="m-rose-voice-emotion-val">{currentEmotion}</span>
          </p>
        </div>

        {/* Live Transcript / Subtitle Display */}
        <div className="m-rose-voice-transcript-card">
          {transcript ? (
            <p className="m-rose-voice-transcript-text">
              “{transcript}”
              {!isSpeaking && loudness > 0.05 && (
                <span className="m-rose-voice-live-dot" title="Listening…" />
              )}
            </p>
          ) : (
            <p className="m-rose-voice-transcript-placeholder">
              {isSpeaking
                ? "Rose is answering your prompt…"
                : loudness > 0.05
                ? "Listening to you speak…"
                : "“Say something like: Tell me a story, or what are our goals?”"}
            </p>
          )}
        </div>
      </div>

      {/* Footer info without pause button */}
      <div className="m-rose-voice-footer">
        <p className="m-rose-voice-hint">
          Always listening • Responds automatically when you finish speaking
        </p>
      </div>
    </div>
  );
}

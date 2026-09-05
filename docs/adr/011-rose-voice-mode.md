# ADR 011: Rose Voice Mode - Speech-to-Text and Text-to-Speech Companion Overlay

## Status

Accepted

## Context

Users interact with the Rose AI companion primarily through textual chat. To enable a hands-free, conversational, and natural interaction experience, a **Voice Mode** is required.
Key requirements:
1. Located near the chat input submit button for immediate discovery and ease of toggling.
2. Dimming the interface screen and presenting a large, expressive picture of Rose reflecting her active emotional state (`happy`, `bright`, `thinking`, `researching`, etc.).
3. Speech-to-Text (STT): Listening to the user's spoken words and submitting them directly as prompts to the Rose AI agent.
4. Text-to-Speech (TTS): Speaking Rose's response back to the user in a natural, warm tone.
5. Continuous dialogue cycle: Re-engaging speech recognition once Rose finishes speaking to support seamless conversation.
6. Zero API token overhead with high-accuracy speech recognition: Integrating `faster-whisper-ts` (CTranslate2/Whisper) backed by server-side route `/api/rose/transcribe` with client fallback to native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition` and `SpeechSynthesis`).

## Decision

1. **Speech Service (`@mono/rose/src/voice/speechService.ts`)**:
   - Implemented `cleanTextForSpeech`: Strips markdown formatting, Obsidian callouts/admonitions (`[!NOTE]`, `[!TIP]`, etc.), code blocks, images, wikilinks, and emotion tags `<emotion>...</emotion>` so spoken output sounds natural.
   - Browser support checks: `isSpeechSynthesisSupported()`, `isSpeechRecognitionSupported()`, and `isMediaRecorderSupported()`.
   - Voice Selection: `getBestFemaleVoice()` scans available browser voices, prioritizing natural/neural female English voices (`Microsoft Jenny Natural`, `Microsoft Aria Natural`, `Google UK English Female`, `Samantha`, etc.) with fallback to any English or default voice.
   - Chunked Speech Synthesis: `speakText()` breaks long responses into sentence chunks to prevent browser speech cutoff bugs, with cancelation and callback support.
   - Dual Speech Recognition Architecture:
     - `createFasterWhisperRecorder()` captures user microphone audio into WebM opus chunks and posts to `/api/rose/transcribe` for high-accuracy Whisper transcription.
     - `createSpeechRecognition()` wraps the browser's native Web Speech API for zero-latency, zero-dependency offline fallback.
     - `transcribeAudioBlob()` handles multipart/form-data upload to the server transcribe endpoint.

2. **Server Transcription Route (`@mono/rose/src/server.ts` & `/api/rose/transcribe`)**:
   - `handleRoseTranscribe()` dynamically loads `WhisperModel` from `faster-whisper-ts`, processes the audio buffer, and returns `{ ok: true, transcript, provider: "faster-whisper" }`.
   - If native CTranslate2 libraries are unavailable or the environment lacks compiled bindings, it cleanly responds with `{ ok: false, fallbackToClient: true }` without crashing the runtime.

3. **React Hook (`@mono/rose/src/voice/useVoiceChat.ts`)**:
   - Exposes reactive states: `isVoiceMode`, `isListening`, `isSpeaking`, `transcript`, `autoSpeak`, `activeProvider`.
   - Supports `provider: "auto" | "faster-whisper" | "web-speech"`. Under `"auto"`, it attempts faster-whisper server recording first and transparently falls back to client Web Speech STT if the server reports fallback or microphone streaming errors.
   - Controls conversation lifecycle and handles seamless turn-taking between user speech and assistant voice response.

4. **Immersive Voice Overlay (`@mono/rose/src/chat-modal/voice-overlay.tsx`)**:
   - Dims the chat view with dark ambient backdrop blur (`rgba(10, 10, 12, 0.88)` and `backdrop-filter: blur(16px)`).
   - Shows a large avatar (220px to 260px) of Rose with animated aura ring and pulse effects.
   - Displays dynamic audio wave equalizer bars when Rose speaks or when the user talks.
   - Shows live transcript text or status messages ("Listening to you…", "Rose is replying…").
   - Includes mute/mic toggle and close/exit buttons constructed with `@mono/components`.

5. **Input Bar Integration (`@mono/rose/src/chat-modal/chat-modal.tsx`)**:
   - Added Voice Mode button directly next to the Submit button in the input bar.
   - Equipped with tooltip help explaining the voice interaction.

## Consequences

- High-accuracy speech recognition via `faster-whisper-ts` with automated graceful degradation to client Web Speech API.
- Hands-free, low-friction voice conversations.
- Clean visual separation between text chat and voice companion mode via the overlay.
- Works across standard modern browsers (Chrome, Edge, Safari) and diverse hosting platforms.

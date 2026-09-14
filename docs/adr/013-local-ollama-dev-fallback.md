# ADR 013: Local Ollama Fallback for Rose in Development

- **Status**: Accepted
- **Date**: 2026-09-12

## Context

Rose's conversation pipeline (orchestrator + tool-output synthesis) depends on paid cloud APIs (Gemini for orchestration, Groq for synthesis). Every local dev turn consumes live API tokens. The team wants local development to be token-free by running against the already-installed local Ollama server using the downloaded **qwen** model, while keeping the cloud pipeline untouched for production deployments.

Deployments on Vercel set `VERCEL_URL`; local dev does not. This environment signal cleanly separates the two modes.

## Decision

**Ollama is the default provider whenever `VERCEL_URL` is absent** (local dev); the existing Gemini + Groq pipeline remains unchanged on Vercel.

### Detection

`shouldUseOllamaProvider()` in `packages/rose/src/agent/ollamaClient.ts`:
- `OLLAMA_ENABLED=false` → always cloud.
- `OLLAMA_ENABLED=true` → always Ollama.
- `auto`/unset (default) → `!process.env.VERCEL_URL`.

### Model & endpoint

- Base URL: `OLLAMA_BASE_URL` or `http://localhost:11434`.
- Model: auto-detected via `GET {base}/api/tags` — first tag matching `qwen*` (cached per process); fallback `OLLAMA_MODEL`, then `qwen2.5:3b`.

### Integration (`agentRunner.ts`, both stream + non-stream paths)

- Orchestrator call sites branch `callGeminiStream`/`callGemini` ⇄ `callOllamaStream`/`callOllamaChat`.
- The `GEMINI_API_KEY` config guard is skipped in Ollama mode.
- Tool-output synthesis branches `callGroqStream`/`callGroqWithUsage` ⇄ `callOllamaMessagesStream`/`callOllamaMessagesChat` (Groq message shape is Ollama-compatible).
- Langfuse generation labels report `ollama:<model>` and `ollama-orchestrator-turn-N`/`ollama-tool-synthesis`.
- Non-stream path now surfaces orchestrator connection errors gracefully (aligned with the stream path).

### Tool loop strategy

Ollama receives a text-only conversation history (same contents the runner already passes to Gemini). The client appends a **tool-call JSON hint** to the system instruction (`{"action": "...", "action_input": {...}}`), and the agent's existing `extractToolCallsFromText` machinery detects, executes, and loops tools — no Ollama native tool-calling required. All six tools (webSearch, askQuestion, learn, recall, remember, forget) keep working in dev.

### Web search

When no `SERPAPI_KEY` and Ollama mode is active, `webSearch` generates its synthetic JSON results with the local model instead of burning a Gemini token.

## Consequences

- **Pros**: local dev consumes zero Gemini/Groq tokens; qwen tool loop preserved; Vercel deployments byte-for-byte unchanged; manual override flags for edge cases.
- **Cons**: local tool-call reliability depends on qwen following the JSON instruction (text-flattened conversation, no native tool schema); model/history rougher than Gemini for hard cases; requests are typically slower on CPU.
- Requires running Ollama locally and `OLLAMA_BASE_URL`/`OLLAMA_MODEL` config when the default auto-detect is inappropriate.
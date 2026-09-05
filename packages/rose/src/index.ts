// Chat Modal & Views
export {
  RoseChatModalProvider,
  useRoseChatModal,
  RoseChatModalActionButton,
  RoseChatModalFloatingButton,
  RoseChatModal,
  RoseChat,
} from "./chat-modal/chat-modal";
export type {
  RoseChatModalProviderProps,
  RoseChatModalContextType,
  RoseChatModalActionButtonProps,
  RoseChatModalFloatingButtonProps,
  RoseChatModalProps,
  RoseChatProps,
  Conversation,
  DisplayMessage,
} from "./chat-modal/chat-modal";
export {
  createNewConversation,
  loadConversations,
  saveConversations,
  generateConversationTitle,
} from "./chat-modal/conversations";
export { RoseSettingsModal } from "./chat-modal/settings-modal";
export type {
  RoseMemoryItem,
  RosePersonalizationData,
  RoseSettingsModalProps,
} from "./chat-modal/settings-modal";
export { RoseVoiceOverlay } from "./chat-modal/voice-overlay";
export type { RoseVoiceOverlayProps } from "./chat-modal/voice-overlay";

// Voice & Speech Services
export {
  cleanTextForSpeech,
  isSpeechSynthesisSupported,
  isSpeechRecognitionSupported,
  isMediaRecorderSupported,
  getBestFemaleVoice,
  speakText,
  stopSpeaking,
  createSpeechRecognition,
  transcribeAudioBlob,
  createFasterWhisperRecorder,
  createClientWhisperRecorder,
} from "./voice/speechService";
export type {
  SpeakOptions,
  SpeechRecognitionController,
  SpeechRecognitionOptions,
  TranscribeAudioOptions,
  TranscribeAudioResult,
  FasterWhisperRecorderOptions,
  ClientWhisperRecorderOptions,
} from "./voice/speechService";
export { useVoiceChat } from "./voice/useVoiceChat";
export type { UseVoiceChatOptions, SpeechProvider } from "./voice/useVoiceChat";

// Agent Runner, Gemini & Emotions
export {
  runAgentChat,
  ROSE_SYSTEM_INSTRUCTION,
} from "./agent/agentRunner";
export type {
  ChatMessage,
  RunAgentResult,
} from "./agent/agentRunner";

export { callGemini } from "./agent/geminiClient";
export type {
  GeminiContent,
  GeminiPart,
  GeminiToolDeclaration,
} from "./agent/geminiClient";

export { callGroq, callGroqStream, buildGroqToolPrompt } from "./agent/groqClient";
export type {
  GroqMessage,
  GroqStreamChunk,
} from "./agent/groqClient";

export { RoseLangfuseTrace, createLangfuseTrace } from "./agent/langfuse";
export type {
  LangfuseConfig,
  TraceOptions,
  GenerationRecord,
  SpanRecord,
} from "./agent/langfuse";

export { ROSE_EMOTIONS, extractEmotion } from "./agent/roseEmotions";

// Agent Tools & Command Registry
export {
  TOOLS,
  getToolByName,
  webSearchTool,
  askQuestionTool,
  rememberTool,
  setRememberToolContext,
  clearRememberToolContext,
} from "./agent/tools/index";
export type {
  Tool,
  ToolDeclaration,
} from "./agent/tools/index";

export {
  getAgentCommandCategories,
  DEFAULT_COMMAND_CATEGORIES,
} from "./agent/commandRegistry";
export type {
  CommandCategory,
  CommandItem,
} from "./agent/commandRegistry";

// Usage & Quotas
export { UsageBar } from "./usage/usage-bar";
export type { UsageBarProps } from "./usage/usage-bar";

export {
  getRoseUsage,
  checkAndIncrementRoseUsage,
  getRoleLimits,
  currentWeek,
  currentDay,
  roseDailyLimitGuest,
  roseWeeklyLimitGuest,
  roseDailyLimitUser,
  roseWeeklyLimitUser,
} from "./usage/usage";
export type { RoseUsage } from "./usage/usage";

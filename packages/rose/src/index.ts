// Pure UI Components
export {
  RoseChatModalProvider,
  useRoseChatModal,
  RoseChatModalActionButton,
  RoseChatModalFloatingButton,
  RoseChatModal,
  RoseChat,
  RoseSettingsModal,
  RoseVoiceOverlay,
} from "./components/chat-modal";
export type {
  RoseChatModalProviderProps,
  RoseChatModalContextType,
  RoseChatModalActionButtonProps,
  RoseChatModalFloatingButtonProps,
  RoseChatModalProps,
  RoseChatProps,
  Conversation,
  DisplayMessage,
  RoseMemoryItem,
  RosePersonalizationData,
  RoseSettingsModalProps,
  RoseVoiceOverlayProps,
} from "./components/chat-modal";

export { UsageBar } from "./components/usage-bar";
export type { UsageBarProps } from "./components/usage-bar";

// Hooks
export { useVoiceChat } from "./hooks";
export type { UseVoiceChatOptions, SpeechProvider } from "./hooks";

// Utilities
export {
  getRoseApiBasePath,
  getRoseTranscribeEndpoint,
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
  createNewConversation,
  loadConversations,
  saveConversations,
  generateConversationTitle,
  getRoseUsage,
  checkAndIncrementRoseUsage,
  getRoleLimits,
  currentWeek,
  currentDay,
  roseDailyLimitGuest,
  roseWeeklyLimitGuest,
  roseDailyLimitUser,
  roseWeeklyLimitUser,
} from "./utils";
export type {
  SpeakOptions,
  SpeechRecognitionController,
  SpeechRecognitionOptions,
  TranscribeAudioOptions,
  TranscribeAudioResult,
  FasterWhisperRecorderOptions,
  ClientWhisperRecorderOptions,
} from "./utils";

// Agent Core & Tools
export {
  runAgentChat,
  runAgentChatStream,
  formatErrorCallout,
  parseErrorDetails,
  extractToolCallsFromText,
  sanitizeHistory,
  toCleanHistory,
  ROSE_EMOTIONS,
  extractEmotion,
  createLangfuseTrace,
  RoseLangfuseTrace,
  MEMORY_CONTEXT_MARKER,
  PERSONALIZATION_CONTEXT_MARKER,
  buildMemoryIndexContext,
  hasMemoryContext,
  setMemoryToolContext,
  clearMemoryToolContext,
  runWithMemoryToolContext,
  type AgentStreamEvent,
  type ChatMessage,
  type RunAgentResult,
  type MemoryToolExecutionContext,
} from "./agent";

// Types
export type { RoseUsage } from "./types";

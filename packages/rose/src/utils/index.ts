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
} from "./speechService";
export type {
  SpeakOptions,
  SpeechRecognitionController,
  SpeechRecognitionOptions,
  TranscribeAudioOptions,
  TranscribeAudioResult,
  FasterWhisperRecorderOptions,
  ClientWhisperRecorderOptions,
} from "./speechService";

export {
  createNewConversation,
  loadConversations,
  saveConversations,
  generateConversationTitle,
} from "./conversations";

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
} from "./usage";

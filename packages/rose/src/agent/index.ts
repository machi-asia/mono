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
  type AgentStreamEvent,
  type ChatMessage,
  type RunAgentResult,
  type ExtractedToolCall,
  type ParsedErrorInfo,
} from "./agentRunner";

export {
  callAiGateway,
  callAiGatewayStream,
  callGemini,
  callGeminiStream,
  getAiGatewayApiKey,
  getAiGatewayModel,
  DEFAULT_GATEWAY_URL,
  DEFAULT_GATEWAY_MODEL,
  type GatewayPart,
  type GatewayContent,
  type GatewayToolDeclaration,
  type GatewayStreamChunk,
  type GeminiPart,
  type GeminiContent,
  type GeminiToolDeclaration,
  type GeminiStreamChunk,
} from "./gatewayClient";

export {
  callGroq,
  callGroqStream,
  callGroqWithUsage,
  buildGroqToolPrompt,
} from "./groqClient";

export {
  callOllamaChat,
  callOllamaStream,
  callOllamaMessagesChat,
  callOllamaMessagesStream,
  getOllamaModelLabel,
  shouldUseOllamaProvider,
  toOllamaMessages,
  resolveOllamaBaseUrl,
  type OllamaChatMessage,
} from "./ollamaClient";

export {
  createLangfuseTrace,
  RoseLangfuseTrace,
} from "./langfuse";

export {
  MEMORY_CONTEXT_MARKER,
  PERSONALIZATION_CONTEXT_MARKER,
  toExcerpt,
  buildMemoryIndexContext,
  hasMemoryContext,
} from "./memoryContext";

export {
  getAgentCommandCategories,
} from "./commandRegistry";

export {
  TOOLS,
  getToolByName,
} from "./tools";

export {
  setMemoryToolContext,
  clearMemoryToolContext,
  runWithMemoryToolContext,
  memoryDbCreate,
  memoryDbRead,
  memoryDbUpdate,
  memoryDbDelete,
  memoryDbRecreateForTests,
  memoryDbResetForTests,
  parseImportance,
  type MemoryEntry,
  type MemoryUpdatePayload,
  type MemoryToolExecutionContext,
} from "./tools/memory-store";

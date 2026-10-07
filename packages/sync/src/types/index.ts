export type SyncInputType = "key" | "mouse" | "custom";
export type SyncActionPhase = "press" | "hold" | "release";

export interface SyncEventPayload {
  eventId: string;
  roomId: string;
  userId: string;
  phase: SyncActionPhase;
  inputType: SyncInputType;
  trigger: string;
  actionId?: string;
  payload?: Record<string, unknown>;
  durationMs?: number;
  timestamp: number;
}

export type SyncHandlerContext = {
  event: SyncEventPayload;
  isRemote: boolean;
};

export type SyncActionHandler = (
  context: SyncHandlerContext,
  ...args: any[]
) => any | Promise<any>;

export interface SyncActionRegistration {
  actionId: string;
  trigger: string;
  inputType: SyncInputType;
  handler: SyncActionHandler;
  description?: string;
  preventDefault?: boolean;
}

export interface RoomMember {
  userId: string;
  joinedAt: number;
  lastActiveAt: number;
  name?: string;
}

export interface RoomState {
  roomId: string;
  members: Record<string, RoomMember>;
  createdAt: number;
  updatedAt: number;
}

import type {
  SyncActionHandler,
  SyncActionRegistration,
  SyncEventPayload,
  SyncInputType,
} from "../types";

class ActionRegistry {
  private actions = new Map<string, SyncActionRegistration>();
  private triggerIndex = new Map<string, string>(); // "inputType:trigger" -> actionId

  private makeIndexKey(inputType: SyncInputType, trigger: string): string {
    return `${inputType.toLowerCase()}:${trigger.toLowerCase()}`;
  }

  register(
    actionId: string,
    options: {
      trigger: string;
      inputType: SyncInputType;
      handler: SyncActionHandler;
      description?: string;
      preventDefault?: boolean;
    }
  ): () => void {
    const reg: SyncActionRegistration = {
      actionId,
      trigger: options.trigger,
      inputType: options.inputType,
      handler: options.handler,
      description: options.description,
      preventDefault: options.preventDefault ?? false,
    };

    this.actions.set(actionId, reg);
    this.triggerIndex.set(
      this.makeIndexKey(options.inputType, options.trigger),
      actionId
    );

    return () => {
      this.unregister(actionId);
    };
  }

  unregister(actionId: string): void {
    const reg = this.actions.get(actionId);
    if (reg) {
      this.triggerIndex.delete(this.makeIndexKey(reg.inputType, reg.trigger));
      this.actions.delete(actionId);
    }
  }

  getAction(actionId: string): SyncActionRegistration | undefined {
    return this.actions.get(actionId);
  }

  findByTrigger(
    inputType: SyncInputType,
    trigger: string
  ): SyncActionRegistration | undefined {
    const actionId = this.triggerIndex.get(this.makeIndexKey(inputType, trigger));
    if (!actionId) return undefined;
    return this.actions.get(actionId);
  }

  listActions(): SyncActionRegistration[] {
    return Array.from(this.actions.values());
  }

  clear(): void {
    this.actions.clear();
    this.triggerIndex.clear();
  }

  async execute(
    event: SyncEventPayload,
    isRemote = false,
    ...extraArgs: any[]
  ): Promise<any> {
    // Find action by actionId or by inputType + trigger
    let action = event.actionId ? this.actions.get(event.actionId) : undefined;
    if (!action) {
      action = this.findByTrigger(event.inputType, event.trigger);
    }

    if (!action) {
      return null;
    }

    return action.handler({ event, isRemote }, ...extraArgs);
  }
}

export const syncRegistry = new ActionRegistry();

export function registerSyncAction(
  actionId: string,
  options: {
    trigger: string;
    inputType: SyncInputType;
    handler: SyncActionHandler;
    description?: string;
    preventDefault?: boolean;
  }
): () => void {
  return syncRegistry.register(actionId, options);
}

// Event Bus for user actions - Decouples actions from achievement/challenge processing

export enum UserEventType {
  REPORT_CREATED = 'REPORT_CREATED',
  REPORT_DELETED = 'REPORT_DELETED',
  ITEM_CLAIMED = 'ITEM_CLAIMED',
  ITEM_UNCLAIMED = 'ITEM_UNCLAIMED',
  LOGIN = 'LOGIN',
  DAILY_RESET = 'DAILY_RESET',
  WEEKLY_RESET = 'WEEKLY_RESET',
  MONTHLY_RESET = 'MONTHLY_RESET'
}

export interface UserEvent {
  type: UserEventType
  userId: string
  data?: {
    category?: string
    itemId?: string
    points?: number
    totalReports?: number
    totalCollected?: number
    streak?: number
    timestamp?: Date
  }
}

type EventHandler = (event: UserEvent) => Promise<void>

class EventBus {
  private handlers: Map<UserEventType, EventHandler[]> = new Map()

  subscribe(eventType: UserEventType, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }

  async emit(event: UserEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || []
    await Promise.all(handlers.map(handler => handler(event).catch(console.error)))
  }
}

export const eventBus = new EventBus()

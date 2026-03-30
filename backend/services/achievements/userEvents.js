// Event Bus for user actions - Decouples actions from achievement/challenge processing

const UserEventType = {
  REPORT_CREATED: 'REPORT_CREATED',
  REPORT_DELETED: 'REPORT_DELETED',
  ITEM_CLAIMED: 'ITEM_CLAIMED',
  ITEM_UNCLAIMED: 'ITEM_UNCLAIMED',
  LOGIN: 'LOGIN',
  DAILY_RESET: 'DAILY_RESET',
  WEEKLY_RESET: 'WEEKLY_RESET',
  MONTHLY_RESET: 'MONTHLY_RESET'
}

class EventBus {
  constructor() {
    this.handlers = new Map()
  }

  subscribe(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType).push(handler)
  }

  async emit(event) {
    const handlers = this.handlers.get(event.type) || []
    await Promise.all(handlers.map(handler => handler(event).catch(console.error)))
  }
}

const eventBus = new EventBus()

module.exports = {
  UserEventType,
  eventBus
}

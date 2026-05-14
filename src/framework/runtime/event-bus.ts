/**
 * Event Bus Runtime
 * 
 * Section 21 of LLD: "Runtime systems communicate through events."
 * Events NEVER target UI directly.
 */

export type EventListener<T = unknown> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Set<EventListener>>();

  /**
   * Subscribe to an event.
   */
  public on<T>(event: string, callback: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventSet = this.listeners.get(event)! as Set<EventListener<T>>;
    eventSet.add(callback);

    // Return un-subscribe function
    return () => {
      eventSet.delete(callback);
    };
  }

  /**
   * Emit an event.
   * Section 21: "Event emitted -> Scheduler queue -> Runtime listeners"
   */
  public emit<T>(event: string, payload: T): void {
    console.log(`[buopso] Event emitted: ${event}`, payload);
    
    const eventSet = this.listeners.get(event);
    if (!eventSet) return;

    eventSet.forEach((callback) => {
      try {
        callback(payload);
      } catch (err) {
        console.error(`[buopso] Error in event listener for ${event}:`, err);
      }
    });
  }
}

export const eventBus = new EventBus();

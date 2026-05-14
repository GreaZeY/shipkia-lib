import { useEffect } from "react";

type EventCallback = (event: unknown) => void;

// Module-level singletons — one listener per event type across the entire app
const eventCallbacks = new Map<string, Map<Element, EventCallback>>();
const globalHandlers = new Map<string, (event: Event) => void>();

/**
 * Creates and caches a single handler per event type.
 * The handler walks up from `event.target` to find a registered ancestor element.
 */
const ensureGlobalListener = (eventType: string) => {
  if (globalHandlers.has(eventType)) return;

  const handler = (event: Event) => {
    const callbacks = eventCallbacks.get(eventType);
    if (!callbacks) return;

    let target = event.target as Element | null;
    while (target) {
      const callback = callbacks.get(target);
      if (callback) {
        callback(event);
        return;
      }
      target = target.parentElement;
    }
  };

  globalHandlers.set(eventType, handler);
  window.addEventListener(eventType, handler, true); // Capture phase
};

const removeGlobalListenerIfEmpty = (eventType: string) => {
  const callbacks = eventCallbacks.get(eventType);
  if (callbacks && callbacks.size === 0) {
    const handler = globalHandlers.get(eventType);
    if (handler) {
      window.removeEventListener(eventType, handler, true);
      globalHandlers.delete(eventType);
    }
    eventCallbacks.delete(eventType);
  }
};

/**
 * Hook to register a global event listener with delegation support.
 * Uses a single capture-phase listener per event type on `window`.
 *
 * Accepts an `Element | null` directly (not a RefObject) so that the effect
 * re-runs reactively when the element mounts/unmounts.
 */
export const useGlobalEvent = (
  element: Element | null,
  eventType: string,
  callback: EventCallback,
) => {
  useEffect(() => {
    if (!element) return;

    // Register callback for this element
    let callbacks = eventCallbacks.get(eventType);
    if (!callbacks) {
      callbacks = new Map();
      eventCallbacks.set(eventType, callbacks);
    }
    callbacks.set(element, callback);

    // Ensure a global listener exists for this event type
    ensureGlobalListener(eventType);

    // Cleanup
    return () => {
      const currentCallbacks = eventCallbacks.get(eventType);
      if (currentCallbacks) {
        currentCallbacks.delete(element);
        removeGlobalListenerIfEmpty(eventType);
      }
    };
  }, [element, eventType, callback]);
};

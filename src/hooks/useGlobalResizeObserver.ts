import { useEffect } from "react";

// Global map to hold elements and their corresponding resize callbacks
const observerCallbacks = new Map<
  Element,
  (entry: ResizeObserverEntry) => void
>();

let globalObserver: ResizeObserver | null = null;

const getObserver = () => {
  if (typeof window === "undefined") return null;

  if (!globalObserver) {
    globalObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const callback = observerCallbacks.get(entry.target);
        if (callback) {
          callback(entry);
        }
      }
    });
  }
  return globalObserver;
};

/**
 * A custom hook to use a single global ResizeObserver instance for better performance.
 * @param ref The React ref of the element to observe
 * @param callback The function to call when the element resizes
 */
export const useResizeObserver = (
  ref: React.RefObject<Element | null>,
  callback: (entry: ResizeObserverEntry) => void,
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Register callback
    observerCallbacks.set(element, callback);

    // Start observing
    const observer = getObserver();
    if (observer) {
      observer.observe(element);
    }

    // Cleanup
    return () => {
      observerCallbacks.delete(element);
      if (observer) {
        observer.unobserve(element);
      }
    };
  }, [ref, callback]);
};

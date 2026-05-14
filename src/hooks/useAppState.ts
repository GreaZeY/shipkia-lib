import { useState, useEffect } from 'react';

export interface AppState {
  theme?: 'light' | 'dark';
  isSidebarExpanded: boolean;
  activeSidebarAccordion: string[]; 
}

const defaultState: AppState = {
  isSidebarExpanded: false,
  activeSidebarAccordion: []
};

// Global memory state for instantaneous access
let memoryState: AppState | null = null;
const subscribers = new Set<(state: AppState) => void>();

// Initializes state synchronously (only once)
export function initAppState(): AppState {
  if (memoryState) return memoryState;
  
  try {
    const stored = localStorage.getItem('appState');
    if (stored) {
      memoryState = { ...defaultState, ...JSON.parse(stored) };
    } else {
      // Migrate old "theme" key if it exists
      const oldTheme = localStorage.getItem('theme');
      memoryState = { 
        ...defaultState, 
        theme: oldTheme === 'dark' || oldTheme === 'light' ? oldTheme : undefined 
      };
      if (oldTheme) {
        // Clear the old isolated key and save in the unified state
        localStorage.removeItem('theme');
        localStorage.setItem('appState', JSON.stringify(memoryState));
      }
    }
  } catch (e) {
    console.warn("Failed to read AppState from localStorage", e);
    memoryState = { ...defaultState };
  }
  
  return memoryState!;
}

// Global setter that updates memory, local storage, and notifies all subscribers
export function setAppState(partial: Partial<AppState>) {
  if (!memoryState) initAppState();
  memoryState = { ...memoryState!, ...partial };
  
  try {
    localStorage.setItem('appState', JSON.stringify(memoryState));
  } catch (e) {
    console.warn("Failed to write AppState to localStorage", e);
  }
  
  subscribers.forEach(cb => cb(memoryState!));
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initAppState());

  useEffect(() => {
    // Subscribe to global updates
    const callback = (newState: AppState) => setState(newState);
    subscribers.add(callback);
    
    // Cleanup on unmount
    return () => {
      subscribers.delete(callback);
    };
  }, []);

  return [state, setAppState] as const;
}

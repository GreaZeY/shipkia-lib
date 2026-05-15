/**
 * Framework Registry Runtime
 *
 * Section 11 of LLD: "Everything extensible registers through registries."
 * Section 12 of LLD: "Extensions modify runtime behavior safely via priority."
 */

export interface RegistryEntry<T = unknown> {
  id: string;
  value: T;
  priority: number;
  metadata?: Record<string, unknown>;
}

class Registry {
  private entries = new Map<string, RegistryEntry[]>();

  /**
   * Register an item into the registry with a priority.
   * Higher priority values override lower ones.
   */
  public register<T>(key: string, value: T, priority: number = 100): void {
    if (!this.entries.has(key)) {
      this.entries.set(key, []);
    }

    const keyEntries = this.entries.get(key)!;

    // Replace if ID already exists in this key, otherwise add
    const entry: RegistryEntry<T> = { id: key, value, priority };
    keyEntries.push(entry);

    // Sort by priority (descending)
    keyEntries.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Resolve the highest priority item for a given key.
   */
  public resolve<T>(key: string, fallback?: T): T {
    const keyEntries = this.entries.get(key);
    if (!keyEntries || keyEntries.length === 0) {
      if (fallback === undefined) {
        throw new Error(`[shipkia] Registry key not found: ${key}`);
      }
      return fallback;
    }

    return keyEntries[0].value as T;
  }

  /**
   * Resolve ALL items for a key (useful for "Slots" where multiple items render).
   * Section 13: "Slots are stable runtime extension contracts."
   */
  public resolveAll<T>(key: string): T[] {
    const keyEntries = this.entries.get(key);
    if (!keyEntries) return [];
    return keyEntries.map((e) => e.value as T);
  }

  public has(key: string): boolean {
    return this.entries.has(key) && this.entries.get(key)!.length > 0;
  }

  public getKeys(): string[] {
    return Array.from(this.entries.keys());
  }
}

// Global Singleton instance (The Registry Runtime)
export const registry = new Registry();

// Legacy compatibility wrappers to prevent breaking existing code
export function register<T>(
  key: string,
  component: T,
  priority: number = 100,
): void {
  registry.register(key, component, priority);
}

export function resolve<T>(key: string, fallback: T): T {
  return registry.resolve(key, fallback);
}

export function hasOverride(key: string): boolean {
  return registry.has(key);
}

export function getRegisteredKeys(): string[] {
  return registry.getKeys();
}

export function resolveAll<T>(key: string): T[] {
  return registry.resolveAll<T>(key);
}

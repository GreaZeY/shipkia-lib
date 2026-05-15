/**
 * Dependency Injection Runtime
 *
 * Section 7 of LLD: "All runtime systems resolve dependencies through container runtime."
 * Never import runtime singletons directly.
 */

type ServiceFactory<T> = (container: Container) => T;

class Container {
  private services = new Map<string, unknown>();
  private factories = new Map<string, ServiceFactory<unknown>>();

  /**
   * Register a service instance.
   */
  public register<T>(id: string, service: T): void {
    this.services.set(id, service);
  }

  /**
   * Register a service factory (lazy loading).
   */
  public registerFactory<T>(id: string, factory: ServiceFactory<T>): void {
    this.factories.set(id, factory);
  }

  /**
   * Resolve a service by ID.
   */
  public resolve<T>(id: string): T {
    if (this.services.has(id)) {
      return this.services.get(id) as T;
    }

    if (this.factories.has(id)) {
      const factory = this.factories.get(id)!;
      const service = factory(this);
      this.services.set(id, service); // Cache the instance
      return service as T;
    }

    throw new Error(`[shipkia] Service not found in container: ${id}`);
  }

  /**
   * Check if a service exists.
   */
  public has(id: string): boolean {
    return this.services.has(id) || this.factories.has(id);
  }
}

// Global Singleton instance (The Dependency Injection Runtime)
export const container = new Container();

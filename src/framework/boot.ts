// import { register } from "@/framework/registry";
// import { container } from "@/framework/container";
// import { commandBus } from "@/framework/commands/bus";
// import { eventBus } from "@/framework/runtime/event-bus";
// import { Ability } from "@/framework/permissions/runtime";
// import type { PermissionRule } from "@/framework/permissions/runtime";
// import { metadataCompiler } from "@/framework/metadata/compiler";
import type {
  // AppManifestEntry,
  AppConfig,
  SidebarItem,
  RouteConfig,
} from "@/framework/types";

type SidebarSubscriber = (items: SidebarItem[]) => void;

/**
 * BuopsoApplication
 * Core framework singleton that bootstraps applications, manages registries,
 * and maintains global UI state (sidebar, routes, themes).
 */
export class BuopsoApplication {
  private _sidebarItems: SidebarItem[] = [];
  private _appRoutes: RouteConfig[] = [];
  private _themeOverrides: AppConfig["theme"] = {};
  private _sidebarSubscribers = new Set<SidebarSubscriber>();

  get sidebarItems(): SidebarItem[] {
    return this._sidebarItems;
  }

  get routes(): RouteConfig[] {
    return this._appRoutes;
  }

  get themeOverrides(): AppConfig["theme"] {
    return this._themeOverrides;
  }

  /** Dynamically update the sidebar navigation */
  setSidebarItems(items: SidebarItem[]) {
    this._sidebarItems = items;
    this.notifySidebarSubscribers();
  }

  /** Subscribe to sidebar changes for reactivity in UI components */
  subscribeSidebar(cb: SidebarSubscriber) {
    this._sidebarSubscribers.add(cb);
    return () => {
      this._sidebarSubscribers.delete(cb);
    };
  }

  private notifySidebarSubscribers() {
    this._sidebarSubscribers.forEach((cb) => cb([...this._sidebarItems]));
  }

  // /**
  //  * Boot the framework.
  //  * Section 8 of LLD: "Module discovered -> registries updated -> metadata compiled"
  //  */
  // async boot(apps: AppManifestEntry[]): Promise<void> {
  //   // 0. Initialize Core Runtimes in Container
  //   container.register("eventBus", eventBus);
  //   container.register("commandBus", commandBus);
  //   container.register("compiler", metadataCompiler);
  //
  //   const allPermissions: PermissionRule[] = [];
  //
  //   // 1. Load all app modules in parallel to discover their configs (and priorities)
  //   const loadedApps = await Promise.all(
  //     apps.map(async (entry) => {
  //       try {
  //         const module = await entry.config();
  //         return {
  //           entry,
  //           config: module.default,
  //         };
  //       } catch (err) {
  //         console.error(
  //           `[buopso] Failed to load app module for "${entry.name}":`,
  //           err,
  //         );
  //         return null;
  //       }
  //     }),
  //   );
  //
  //   // 2. Filter out failed loads and sort by priority (highest first)
  //   const sortedApps = loadedApps
  //     .filter(
  //       (a): a is { entry: AppManifestEntry; config: AppConfig } => a !== null,
  //     )
  //     .sort((a, b) => {
  //       const pA = a.config.priority ?? a.entry.priority ?? 100;
  //       const pB = b.config.priority ?? b.entry.priority ?? 100;
  //       return pB - pA;
  //     });
  //
  //   for (const { config, entry } of sortedApps) {
  //     const priority = config.priority ?? entry.priority ?? 100;
  //
  //     // 3. Register Overrides (UI/Components) with Priority
  //     if (config.overrides) {
  //       Object.entries(config.overrides).forEach(([key, component]) => {
  //         register(key, component, priority);
  //       });
  //     }
  //
  //     // 4. Compile and Register Permissions
  //     if (config.permissions) {
  //       const compiled = metadataCompiler.compilePermissions(config.permissions);
  //       allPermissions.push(...compiled);
  //     }
  //
  //     // 5. Register Command Handlers
  //     if (config.commands) {
  //       Object.entries(config.commands).forEach(([type, handler]) => {
  //         commandBus.registerHandler(type, handler);
  //       });
  //     }
  //
  //     // 6. Compile and Register Reactive Rules
  //     if (config.rules) {
  //       const compiledRules = metadataCompiler.compileReactiveRules(config.rules);
  //       register(
  //         `metadata:rules:${config.appName.toLowerCase()}`,
  //         compiledRules,
  //         priority,
  //       );
  //     }
  //
  //     // 7. Collect UI metadata
  //     if (config.sidebar) {
  //       this._sidebarItems = [...this._sidebarItems, ...config.sidebar];
  //     }
  //     if (config.routes) {
  //       this._appRoutes = [...this._appRoutes, ...config.routes];
  //     }
  //
  //     // 8. Merge theme overrides
  //     if (config.theme) {
  //       this._themeOverrides = {
  //         light: { ...this._themeOverrides?.light, ...config.theme.light },
  //         dark: { ...this._themeOverrides?.dark, ...config.theme.dark },
  //       };
  //     }
  //
  //     console.log(
  //       `[buopso] App "${config.appName}" loaded (priority: ${priority}).`,
  //     );
  //   }
  //
  //   // 9. Compile Final Ability Runtime
  //   container.register(
  //     "ability",
  //     new Ability(allPermissions, { id: "current-user-id" }),
  //   );
  //
  //   // 10. Finalize UI
  //   this.applyTheme();
  // }

  // /** Apply collected theme CSS variable overrides. */
  // private applyTheme(): void {
  //   if (!this._themeOverrides) return;
  //
  //   const isDark = document.documentElement.classList.contains("dark");
  //   const vars = isDark ? this._themeOverrides.dark : this._themeOverrides.light;
  //
  //   if (vars) {
  //     Object.entries(vars).forEach(([key, value]) => {
  //       document.documentElement.style.setProperty(key, value);
  //     });
  //   }
  // }
}

// Export the framework singleton instance
export const app = new BuopsoApplication();

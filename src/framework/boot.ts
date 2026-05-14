import { register } from "@/framework/registry";
import { container } from "@/framework/container";
import { commandBus } from "@/framework/commands/bus";
import { eventBus } from "@/framework/runtime/event-bus";
import { Ability } from "@/framework/permissions/runtime";
import type { PermissionRule } from "@/framework/permissions/runtime";
import { metadataCompiler } from "@/framework/metadata/compiler";
import type {
  AppManifestEntry,
  AppConfig,
  SidebarItem,
  RouteConfig,
} from "@/framework/types";

/** Collected sidebar items from all installed apps. */
let _sidebarItems: SidebarItem[] = [];

/** Collected routes from all installed apps. */
let _appRoutes: RouteConfig[] = [];

/** Collected theme overrides. */
let _themeOverrides: AppConfig["theme"] = {};

type SidebarSubscriber = (items: SidebarItem[]) => void;
const _sidebarSubscribers = new Set<SidebarSubscriber>();

export function setAppSidebarItems(items: SidebarItem[]) {
  _sidebarItems = items;
  _sidebarSubscribers.forEach((cb) => cb([..._sidebarItems]));
}

export function subscribeSidebar(cb: SidebarSubscriber) {
  _sidebarSubscribers.add(cb);
  return () => {
    _sidebarSubscribers.delete(cb);
  };
}

/**
 * Boot the framework.
 * Section 8 of LLD: "Module discovered -> registries updated -> metadata compiled"
 */
export async function bootFramework(apps: AppManifestEntry[]): Promise<void> {
  // 0. Initialize Core Runtimes in Container
  container.register("eventBus", eventBus);
  container.register("commandBus", commandBus);
  container.register("compiler", metadataCompiler);

  const allPermissions: PermissionRule[] = [];

  // 1. Load all app modules in parallel to discover their configs (and priorities)
  const loadedApps = await Promise.all(
    apps.map(async (entry) => {
      try {
        const module = await entry.config();
        return {
          entry,
          config: module.default,
        };
      } catch (err) {
        console.error(
          `[buopso] Failed to load app module for "${entry.name}":`,
          err,
        );
        return null;
      }
    }),
  );

  // 2. Filter out failed loads and sort by priority (highest first)
  // We check config.priority first, then entry.priority (manifest), then default 100.
  const sortedApps = loadedApps
    .filter(
      (a): a is { entry: AppManifestEntry; config: AppConfig } => a !== null,
    )
    .sort((a, b) => {
      const pA = a.config.priority ?? a.entry.priority ?? 100;
      const pB = b.config.priority ?? b.entry.priority ?? 100;
      return pB - pA;
    });

  for (const { config, entry } of sortedApps) {
    const priority = config.priority ?? entry.priority ?? 100;

    // 3. Register Overrides (UI/Components) with Priority
    if (config.overrides) {
      Object.entries(config.overrides).forEach(([key, component]) => {
        register(key, component, priority);
      });
    }

    // 4. Compile and Register Permissions
    if (config.permissions) {
      const compiled = metadataCompiler.compilePermissions(config.permissions);
      allPermissions.push(...compiled);
    }

    // 5. Register Command Handlers
    if (config.commands) {
      Object.entries(config.commands).forEach(([type, handler]) => {
        commandBus.registerHandler(type, handler);
      });
    }

    // 6. Compile and Register Reactive Rules
    if (config.rules) {
      const compiledRules = metadataCompiler.compileReactiveRules(config.rules);
      register(
        `metadata:rules:${config.appName.toLowerCase()}`,
        compiledRules,
        priority,
      );
    }

    // 7. Collect UI metadata
    if (config.sidebar) {
      _sidebarItems = [..._sidebarItems, ...config.sidebar];
    }
    if (config.routes) {
      _appRoutes = [..._appRoutes, ...config.routes];
    }

    // 8. Merge theme overrides
    if (config.theme) {
      _themeOverrides = {
        light: { ..._themeOverrides?.light, ...config.theme.light },
        dark: { ..._themeOverrides?.dark, ...config.theme.dark },
      };
    }

    console.log(
      `[buopso] App "${config.appName}" loaded (priority: ${priority}).`,
    );
  }

  // 9. Compile Final Ability Runtime
  container.register(
    "ability",
    new Ability(allPermissions, { id: "current-user-id" }),
  );

  // 10. Finalize UI
  applyTheme();
}

/** Apply collected theme CSS variable overrides. */
function applyTheme(): void {
  if (!_themeOverrides) return;

  const isDark = document.documentElement.classList.contains("dark");
  const vars = isDark ? _themeOverrides.dark : _themeOverrides.light;

  if (vars) {
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
}

export function getAppSidebarItems(): SidebarItem[] {
  return _sidebarItems;
}

export function getAppRoutes(): RouteConfig[] {
  return _appRoutes;
}

export function getThemeOverrides(): AppConfig["theme"] {
  return _themeOverrides;
}

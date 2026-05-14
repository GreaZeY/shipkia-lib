import type { ComponentType, LazyExoticComponent } from "react";
import type { CommandHandler } from "@/framework/commands/bus";
import type { MetadataReactiveRule } from "@/framework/metadata/compiler";
import type { PermissionRule } from "@/framework/permissions/runtime";

/** A single sidebar navigation item contributed by an app. */
export interface SidebarItem {
  label: string;
  icon: string; // lucide icon name
  route: string;
  children?: SidebarItem[];
}

/** A single route contributed by an app. */
export interface RouteConfig {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<Record<string, unknown>> | LazyExoticComponent<any>;
}

/** Theme override — CSS custom property overrides keyed by variable name. */
export interface ThemeOverrides {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

/**
 * The configuration object every app exports.
 * This is the public API for app developers.
 *
 * @example
 * // user_apps/shipkia/ui/app_config.ts
 * import type { AppConfig } from '@buopso/framework';
 *
 * const config: AppConfig = {
 *   appName: 'Shipkia',
 *   theme: {
 *     light: { '--primary': '220 90% 56%' },
 *     dark:  { '--primary': '220 90% 64%' },
 *   },
 *   sidebar: [
 *     { label: 'Orders', icon: 'package', route: '/app/shipkia/order' },
 *   ],
 *   routes: [
 *     { path: '/app/shipkia/order', component: lazy(() => import('./views/OrderList')) },
 *   ],
 *   overrides: {
 *     'view:login': lazy(() => import('./views/ShipkiaLogin')),
 *     'ui:Select.DropItem': lazy(() => import('./components/ShipkiaDropItem')),
 *   },
 * };
 * export default config;
 */
export interface AppConfig {
  appName: string;
  priority?: number;
  theme?: ThemeOverrides;
  sidebar?: SidebarItem[];
  routes?: RouteConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overrides?: Record<string, ComponentType<Record<string, unknown>> | LazyExoticComponent<any>>;
  permissions?: PermissionRule[];
  rules?: MetadataReactiveRule[];
  commands?: Record<string, CommandHandler>;
}

/** An entry in the app manifest — a pointer to an app's config. */
export interface AppManifestEntry {
  name: string;
  priority?: number;
  /** Lazy loader for the app config module. Must have a default export of AppConfig. */
  config: () => Promise<{ default: AppConfig }>;
}

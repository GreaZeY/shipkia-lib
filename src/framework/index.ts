// Public API barrel export for the framework
export { register, resolve, resolveAll, hasOverride, getRegisteredKeys } from "./registry";
export { bootFramework, getAppSidebarItems, getAppRoutes, getThemeOverrides } from "./boot";
export { installedApps } from "./app-manifest";
export { useShell } from "./runtime/shell";
export type { AppConfig, SidebarItem, RouteConfig, ThemeOverrides, AppManifestEntry } from "./types";

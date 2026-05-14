// Public API barrel export for the framework
export {
  register,
  resolve,
  resolveAll,
  hasOverride,
  getRegisteredKeys,
} from "@framework/registry";
export {
  bootFramework,
  getAppSidebarItems,
  getAppRoutes,
  getThemeOverrides,
} from "@framework/boot";
// export { installedApps } from "@framework/app-manifest";
export { useShell } from "@framework/runtime/shell";
export type {
  AppConfig,
  SidebarItem,
  RouteConfig,
  ThemeOverrides,
  AppManifestEntry,
} from "@framework/types";

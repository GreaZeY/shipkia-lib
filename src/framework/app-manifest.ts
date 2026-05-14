import type { AppConfig, AppManifestEntry } from "@/framework/types";

/**
 * App Manifest — lists all installed user apps.
 *
 * This is now automated! 
 * It uses Vite's `import.meta.glob` to discover all apps in the `user_apps/` directory.
 */

// 1. Discover all app_config.ts files in user_apps/
// Pattern: @user_apps/*/app_config.ts (using the alias defined in vite.config.ts)
const appModules = import.meta.glob<{ default: AppConfig }>("@user_apps/*/app_config.ts");

// 2. Transform the glob results into AppManifestEntry objects
export const installedApps: AppManifestEntry[] = Object.entries(appModules).map(([path, configImport]) => {
  // Extract app name from path (e.g., "@user_apps/shipkia/app_config.ts" -> "shipkia")
  const match = path.match(/@user_apps\/([^/]+)\/app_config\.ts/);
  const name = match ? match[1] : "unknown";

  return {
    name,
    // configImport is a function that returns a Promise (lazy loading)
    config: configImport,
  };
});

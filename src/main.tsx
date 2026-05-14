import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { bootFramework, installedApps } from "@/framework";
import { Shell } from "@/components/ui/Shell";
import "./index.scss";

// Phase 1: Boot framework — load all app configs, populate registry, apply theme.
// This completes BEFORE React renders, guaranteeing no flash of default UI.
await bootFramework(installedApps);

// Phase 2: Dynamic import of App AFTER boot — ensures resolve() sees the full registry.
const { default: App } = await import("@/App.tsx");

// Phase 3: Render — React only ever sees the final resolved components.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Shell>
      <App />
    </Shell>
  </StrictMode>,
);

import * as React from "react";
import { eventBus } from "@/framework/runtime/event-bus";

interface ShellProps {
  children: React.ReactNode;
}

/**
 * Shell Runtime Provider
 * 
 * Section 5 of LLD: "Shell Runtime -> Dependency Injection Runtime -> ... -> Projection Components"
 * This is the root of the "Frontend OS".
 */
export function Shell({ children }: ShellProps) {
  // Ensure core services are available globally
  // In a real boot flow, this would happen in bootFramework()
  React.useEffect(() => {
    console.log("[buopso] Shell Runtime initialized.");
    
    // Wire up global event listeners for runtime orchestration
    const unsub = eventBus.on("mutation.success", (payload) => {
      console.log("[buopso] Global sync triggered by mutation:", payload);
    });

    return () => unsub();
  }, []);

  return (
    <div id="buopso-shell" className="h-full w-full bg-background text-foreground">
      {children}
    </div>
  );
}

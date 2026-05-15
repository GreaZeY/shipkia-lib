import { eventBus } from "@/framework/runtime/event-bus";
import { useEffect, type ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
}

/**
 * Shell Runtime Provider
 *
 * Shell Runtime -> Dependency Injection Runtime -> ... -> Projection Components"
 * This is the root of the "Frontend OS".
 */
export default function Shell({ children }: ShellProps) {
  // Ensure core services are available globally
  // In a real boot flow, this would happen in bootFramework()
  useEffect(() => {
    console.log("[shipkia] Shell Runtime initialized.");

    // Wire up global event listeners for runtime orchestration
    const unsub = eventBus.on("mutation.success", (payload) => {
      console.log("[shipkia] Global sync triggered by mutation:", payload);
    });

    return () => unsub();
  }, []);

  return (
    <div
      id="shipkia-shell"
      className="h-full w-full bg-background text-foreground"
    >
      {children}
    </div>
  );
}

import { commandBus } from "@/framework/commands/bus";
import { container } from "@/framework/container";
import { eventBus } from "@/framework/runtime/event-bus";

/**
 * Access the Shell Runtime from non-shell components.
 */
export function useShell() {
  return {
    container,
    eventBus,
    commandBus,
    resolve: container.resolve.bind(container),
  };
}

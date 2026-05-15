import { container } from "@/framework/container";
import { type Ability } from "@/framework/permissions/runtime";

/**
 * Command Bus Runtime
 *
 * Section 20 of LLD: "Commands represent user intentions."
 */

export interface Command<T = unknown> {
  type: string;
  payload: T;
  metadata?: Record<string, unknown>;
}

export type CommandHandler<T = unknown> = (
  command: Command<T>,
) => Promise<unknown>;

class CommandBus {
  private handlers = new Map<string, CommandHandler>();

  /**
   * Register a handler for a specific command type.
   */
  public registerHandler(type: string, handler: CommandHandler): void {
    this.handlers.set(type, handler);
  }

  public hasHandler(type: string): boolean {
    return this.handlers.has(type);
  }

  /**
   * Dispatch a command.
   * Section 20: "Permission validation -> Workflow validation -> Execution -> Audit"
   */
  public async dispatch<T>(command: Command<T>): Promise<unknown> {
    console.log(
      `[shipkia] Dispatching command: ${command.type}`,
      command.payload,
    );

    // 1. Permission Validation
    if (container.has("ability")) {
      const ability = container.resolve<Ability>("ability");
      // This is a simplified check - in a real app, each command
      // would define which action/subject it maps to.
      if (ability.hasRules() && !ability.can("execute", command.type)) {
        throw new Error(
          `[shipkia] Permission denied for command: ${command.type}`,
        );
      }
    }

    // 2. Find Handler
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(
        `[shipkia] No handler registered for command: ${command.type}`,
      );
    }

    // 3. Execution
    try {
      const result = await handler(command);

      // 4. Audit Logging (Simplified)
      console.log(`[shipkia] Command ${command.type} completed successfully.`);

      return result;
    } catch (err) {
      console.error(`[shipkia] Command ${command.type} failed:`, err);
      throw err;
    }
  }
}

export const commandBus = new CommandBus();

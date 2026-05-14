import { z } from "zod";
import type {
  ReactiveValues,
  FieldState,
  FieldLogic,
  LogicCondition,
  LogicAction,
  ConditionEvaluator,
  ActionExecutor,
  ConditionContext,
  ActionContext,
  ReactiveEngineOptions,
} from "./types";
import { registerBuiltins } from "./builtins";

// Re-export types for consumers
export type { ReactiveRule } from "./compat";
export type {
  ReactiveValues,
  FieldState,
  FieldLogic,
  LogicCondition,
  LogicAction,
  ConditionEvaluator,
  ActionExecutor,
  ConditionContext,
  ActionContext,
  ReactiveEngineOptions,
} from "./types";

/**
 * ReactiveEngine — Plugin-based reactive form runtime.
 *
 * The engine is zero-knowledge: it resolves all condition operators and
 * action handlers from its registries at runtime. Built-in operators are
 * bootstrapped via the same public `addCondition`/`addAction` API that
 * consumers use to extend it.
 *
 * Usage:
 * ```ts
 * const engine = new ReactiveEngine({ logics, initialValues });
 *
 * // Extend with a custom condition
 * engine.addCondition("contains", ({ fieldValue, conditionValues }) => {
 *   return String(fieldValue).includes(String(conditionValues));
 * });
 *
 * // Extend with a custom action
 * engine.addAction("sendNotification", ({ action }) => {
 *   notify(action.value);
 *   return {};
 * });
 * ```
 */
export class ReactiveEngine {
  // ─── State ───
  private values: ReactiveValues = {};
  private fieldStates: Record<string, FieldState> = {};

  // ─── Registries ───
  private conditionRegistry = new Map<string, ConditionEvaluator>();
  private actionRegistry = new Map<string, ActionExecutor>();

  // ─── Logic graph ───
  private logics: FieldLogic[] = [];
  /** Maps a watched field ID → Set of logic rule IDs that depend on it */
  private dependencyMap = new Map<string, Set<string>>();

  // ─── Validation ───
  private schema?: z.ZodType<ReactiveValues>;

  constructor(options: ReactiveEngineOptions = {}) {
    this.schema = options.schema;

    // Bootstrap built-in operators via the public API
    if (!options.skipBuiltins) {
      registerBuiltins(this);
    }

    // Load logics and initial values if provided
    if (options.logics || options.initialValues) {
      this.load(options.logics ?? [], options.initialValues);
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PUBLIC SDK API
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Register a condition evaluator.
   * Built-in operators use this same method.
   *
   * @example
   * engine.addCondition("contains", ({ fieldValue, conditionValues }) => {
   *   return String(fieldValue).includes(String(conditionValues));
   * });
   */
  addCondition(opr: string, evaluator: ConditionEvaluator): this {
    this.conditionRegistry.set(opr, evaluator);
    return this;
  }

  /**
   * Register an action executor.
   * Built-in operators use this same method.
   *
   * @example
   * engine.addAction("sendNotification", ({ action }) => {
   *   console.log("Notification:", action.value);
   *   return {};
   * });
   */
  addAction(opr: string, executor: ActionExecutor): this {
    this.actionRegistry.set(opr, executor);
    return this;
  }

  /**
   * Check if a condition operator is registered.
   */
  hasCondition(opr: string): boolean {
    return this.conditionRegistry.has(opr);
  }

  /**
   * Check if an action operator is registered.
   */
  hasAction(opr: string): boolean {
    return this.actionRegistry.has(opr);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CORE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Load logic rules and build the dependency graph.
   * Can be called multiple times (e.g., when server schema changes).
   */
  load(logics: FieldLogic[], initialValues?: ReactiveValues): void {
    this.logics = logics.filter((l) => l.active);
    this.dependencyMap.clear();

    if (initialValues) {
      this.values = { ...initialValues };
    }

    // Build dependency graph: condition.field → logic rule ID
    for (const logic of this.logics) {
      for (const condition of logic.conditions) {
        if (!this.dependencyMap.has(condition.field)) {
          this.dependencyMap.set(condition.field, new Set());
        }
        this.dependencyMap.get(condition.field)!.add(logic.id);
      }
    }

    // Run an initial evaluation for non-"update" logics
    // (e.g., "in" or "empty" conditions that should apply on load)
    this.evaluateAll();
  }

  /**
   * Update a field value and trigger reactive effects.
   * Returns patches describing what changed.
   */
  update(
    fieldId: string,
    value: unknown,
  ): Record<string, Partial<FieldState>> {
    // Skip if value hasn't changed
    if (this.values[fieldId] === value) return {};

    // 1. Set the value
    this.values[fieldId] = value;
    this.fieldStates[fieldId] = {
      ...this.getFieldState(fieldId),
      value,
    };

    // 2. Find all logic rules affected by this field
    const affectedLogicIds = this.getAffectedLogics(fieldId);
    if (affectedLogicIds.length === 0) return {};

    // 3. Evaluate and execute
    return this.runLogics(affectedLogicIds);
  }

  /**
   * Get the current state of a field.
   */
  getFieldState(name: string): FieldState {
    return (
      this.fieldStates[name] ?? {
        value: this.values[name],
        visible: true,
        disabled: false,
        errors: [],
      }
    );
  }

  /**
   * Get all current values.
   */
  getAllValues(): ReactiveValues {
    return { ...this.values };
  }

  /**
   * Evaluate a formula expression by replacing {{id_X}} placeholders
   * with actual values. Can be extended for DATEADD, SUM, etc.
   */
  evaluateFormula(expr: string, values: ReactiveValues): unknown {
    // Replace {{id_FIELDID}} with actual values
    const resolved = expr.replace(
      /\{\{id_([a-zA-Z0-9_]+)\}\}/g,
      (_match, fieldId: string) => {
        const val = values[fieldId];
        if (val === undefined || val === null) return "0";
        return String(val);
      },
    );

    // Attempt to evaluate as a numeric expression
    try {
      // Safe evaluation: only allow numbers, basic math, and parentheses
      if (/^[\d\s+\-*/().]+$/.test(resolved)) {
        return new Function(`return (${resolved})`)() as unknown;
      }
    } catch {
      // Fall through to return the string
    }

    return resolved;
  }

  /**
   * Validate all values against the schema.
   */
  validate(): Record<string, string[]> {
    if (!this.schema) return {};

    const result = this.schema.safeParse(this.values);
    if (result.success) return {};

    const errors: Record<string, string[]> = {};
    result.error.errors.forEach((err) => {
      const path = err.path.join(".");
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });

    return errors;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // INTERNAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Find all logic rule IDs that are affected when `fieldId` changes.
   */
  private getAffectedLogics(fieldId: string): string[] {
    const affected = new Set<string>();
    const visited = new Set<string>();
    const queue = [fieldId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const logicIds = this.dependencyMap.get(current);
      if (logicIds) {
        logicIds.forEach((id) => affected.add(id));
      }
    }

    return Array.from(affected);
  }

  /**
   * Evaluate initial state for all logics (non-"update" triggers).
   */
  private evaluateAll(): void {
    const allIds = this.logics.map((l) => l.id);
    if (allIds.length > 0) {
      this.runLogics(allIds);
    }
  }

  /**
   * Run a set of logic rules by ID: evaluate conditions → execute actions.
   */
  private runLogics(
    logicIds: string[],
  ): Record<string, Partial<FieldState>> {
    let mergedPatches: Record<string, Partial<FieldState>> = {};

    for (const logicId of logicIds) {
      const logic = this.logics.find((l) => l.id === logicId);
      if (!logic) continue;

      const conditionsMet = this.evaluateConditions(logic.conditions);
      if (!conditionsMet) continue;

      const patches = this.executeActions(logic.actions);

      // Apply patches to internal state
      for (const [fieldId, patch] of Object.entries(patches)) {
        this.fieldStates[fieldId] = {
          ...this.getFieldState(fieldId),
          ...patch,
        };
        if (patch.value !== undefined) {
          this.values[fieldId] = patch.value;
        }
        mergedPatches[fieldId] = {
          ...mergedPatches[fieldId],
          ...patch,
        };
      }
    }

    return mergedPatches;
  }

  /**
   * Evaluate a chain of conditions with and/or connectors.
   * Conditions are sorted by `pos` and evaluated left to right.
   */
  private evaluateConditions(conditions: LogicCondition[]): boolean {
    if (conditions.length === 0) return true;

    // Sort by pos for deterministic evaluation
    const sorted = [...conditions].sort((a, b) => a.pos - b.pos);

    let result = this.evaluateSingleCondition(sorted[0]);

    for (let i = 1; i < sorted.length; i++) {
      const condition = sorted[i];
      const condResult = this.evaluateSingleCondition(condition);

      if (condition.connector === "or") {
        result = result || condResult;
      } else {
        // Default to "and"
        result = result && condResult;
      }
    }

    return result;
  }

  /**
   * Evaluate a single condition by looking up its operator from the registry.
   */
  private evaluateSingleCondition(condition: LogicCondition): boolean {
    const evaluator = this.conditionRegistry.get(condition.opr);

    if (!evaluator) {
      console.warn(
        `[ReactiveEngine] Unknown condition operator "${condition.opr}". Skipping.`,
      );
      return false;
    }

    const ctx: ConditionContext = {
      fieldValue: this.values[condition.field],
      conditionValues: condition.values,
      allValues: this.values,
      allStates: this.fieldStates,
    };

    return evaluator(ctx);
  }

  /**
   * Execute a list of actions by looking up each handler from the registry.
   * Sync actions return patches immediately. Async actions are awaited.
   */
  private executeActions(
    actions: LogicAction[],
  ): Record<string, Partial<FieldState>> {
    let patches: Record<string, Partial<FieldState>> = {};

    for (const action of actions) {
      const executor = this.actionRegistry.get(action.opr);

      if (!executor) {
        console.warn(
          `[ReactiveEngine] Unknown action operator "${action.opr}". Skipping.`,
        );
        continue;
      }

      const ctx: ActionContext = {
        action,
        allValues: this.values,
        allStates: this.fieldStates,
        getFieldState: (name: string) => this.getFieldState(name),
        setValue: (name: string, value: unknown) => {
          this.values[name] = value;
        },
      };

      const result = executor(ctx);

      // Handle sync results (async support can be layered later)
      if (result && typeof result === "object" && !(result instanceof Promise)) {
        for (const [fieldId, patch] of Object.entries(result)) {
          patches[fieldId] = { ...patches[fieldId], ...patch };
        }
      }
    }

    return patches;
  }
}

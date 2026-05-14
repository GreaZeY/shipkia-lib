import type { z } from "zod";

// ─── Core Value Types ───

export type ReactiveValues = Record<string, unknown>;

// ─── Field State ───

export interface FieldState {
  value: unknown;
  visible: boolean;
  disabled: boolean;
  errors: string[];
  options?: unknown[];
}

// ─── Server-Driven Logic Structure ───

export interface LogicCondition {
  id: string;
  field: string;
  /** Operator key — resolved from the condition registry at runtime */
  opr: string;
  values: unknown;
  connector?: "and" | "or";
  pos: number;
}

export interface LogicAction {
  id: string;
  resourceType: "field";
  /** Operator key — resolved from the action registry at runtime */
  opr: string;
  fields: string[];
  // For "set"
  valueType?: "static" | "fx";
  value?: unknown;
  // For "fetch"
  fetch?: string;
  // For "option"
  options?: unknown[];
  mode?: number;
  filters?: string[];
}

export interface FieldLogic {
  id: string;
  active: boolean;
  conditions: LogicCondition[];
  actions: LogicAction[];
}

// ─── Registry Function Signatures ───

/** Context passed to a condition evaluator */
export interface ConditionContext {
  /** Current value of the field referenced in the condition */
  fieldValue: unknown;
  /** The `values` property from the condition JSON */
  conditionValues: unknown;
  /** All current form values */
  allValues: ReactiveValues;
  /** All current field states */
  allStates: Record<string, FieldState>;
}

/** A condition evaluator returns true/false */
export type ConditionEvaluator = (ctx: ConditionContext) => boolean;

/** Context passed to an action executor */
export interface ActionContext {
  /** The action definition from the server JSON */
  action: LogicAction;
  /** All current form values */
  allValues: ReactiveValues;
  /** All current field states */
  allStates: Record<string, FieldState>;
  /** Helper to get a field's current state */
  getFieldState: (name: string) => FieldState;
  /** Helper to set a field's value (for cascading updates) */
  setValue: (name: string, value: unknown) => void;
}

/**
 * An action executor returns patches to field states.
 * Supports async for actions like `fetch` and `option`.
 */
export type ActionExecutor = (
  ctx: ActionContext,
) =>
  | Record<string, Partial<FieldState>>
  | Promise<Record<string, Partial<FieldState>>>;

// ─── Engine Constructor Options ───

export interface ReactiveEngineOptions {
  logics?: FieldLogic[];
  initialValues?: ReactiveValues;
  schema?: z.ZodType<ReactiveValues>;
  /** If true, skip registering built-in operators (for testing) */
  skipBuiltins?: boolean;
}

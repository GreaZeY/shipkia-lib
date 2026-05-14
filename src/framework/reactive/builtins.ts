import type { ReactiveEngine } from "./engine";
import type { FieldState } from "./types";

/**
 * Register all built-in operators on an engine instance.
 *
 * Uses the exact same `addCondition` / `addAction` public API
 * that consumers use to add custom operators. No special internals.
 */
export function registerBuiltins(engine: ReactiveEngine): void {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CONDITION EVALUATORS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * "update" — fires whenever the watched field changes.
   * Always returns true because the dependency graph already ensures
   * this logic only runs when the field actually updates.
   */
  engine.addCondition("update", () => true);

  /**
   * "empty" — true when the field has no value.
   */
  engine.addCondition("empty", ({ fieldValue }) => {
    return (
      fieldValue === undefined ||
      fieldValue === null ||
      fieldValue === "" ||
      (Array.isArray(fieldValue) && fieldValue.length === 0)
    );
  });

  /**
   * "notEmpty" — true when the field has a value.
   */
  engine.addCondition("notEmpty", ({ fieldValue }) => {
    if (Array.isArray(fieldValue)) return fieldValue.length > 0;
    return (
      fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
    );
  });

  /**
   * "in" — true when the field's value is in the provided array.
   */
  engine.addCondition("in", ({ fieldValue, conditionValues }) => {
    const arr = Array.isArray(conditionValues) ? conditionValues : [];
    return arr.includes(fieldValue);
  });

  /**
   * "notIn" — true when the field's value is NOT in the provided array.
   */
  engine.addCondition("notIn", ({ fieldValue, conditionValues }) => {
    const arr = Array.isArray(conditionValues) ? conditionValues : [];
    return !arr.includes(fieldValue);
  });

  /**
   * "eq" — strict equality.
   */
  engine.addCondition("eq", ({ fieldValue, conditionValues }) => {
    return fieldValue === conditionValues;
  });

  /**
   * "neq" — strict inequality.
   */
  engine.addCondition("neq", ({ fieldValue, conditionValues }) => {
    return fieldValue !== conditionValues;
  });

  /**
   * Numeric comparisons.
   */
  engine.addCondition("gt", ({ fieldValue, conditionValues }) => {
    return Number(fieldValue) > Number(conditionValues);
  });

  engine.addCondition("gte", ({ fieldValue, conditionValues }) => {
    return Number(fieldValue) >= Number(conditionValues);
  });

  engine.addCondition("lt", ({ fieldValue, conditionValues }) => {
    return Number(fieldValue) < Number(conditionValues);
  });

  engine.addCondition("lte", ({ fieldValue, conditionValues }) => {
    return Number(fieldValue) <= Number(conditionValues);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACTION EXECUTORS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * "set" — set a field's value (static or formula).
   */
  engine.addAction("set", ({ action, allValues }) => {
    const patches: Record<string, Partial<FieldState>> = {};
    const value =
      action.valueType === "fx"
        ? engine.evaluateFormula(String(action.value), allValues)
        : action.value;

    for (const fieldId of action.fields) {
      patches[fieldId] = { value };
    }
    return patches;
  });

  /**
   * "unset" — clear/reset a field or grid.
   */
  engine.addAction("unset", ({ action }) => {
    const patches: Record<string, Partial<FieldState>> = {};
    for (const fieldId of action.fields) {
      patches[fieldId] = { value: undefined };
    }
    return patches;
  });

  /**
   * "hide" — hide the target field(s).
   */
  engine.addAction("hide", ({ action }) => {
    const patches: Record<string, Partial<FieldState>> = {};
    for (const fieldId of action.fields) {
      patches[fieldId] = { visible: false };
    }
    return patches;
  });

  /**
   * "show" — show the target field(s).
   */
  engine.addAction("show", ({ action }) => {
    const patches: Record<string, Partial<FieldState>> = {};
    for (const fieldId of action.fields) {
      patches[fieldId] = { visible: true };
    }
    return patches;
  });

  /**
   * "disable" — disable the target field(s).
   */
  engine.addAction("disable", ({ action }) => {
    const patches: Record<string, Partial<FieldState>> = {};
    for (const fieldId of action.fields) {
      patches[fieldId] = { disabled: true };
    }
    return patches;
  });

  /**
   * "enable" — enable the target field(s).
   */
  engine.addAction("enable", ({ action }) => {
    const patches: Record<string, Partial<FieldState>> = {};
    for (const fieldId of action.fields) {
      patches[fieldId] = { disabled: false };
    }
    return patches;
  });

  /**
   * "fetch" — stub. Override via engine.addAction("fetch", customHandler)
   * in the consuming component to make API calls.
   */
  engine.addAction("fetch", () => ({}));

  /**
   * "option" — stub. Override via engine.addAction("option", customHandler)
   * in the consuming component to filter select options.
   */
  engine.addAction("option", ({ action }) => {
    const patches: Record<string, Partial<FieldState>> = {};
    for (const fieldId of action.fields) {
      patches[fieldId] = { options: action.options ?? [] };
    }
    return patches;
  });
}

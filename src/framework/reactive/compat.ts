import type { ReactiveValues } from "./types";

/**
 * Legacy ReactiveRule type — backward compatibility shim.
 *
 * The old engine used this format with JS functions for `compute` and `when`.
 * The new engine uses server-driven `FieldLogic` with registered operators.
 *
 * This type is kept so existing code that imports `ReactiveRule` doesn't break.
 * To convert legacy rules to the new format, use `convertLegacyRules()`.
 */
export type ReactiveAction =
  | "show"
  | "hide"
  | "enable"
  | "disable"
  | "setValue";

export interface ReactiveRule {
  id: string;
  dependencies: string[];
  compute?: (data: ReactiveValues) => unknown;
  when?: (data: ReactiveValues) => boolean;
  then?: {
    action: ReactiveAction;
    target: string;
    value?: unknown;
  }[];
}

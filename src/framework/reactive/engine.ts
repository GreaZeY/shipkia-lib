import { z } from "zod";

export type ReactiveAction = "show" | "hide" | "enable" | "disable" | "setValue";
export type ReactiveValues = Record<string, unknown>;

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

export interface FieldState {
  value: unknown;
  visible: boolean;
  disabled: boolean;
  errors: string[];
}

/**
 * ReactiveEngine: The "Brain" of the business runtime.
 * Manages a directed graph of field dependencies and executes rules transactionally.
 * 
 * Section 24 of LLD: "Fields are NOT components. Fields are: Reactive Runtime Nodes."
 */
export class ReactiveEngine {
  private values: ReactiveValues = {};
  private fieldStates: Record<string, FieldState> = {};
  private rules: ReactiveRule[] = [];
  private dependencyMap: Record<string, Set<string>> = {}; // source -> [target rules]
  private schema?: z.ZodType<ReactiveValues>;

  constructor(metadata: { rules: ReactiveRule[]; schema?: z.ZodType<ReactiveValues>; initialValues?: ReactiveValues }) {
    this.rules = metadata.rules;
    this.schema = metadata.schema;
    this.values = { ...metadata.initialValues };
    
    // Build the dependency graph
    this.rules.forEach(rule => {
      rule.dependencies.forEach(dep => {
        if (!this.dependencyMap[dep]) this.dependencyMap[dep] = new Set();
        this.dependencyMap[dep].add(rule.id);
      });
    });

    // Initial evaluation
    this.evaluateAll();
  }

  /**
   * Update a value and trigger reactive effects.
   * Section 23 of LLD: "All runtime updates are transactional."
   */
  public update(name: string, value: unknown): Record<string, Partial<FieldState>> {
    if (this.values[name] === value) return {};
    
    this.values[name] = value;
    this.fieldStates[name] = {
      ...this.getFieldState(name),
      value,
    };
    const affectedRules = this.getAffectedRules(name);
    
    return this.executeRules(affectedRules);
  }

  public getFieldState(name: string): FieldState {
    return this.fieldStates[name] || {
      value: this.values[name],
      visible: true,
      disabled: false,
      errors: []
    };
  }

  public getAllValues(): ReactiveValues {
    return { ...this.values };
  }

  private getAffectedRules(name: string): string[] {
    const affected = new Set<string>();
    const queue = [name];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const rules = this.dependencyMap[current];
      if (rules) {
        rules.forEach(ruleId => {
          if (!affected.has(ruleId)) {
            affected.add(ruleId);
            // If a rule changes a value, we'd need to add its target to the queue
            // but for simplicity, we'll start with one-level deep.
          }
        });
      }
    }

    return Array.from(affected);
  }

  private evaluateAll() {
    const allRuleIds = this.rules.map(r => r.id);
    this.executeRules(allRuleIds);
  }

  private executeRules(ruleIds: string[]): Record<string, Partial<FieldState>> {
    const patches: Record<string, Partial<FieldState>> = {};

    ruleIds.forEach(id => {
      const rule = this.rules.find(r => r.id === id);
      if (!rule) return;

      // 1. Compute Logic
      if (rule.compute) {
        const newValue = rule.compute(this.values);
        if (this.values[rule.id] !== newValue) {
          this.values[rule.id] = newValue;
          this.fieldStates[rule.id] = {
            ...this.getFieldState(rule.id),
            value: newValue,
          };
          patches[rule.id] = { ...patches[rule.id], value: newValue };
        }
      }

      // 2. Conditional Logic (Show/Hide/Enable/Disable)
      if (rule.when && rule.then) {
        const conditionMet = rule.when(this.values);
        rule.then.forEach(effect => {
          const targetState = this.getFieldState(effect.target);
          let changed = false;

          if (effect.action === "show" || effect.action === "hide") {
            const visible = effect.action === "show" ? conditionMet : !conditionMet;
            if (targetState.visible !== visible) {
              patches[effect.target] = { ...patches[effect.target], visible };
              changed = true;
            }
          }

          if (effect.action === "enable" || effect.action === "disable") {
            const disabled = effect.action === "disable" ? conditionMet : !conditionMet;
            if (targetState.disabled !== disabled) {
              patches[effect.target] = { ...patches[effect.target], disabled };
              changed = true;
            }
          }
          
          if (changed) {
            this.fieldStates[effect.target] = { 
              ...this.getFieldState(effect.target), 
              ...patches[effect.target] 
            };
          }
        });
      }
    });

    return patches;
  }

  public validate(): Record<string, string[]> {
    if (!this.schema) return {};
    
    const result = this.schema.safeParse(this.values);
    if (result.success) return {};

    const errors: Record<string, string[]> = {};
    result.error.errors.forEach(err => {
      const path = err.path.join(".");
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });

    return errors;
  }
}

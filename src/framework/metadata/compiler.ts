import { type ReactiveRule } from "@/framework/reactive/engine";
import { type PermissionRule } from "@/framework/permissions/runtime";

export interface MetadataReactiveRule {
  id: string;
  dependencies?: string[];
  compute?: string;
  when?: string;
  then?: ReactiveRule["then"];
}

/**
 * Metadata Compiler
 * 
 * Section 10 of LLD: "Normalize metadata -> Build dependency graphs -> Compile expressions"
 * Section 9 of LLD: "Metadata must remain serializable... NEVER ALLOW functions."
 */
export class MetadataCompiler {
  /**
   * Compiles serializable JSON rules into ReactiveRule objects with executable logic.
   */
  public compileReactiveRules(json: MetadataReactiveRule[]): ReactiveRule[] {
    return json.map((rule) => {
      const compiled: ReactiveRule = {
        id: rule.id,
        dependencies: rule.dependencies || [],
      };

      if (rule.compute) {
        const expression = rule.compute;
        compiled.compute = (data) => this.evaluateExpression(expression, data);
      }

      if (rule.when) {
        const expression = rule.when;
        compiled.when = (data) => Boolean(this.evaluateExpression(expression, data));
      }

      if (rule.then) {
        compiled.then = rule.then;
      }

      return compiled;
    });
  }

  /**
   * Compiles serializable JSON permissions.
   */
  public compilePermissions(json: PermissionRule[]): PermissionRule[] {
    return json.map((rule) => ({
      action: rule.action,
      subject: rule.subject,
      conditions: rule.conditions,
    }));
  }

  /**
   * Simple Expression Evaluator
   * In a production LLD, this would use a more robust parser (like jexl or a custom AST).
   * For now, we'll support basic arithmetic and comparisons.
   */
  private evaluateExpression(expression: string, data: Record<string, unknown>): unknown {
    if (typeof expression !== "string") return expression;

    const trimmed = expression.trim();

    try {
      const comparison = trimmed.match(
        /^(.+?)\s*(===|!==|>=|<=|>|<)\s*(.+)$/,
      );

      if (comparison) {
        const [, leftRaw, operator, rightRaw] = comparison;
        if (!leftRaw || !operator || !rightRaw) return undefined;

        const left = this.resolveOperand(leftRaw, data);
        const right = this.resolveOperand(rightRaw, data);
        const leftComparable = left as string | number;
        const rightComparable = right as string | number;

        switch (operator) {
          case "===":
            return left === right;
          case "!==":
            return left !== right;
          case ">=":
            return leftComparable >= rightComparable;
          case "<=":
            return leftComparable <= rightComparable;
          case ">":
            return leftComparable > rightComparable;
          case "<":
            return leftComparable < rightComparable;
        }
      }

      return this.resolveOperand(trimmed, data);
    } catch (err) {
      console.warn(`[buopso] Expression evaluation failed: ${expression}`, err);
      return undefined;
    }
  }

  private resolveOperand(rawOperand: string, data: Record<string, unknown>): unknown {
    const operand = rawOperand.trim();

    if (
      (operand.startsWith('"') && operand.endsWith('"')) ||
      (operand.startsWith("'") && operand.endsWith("'"))
    ) {
      return operand.slice(1, -1);
    }

    if (operand === "true") return true;
    if (operand === "false") return false;
    if (operand === "null") return null;
    if (operand === "undefined") return undefined;

    const numeric = Number(operand);
    if (!Number.isNaN(numeric) && operand !== "") return numeric;

    return operand.split(".").reduce<unknown>((value, key) => {
      if (value && typeof value === "object") {
        return (value as Record<string, unknown>)[key];
      }
      return undefined;
    }, data);
  }
}

export const metadataCompiler = new MetadataCompiler();

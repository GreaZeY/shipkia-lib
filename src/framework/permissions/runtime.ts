/**
 * Permission Runtime (Capability System)
 * 
 * Section 17 of LLD: "Permissions are NOT role checks. Permissions are Capability Runtime System."
 */

export interface PermissionRule {
  action: string;
  subject: string;
  conditions?: Record<string, unknown>;
}

export class Ability {
  private rules: PermissionRule[] = [];
  private userContext: Record<string, unknown> = {};

  constructor(rules: PermissionRule[], userContext: Record<string, unknown>) {
    this.rules = rules;
    this.userContext = userContext;
  }

  public hasRules(): boolean {
    return this.rules.length > 0;
  }

  /**
   * Main check function.
   * Section 17: "Can user perform action in current runtime context?"
   */
  public can(action: string, subject: string, object?: Record<string, unknown>): boolean {
    const relevantRules = this.rules.filter(
      (r) => r.action === action && (r.subject === subject || r.subject === "all")
    );

    if (relevantRules.length === 0) return false;

    // If any rule matches and passes conditions, permission is granted
    return relevantRules.some((rule) => {
      if (!rule.conditions) return true;
      return this.evaluateConditions(rule.conditions, object);
    });
  }

  /**
   * Evaluate dynamic conditions (e.g., ownerId: '$user.id')
   */
  private evaluateConditions(
    conditions: Record<string, unknown>,
    object: Record<string, unknown> | undefined,
  ): boolean {
    if (!object) return false;

    return Object.entries(conditions).every(([key, expectedValue]) => {
      let actualExpected = expectedValue;

      // Handle variable substitution (e.g., '$user.id')
      if (typeof expectedValue === "string" && expectedValue.startsWith("$user.")) {
        const userKey = expectedValue.split(".")[1];
        actualExpected = this.userContext[userKey];
      }

      return object[key] === actualExpected;
    });
  }
}

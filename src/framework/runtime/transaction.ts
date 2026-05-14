import { scheduler } from "@/framework/runtime/scheduler";

/**
 * Transaction Runtime
 * 
 * Section 23 of LLD: "All runtime updates are transactional."
 * BEGIN -> Snapshot -> Patch -> COMMIT
 */

export interface TransactionPatch {
  [key: string]: unknown;
}

export class Transaction<TState extends Record<string, unknown> = Record<string, unknown>> {
  private snapshot: TState;
  private patches: TransactionPatch[] = [];
  private onCommit: (finalData: TState, patches: TransactionPatch) => void;

  constructor(initialState: TState, onCommit: (finalData: TState, patches: TransactionPatch) => void) {
    this.snapshot = structuredClone(initialState);
    this.onCommit = onCommit;
  }

  /**
   * Add a patch to the transaction.
   */
  public addPatch(patch: TransactionPatch): void {
    this.patches.push(patch);
  }

  /**
   * Commit the transaction through the Scheduler.
   * Section 23: "Evaluate runtime effects -> merge patches -> COMMIT"
   */
  public commit(): void {
    scheduler.enqueue(() => {
      const finalData = { ...this.snapshot };
      const mergedPatch: TransactionPatch = {};

      this.patches.forEach((patch) => {
        Object.entries(patch).forEach(([key, value]) => {
          finalData[key as keyof TState] = value as TState[keyof TState];
          mergedPatch[key] = value;
        });
      });

      console.log(`[buopso] Committing transaction with ${this.patches.length} patches.`);
      this.onCommit(finalData, mergedPatch);
    });
  }

  public rollback(): void {
    console.warn("[buopso] Transaction rolled back to snapshot.");
    this.onCommit(this.snapshot, {});
  }
}

import { useState, useCallback } from "react";
import { commandBus } from "@/framework/commands/bus";
import { type ReactiveRule } from "@/framework/reactive/engine";

type ListRow = Record<string, unknown>;

export interface ListRuntimeOptions {
  doctype: string;
  initialData: ListRow[];
  rules?: ReactiveRule[];
  defaultSort?: { column: string; direction: "asc" | "desc" };
}

/**
 * List Runtime Hook
 *
 * Section 25 of LLD: "List views are NOT tables. They are Business Operating Surfaces."
 * Orchestrates filtering, sorting, personalization, and command dispatch.
 */
export function useListRuntime({
  doctype,
  initialData,
  rules = [],
  defaultSort,
}: ListRuntimeOptions) {
  const [data, setData] = useState(initialData);
  const [sort, setSort] = useState(defaultSort);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  // Section 29: Personalization Runtime
  // Load column widths/order from localStorage
  const [columnConfigs, setColumnConfigs] = useState<Record<string, unknown>>(
    () => {
      const saved = localStorage.getItem(`shipkia.list.${doctype}.columns`);
      return saved ? JSON.parse(saved) : {};
    },
  );

  const saveColumnConfig = useCallback(
    (colId: string, config: Record<string, unknown>) => {
      setColumnConfigs((prev) => {
        const previousConfig =
          prev[colId] && typeof prev[colId] === "object"
            ? (prev[colId] as Record<string, unknown>)
            : {};
        const updated = { ...prev, [colId]: { ...previousConfig, ...config } };
        localStorage.setItem(
          `shipkia.list.${doctype}.columns`,
          JSON.stringify(updated),
        );
        return updated;
      });
    },
    [doctype],
  );

  /**
   * Handle inline edits via the Command Bus
   * Section 20: "Commands represent user intentions."
   */
  const handleCellChange = useCallback(
    async ({
      rowIndex,
      colId,
      newValue,
      row,
    }: {
      rowIndex: number;
      colId: string;
      newValue: unknown;
      row: ListRow;
    }) => {
      const applyLocalChange = () => {
        setData((prev) => {
          const next = [...prev];
          next[rowIndex] = { ...row, [colId]: newValue };
          return next;
        });
      };

      try {
        const commandType = `${doctype}.update_field`;

        if (commandBus.hasHandler(commandType)) {
          await commandBus.dispatch({
            type: commandType,
            payload: { id: row.id, field: colId, value: newValue },
            metadata: { source: "grid", rowIndex },
          });
        }

        applyLocalChange();
      } catch (err) {
        console.error("[shipkia] Cell update failed:", err);
        // Rollback would happen here if we had a global Transaction manager
      }
    },
    [doctype],
  );

  /**
   * Action Orchestrator
   */
  const executeAction = useCallback(
    (action: string, rows: ListRow[]) => {
      return commandBus.dispatch({
        type: `${doctype}.${action}`,
        payload: { ids: rows.map((r) => r.id) },
      });
    },
    [doctype],
  );

  return {
    data,
    sort,
    filters,
    columnConfigs,
    setSort,
    setFilters,
    saveColumnConfig,
    handleCellChange,
    executeAction,
    rules,
  };
}

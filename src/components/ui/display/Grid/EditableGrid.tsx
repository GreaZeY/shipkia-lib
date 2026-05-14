import React, { useCallback, useState, useEffect, Suspense } from "react";
import type {
  EditableGridProps,
  GridCellRendererProps,
  GridColumn,
  GridRowData,
} from "@/components/ui/display/Grid/types";
import Grid from "@/components/ui/display/Grid/Grid";
import type { FieldType } from "@/components/ui/forms/FormBuilder/types";
import DefaultCellRenderer from "@/components/ui/display/Grid/DefaultCellRenderer";
import { FieldRegistry } from "@/components/ui/forms/FormBuilder/fieldRegistry";
import { ReactiveEngine } from "@/framework/reactive/engine";
import { Transaction } from "@/framework/runtime/transaction";

interface CellEditorProps {
  value: unknown;
  column: GridColumn;
  rowIndex: number;
  onCellChange?: (rowIndex: number, column: GridColumn, value: unknown) => void;
  onCommit?: () => void;
}

const getChangeValue = (val: unknown): unknown => {
  if (val && typeof val === "object" && "value" in val && !("target" in val)) {
    return (val as { value: unknown }).value;
  }

  if (val && typeof val === "object" && "target" in val) {
    const target = (val as React.ChangeEvent<HTMLInputElement>).target;
    return target.type === "checkbox" ? target.checked : target.value;
  }

  return val;
};

const CellEditor = ({
  value: initialValue,
  column,
  rowIndex,
  onCellChange,
  onCommit,
}: CellEditorProps) => {
  const type = (column.type || "text") as FieldType;
  const valueRef = React.useRef(initialValue);

  const committedRef = React.useRef(false);

  const wrapCommit = useCallback(
    (val: unknown, shouldClose = true) => {
      if (committedRef.current) return;
      if (shouldClose) committedRef.current = true;

      const finalValue = val !== undefined ? val : valueRef.current;
      onCellChange?.(rowIndex, column, finalValue);
      if (shouldClose) {
        onCommit?.();
      }
    },
    [onCellChange, rowIndex, column, onCommit],
  );

  React.useEffect(() => {
    return () => {
      if (!committedRef.current && type !== "checkbox") {
        onCellChange?.(rowIndex, column, valueRef.current);
      }
    };
  }, [type, onCellChange, rowIndex, column]);

  const FieldComponent = FieldRegistry[type] || FieldRegistry.text;
  const isBoolean = type === "checkbox" || type === "switch";

  return (
    <div
      className="-m-3 h-full w-full p-0"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        // Let Escape and Tab bubble up to the grid's keyboard handler
        if (e.key !== "Escape" && e.key !== "Tab") {
          e.stopPropagation();
        }
      }}
    >
      <Suspense fallback={null}>
        <FieldComponent
          name={column.id}
          defaultValue={!isBoolean ? initialValue : undefined}
          defaultChecked={isBoolean ? Boolean(initialValue) : undefined}
          onCheckedChange={
            isBoolean
              ? (val: boolean) => {
                  valueRef.current = val;
                  wrapCommit(val);
                }
              : undefined
          }
          autoFocus
          size="sm"
          variant="ghost"
          className="h-full w-full rounded-none border-0 pl-3 text-sm ring-0"
          options={column.options?.map((option: { label: string; value: string }) => ({
            id: option.value,
            label: option.label,
          }))}
          type={column.type}
          {...(type === "select" ? { defaultOpen: true, multi: false } : {})}
          onChange={(val: unknown) => {
            const newValue = getChangeValue(val);
            valueRef.current = newValue; // Sync ref immediately

            // For checkboxes, commit immediately
            if (type === "checkbox") wrapCommit(newValue);
            // For single-select, commit on selection
            if (type === "select") wrapCommit(newValue, true);
          }}
          onBlur={() => {
            // P1 Issue #12: Ignore blur for select to avoid race condition with option click
            if (type !== "checkbox" && type !== "select") {
              wrapCommit(valueRef.current);
            }
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.defaultPrevented) {
              wrapCommit(valueRef.current);
            }
            if (e.key === "Escape") {
              // P1 Issue #11: Mark as committed to prevent onBlur/cleanup save
              committedRef.current = true;
              onCommit?.();
            }
          }}
        />
      </Suspense>
    </div>
  );
};

const EditableGrid: React.FC<EditableGridProps> = ({
  columns,
  data: propData,
  onCellChange,
  onDataChange,
  rules = [],
  readonly = false,
  gridComponent: GridComponent = Grid,
  ...gridProps
}) => {
  // P1 Issue #10: Internal state for immediate feedback/uncontrolled use
  const [internalData, setInternalData] = useState(propData);

  // Sync internal data when prop data changes (outside update)
  useEffect(() => {
    setInternalData(propData);
  }, [propData]);

  const handleCellChange = useCallback(
    (rowIndex: number, column: GridColumn, value: unknown) => {
      const row = internalData[rowIndex];
      if (!row) return;

      const oldValue = row[column.id];
      if (oldValue === value) return;

      // Section 23: Transactional Update
      const transaction = new Transaction<GridRowData>(row, (finalRow, patches) => {
        const newData = [...internalData];
        newData[rowIndex] = finalRow;
        setInternalData(newData);

        // Notify parent of all changed cells in this row
        Object.keys(patches).forEach(id => {
          onCellChange?.({
            rowIndex,
            colId: id,
            newValue: finalRow[id],
            oldValue: row[id],
            row: finalRow,
            column: columns.find(c => c.id === id) || column,
          });
        });

        onDataChange?.(newData);
      });

      // Section 24: Reactive Logic
      if (rules && rules.length > 0) {
        const engine = new ReactiveEngine({ rules, initialValues: row });
        const patches = engine.update(column.id, value);
        const valuePatches = Object.fromEntries(
          Object.entries(patches)
            .filter(([, patch]) => patch && "value" in patch)
            .map(([id, patch]) => [id, patch.value]),
        );

        transaction.addPatch({ [column.id]: value, ...valuePatches });
      } else {
        transaction.addPatch({ [column.id]: value });
      }

      transaction.commit();
    },
    [internalData, onCellChange, onDataChange, rules, columns],
  );

  const EditableCellRenderer = useCallback(
    ({ value, column, row, rowIndex, isEditing, stopEditing }: GridCellRendererProps) => {
      if (isEditing && !readonly) {
        return (
          <CellEditor
            value={value}
            column={column}
            rowIndex={rowIndex}
            onCellChange={handleCellChange}
            onCommit={stopEditing}
          />
        );
      }
      return (
        <DefaultCellRenderer
          value={value}
          column={column}
          row={row}
          rowIndex={rowIndex}
          colIndex={0}
        />
      );
    },
    [handleCellChange, readonly],
  );

  return (
    <div className="h-full w-full">
      <GridComponent
        {...gridProps}
        columns={columns}
        data={internalData}
        cellRenderer={EditableCellRenderer}
        readonly={readonly}
      />
    </div>
  );
};

export default EditableGrid;

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import type {
  GridCellRendererProps,
  GridColumn,
  GridProps,
  GridRowData,
} from "@components/ui/display/Grid/types";
import { resolve } from "@/framework/registry";
import DefaultCellRenderer from "@components/ui/display/Grid/DefaultCellRenderer";
import Checkbox from "@components/ui/inputs/Checkbox/Checkbox";
import { useGridNavigation } from "@/hooks/useGridNavigation";
import Truncate from "@components/ui/display/Truncate/Truncate";

// --- Memoized Row Component (P1 Issue #6) ---
const GridRow = React.memo(
  ({
    row,
    rowIndex,
    rowKey,
    columns,
    selectable,
    isSelected,
    isActiveRow,
    activeCol,
    interactionMode,
    isEditing,
    gridTemplateColumns,
    stickyOffsets,
    onRowClick,
    toggleRowSelect,
    CellRenderer,
    setIsEditing,
    style,
  }: {
    row: GridRowData;
    rowIndex: number;
    rowKey: string;
    columns: GridColumn[];
    selectable: boolean;
    isSelected: boolean;
    isActiveRow: boolean;
    activeCol: number;
    interactionMode: "keyboard" | "mouse";
    isEditing: boolean;
    gridTemplateColumns: string;
    stickyOffsets: Record<string, number>;
    onRowClick?: (row: GridRowData, rowIndex: number) => void;
    toggleRowSelect: (key: string) => void;
    CellRenderer: React.ComponentType<GridCellRendererProps>;
    setIsEditing: (val: boolean) => void;
    style?: React.CSSProperties;
  }) => {
    const key = String(row[rowKey] ?? rowIndex.toString());

    return (
      <div
        key={key}
        data-index={rowIndex}
        className={cn(
          "grid w-max min-w-full border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20",
          isSelected && "bg-primary/5",
          onRowClick && "cursor-pointer",
        )}
        style={{ ...style, gridTemplateColumns, contain: "content" }}
      >
        {/* Select Checkbox Cell */}
        {selectable && (
          <div
            className={cn(
              "sticky left-0 z-20 flex cursor-pointer items-center justify-center bg-card p-2 transition-colors",
              isSelected && "bg-primary/5",
              isActiveRow &&
                activeCol === 0 &&
                interactionMode === "keyboard" &&
                "bg-muted/50 ring-2 ring-inset ring-primary",
            )}
            data-row={rowIndex}
            data-col={0}
            onClick={(e) => {
              e.stopPropagation();
              toggleRowSelect(key);
            }}
          >
            <Checkbox
              checked={isSelected}
              className="pointer-events-none"
              aria-label={`Select row ${rowIndex}`}
            />
          </div>
        )}

        {/* Data Cells */}
        {columns.map((col, colIndex) => {
          const actualColIndex = selectable ? colIndex + 1 : colIndex;
          const isActive = isActiveRow && activeCol === actualColIndex;
          const isFixed = col.fixed;
          const leftOffset = stickyOffsets[col.id];

          return (
            <div
              key={`${key}-${col.id}`}
              className={cn(
                "flex items-center overflow-hidden p-3 transition-colors",
                isFixed && "sticky z-20 bg-card",
                isSelected && isFixed && "bg-primary/5",
                isActive &&
                  interactionMode === "keyboard" &&
                  "bg-muted/50 ring-2 ring-inset ring-primary",
                col.align === "center" && "justify-center",
                col.align === "right" && "justify-end",
              )}
              style={{
                left:
                  isFixed && col.fixedDirection !== "right"
                    ? leftOffset
                    : undefined,
                right:
                  isFixed && col.fixedDirection === "right" ? 0 : undefined,
              }}
              data-row={rowIndex}
              data-col={actualColIndex}
            >
              <CellRenderer
                value={row[col.id]}
                column={col}
                row={row}
                rowIndex={rowIndex}
                colIndex={actualColIndex}
                isActive={isActive}
                isEditing={isActive && isEditing}
                stopEditing={() => setIsEditing(false)}
              />
            </div>
          );
        })}
      </div>
    );
  },
);
GridRow.displayName = "GridRow";

const Grid: React.FC<GridProps> = ({
  columns,
  data,
  rowKey = "id",
  selectable = false,
  selectedRowKeys: propSelectedRowKeys,
  onSelectionChange,
  className,
  onRowClick,
  disableDefaultFocus = false,
  onColumnResize,
  onColumnReorder,
  cellRenderer: CellRendererProp = DefaultCellRenderer,
  readonly = false,
}) => {
  const CellRenderer = resolve("ui:Grid.CellRenderer", CellRendererProp);

  // --- Internal State for Columns (Resize/Reorder) ---
  const [internalColumns, setInternalColumns] = useState<GridColumn[]>(columns);
  useEffect(() => {
    setInternalColumns(columns);
  }, [columns]);

  // --- Internal State for Selection (Uncontrolled fallback) ---
  const [localSelectedKeys, setLocalSelectedKeys] = useState<string[]>(
    propSelectedRowKeys || [],
  );
  useEffect(() => {
    if (propSelectedRowKeys) {
      setLocalSelectedKeys(propSelectedRowKeys);
    }
  }, [propSelectedRowKeys]);

  const selectedRowKeys = propSelectedRowKeys || localSelectedKeys;

  // P1 Issue #7: O(1) selection lookup
  const selectedKeySet = useMemo(
    () => new Set(selectedRowKeys),
    [selectedRowKeys],
  );

  // --- Grid Navigation & Interaction Mode ---
  const totalColumns = selectable
    ? internalColumns.length + 1
    : internalColumns.length;

  // State-based element ref for reactive useGlobalEvent (Bug #2 fix)
  const [gridElement, setGridElement] = useState<HTMLDivElement | null>(null);

  const {
    activeCell,
    handleKeyDown,
    gridRef,
    setActiveCell,
    interactionMode,
    setInteractionMode,
    isEditing,
    setIsEditing,
  } = useGridNavigation({
    rowCount: data.length,
    colCount: totalColumns,
  });

  // Callback ref: sets state for useGlobalEvent AND syncs gridRef for useGridNavigation
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      setGridElement(node);
      (gridRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [gridRef],
  );

  const [, activeCol] = activeCell;

  // --- Stabilized callbacks with refs (P1 Issue #9) ---
  const activeCellRef = useRef(activeCell);
  activeCellRef.current = activeCell;

  const dataRef = useRef(data);
  dataRef.current = data;

  const onRowClickRef = useRef(onRowClick);
  onRowClickRef.current = onRowClick;

  // --- Event Delegation (stabilized — no stale closures) ---
  const handleCellClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const cell = target.closest("[data-row][data-col]");

      if (cell) {
        const rowIdx = parseInt(cell.getAttribute("data-row") || "-1", 10);
        const colIdx = parseInt(cell.getAttribute("data-col") || "-1", 10);
        if (rowIdx >= 0 && colIdx >= 0) {
          const [curRow, curCol] = activeCellRef.current;
          setActiveCell([rowIdx, colIdx]);
          setInteractionMode("mouse");
          // Focus the grid container to enable keyboard navigation (Enter key)
          gridRef.current?.focus();
          if (curRow !== rowIdx || curCol !== colIdx) {
            setIsEditing(false);
          }

          // Handle row click
          onRowClickRef.current?.(dataRef.current[rowIdx], rowIdx);
        }
      } else {
        // Clicked inside grid but not on a data cell (e.g. empty space after rows, header)
        setIsEditing(false);
        setActiveCell([-1, -1]);
      }
    },
    [setActiveCell, setInteractionMode, setIsEditing],
  );

  const handleCellDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const cell = (e.target as HTMLElement).closest("[data-row][data-col]");
      if (cell) {
        const colIdx = parseInt(cell.getAttribute("data-col") || "-1", 10);
        const isSelectionCol = selectable && colIdx === 0;
        if (!readonly && !isSelectionCol) {
          e.preventDefault();
          setIsEditing(true);
        }
      }
    },
    [readonly, selectable, setIsEditing],
  );

  // --- Clickaway handling ---
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!gridElement) return;

      const target = e.target as Node;
      const isInsideGrid = gridElement.contains(target);
      const isInsidePopover = (target as HTMLElement).closest?.(
        "[data-radix-popper-content-wrapper]",
      );

      if (!isInsideGrid && !isInsidePopover) {
        setIsEditing(false);
        setActiveCell([-1, -1]);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick, true);
    return () =>
      window.removeEventListener("mousedown", handleOutsideClick, true);
  }, [gridElement, setIsEditing, setActiveCell]);

  // --- Grid Template Columns Calculation ---
  const gridTemplateColumns = useMemo(() => {
    let template = "";
    if (selectable) template += "48px ";
    template += internalColumns
      .map((col) => {
        if (col.width)
          return typeof col.width === "number" ? `${col.width}px` : col.width;
        if (col.flex) return `${col.flex}fr`;
        return "1fr";
      })
      .join(" ");
    return template;
  }, [internalColumns, selectable]);

  // --- Sticky Offsets Calculation ---
  const stickyOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let currentLeft = selectable ? 48 : 0;

    internalColumns.forEach((col) => {
      if (col.fixed && col.fixedDirection !== "right") {
        offsets[col.id] = currentLeft;
      }

      // Calculate width for next offset
      const width = typeof col.width === "number" ? col.width : 150;
      currentLeft += width;
    });
    return offsets;
  }, [internalColumns, selectable]);

  // --- Selection Handlers (P2 Issue #13: memoized) ---
  const toggleSelectAll = useCallback(() => {
    const newSelection =
      selectedRowKeys.length === data.length
        ? []
        : data.map((row, i) => String(row[rowKey] ?? i.toString()));

    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setLocalSelectedKeys(newSelection);
    }
  }, [selectedRowKeys.length, data, rowKey, onSelectionChange]);

  const toggleRowSelect = useCallback(
    (key: string) => {
      const newSelection = selectedRowKeys.includes(key)
        ? selectedRowKeys.filter((k) => k !== key)
        : [...selectedRowKeys, key];

      if (onSelectionChange) {
        onSelectionChange(newSelection);
      } else {
        setLocalSelectedKeys(newSelection);
      }
    },
    [selectedRowKeys, onSelectionChange],
  );

  // --- Column Resizing Logic (P1 Issue #8: RAF throttled) ---
  const [resizingCol, setResizingCol] = useState<{
    id: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const startResize = useCallback(
    (e: React.MouseEvent, colId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const headerCell = (e.target as HTMLElement).closest("[data-col-id]");
      const startWidth = headerCell
        ? headerCell.getBoundingClientRect().width
        : 150;

      setResizingCol({ id: colId, startX: e.clientX, startWidth });

      let rafId: number | null = null;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const deltaX = moveEvent.clientX - e.clientX;
          const newWidth = Math.max(50, startWidth + deltaX);

          setInternalColumns((cols) =>
            cols.map((c) =>
              c.id === colId ? { ...c, width: newWidth, flex: undefined } : c,
            ),
          );
        });
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        const deltaX = upEvent.clientX - e.clientX;
        const finalWidth = Math.max(50, startWidth + deltaX);
        onColumnResize?.(colId, finalWidth);

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        setResizingCol(null);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onColumnResize],
  );

  // --- Column Reordering Logic ---
  const [draggedColId, setDraggedColId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, colId: string) => {
    setDraggedColId(colId);
    e.dataTransfer.setData("colId", colId);
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    const sourceColId = e.dataTransfer.getData("colId");
    if (sourceColId === targetColId) return;

    const sourceIndex = internalColumns.findIndex((c) => c.id === sourceColId);
    const targetIndex = internalColumns.findIndex((c) => c.id === targetColId);

    const newColumns = [...internalColumns];
    const [movedCol] = newColumns.splice(sourceIndex, 1);
    newColumns.splice(targetIndex, 0, movedCol);

    setInternalColumns(newColumns);
    onColumnReorder?.(newColumns);
    setDraggedColId(null);
  };

  return (
    <div
      ref={callbackRef}
      className={cn(
        "custom-scrollbar relative w-full overflow-auto rounded-xl border border-border bg-card shadow-sm outline-none focus:outline-none",
        className,
      )}
      style={{
        backgroundImage: selectable
          ? "linear-gradient(to right, transparent 47px, var(--border) 47px, var(--border) 48px, transparent 48px)"
          : undefined,
        backgroundAttachment: "local",
      }}
      tabIndex={disableDefaultFocus ? undefined : 0}
      onKeyDown={disableDefaultFocus ? undefined : handleKeyDown}
      onClick={handleCellClick}
      onDoubleClick={handleCellDoubleClick}
    >
      {/* Header */}
      <div
        className="water-lens sticky top-0 z-30 grid w-max min-w-full rounded-t-xl border-b border-border"
        style={{ gridTemplateColumns }}
      >
        {selectable && (
          <div
            className="water-lens sticky left-0 z-40 flex cursor-pointer items-center justify-center p-2"
            onClick={(e) => {
              e.stopPropagation();
              toggleSelectAll();
            }}
          >
            <Checkbox
              checked={
                selectedRowKeys.length === 0
                  ? false
                  : data.length > 0 && selectedRowKeys.length === data.length
                    ? true
                    : "indeterminate"
              }
              className="pointer-events-none"
              aria-label="Select all rows"
            />
          </div>
        )}
        {internalColumns.map((col, idx) => {
          const isFixed = col.fixed;
          const leftOffset = stickyOffsets[col.id];
          const isLastCol = idx === internalColumns.length - 1;

          return (
            <div
              key={col.id}
              data-col-id={col.id}
              draggable
              onDragStart={(e) => handleDragStart(e, col.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, col.id)}
              className={cn(
                "relative flex items-center p-3 text-sm font-semibold text-muted-foreground transition-colors",
                isFixed && "water-lens sticky z-40",
                draggedColId === col.id && "opacity-50",
                col.align === "center" && "justify-center",
                col.align === "right" && "justify-end",
              )}
              style={{
                minWidth: col.minWidth,
                left:
                  isFixed && col.fixedDirection !== "right"
                    ? leftOffset
                    : undefined,
                right:
                  isFixed && col.fixedDirection === "right" ? 0 : undefined,
              }}
            >
              <Truncate className="w-full">{col.label}</Truncate>

              {/* Resize Handle */}
              {!isLastCol && (
                <div className="group absolute right-0 top-0 flex h-full w-4 items-center justify-center">
                  <div
                    className={cn(
                      "h-full w-1.5 cursor-col-resize rounded-full bg-transparent transition-colors",
                      resizingCol?.id === col.id && "bg-primary/10",
                    )}
                    onMouseDown={(e) => startResize(e, col.id)}
                  >
                    {/* Visual line */}
                    <div
                      className={cn(
                        "mx-auto h-1/2 w-0.5 translate-y-1/2 rounded-full bg-border/50 transition-colors group-hover:bg-primary",
                        resizingCol?.id === col.id && "bg-primary",
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex flex-col">
        {data.length === 0 ? (
          <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          data.map((row, rowIndex) => {
            const key = String(row[rowKey] ?? rowIndex.toString());
            const isActiveRow = activeCell[0] === rowIndex;
            return (
              <GridRow
                key={key}
                row={row}
                rowIndex={rowIndex}
                rowKey={rowKey}
                columns={internalColumns}
                selectable={selectable}
                isSelected={selectedKeySet.has(key)}
                isActiveRow={isActiveRow}
                activeCol={activeCol}
                isEditing={isActiveRow && isEditing}
                interactionMode={interactionMode}
                gridTemplateColumns={gridTemplateColumns}
                stickyOffsets={stickyOffsets}
                onRowClick={onRowClick}
                toggleRowSelect={toggleRowSelect}
                CellRenderer={CellRenderer}
                setIsEditing={setIsEditing}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Grid;

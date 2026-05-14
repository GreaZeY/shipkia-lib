"use no memo";

import React, {
  useMemo,
  useEffect,
  useState,
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
import Checkbox from "@/components/ui/inputs/Checkbox/Checkbox";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useGridNavigation } from "@/hooks/useGridNavigation";
import Truncate from "@/components/ui/display/Truncate/Truncate";

// --- Memoized Row Component (Shared with Grid.tsx) ---
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

const VirtualizedGrid: React.FC<GridProps> = ({
  columns,
  data,
  rowKey = "id",
  selectable = false,
  selectedRowKeys: propSelectedRowKeys,
  onSelectionChange,
  className,
  onRowClick,
  disableDefaultFocus = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  estimatedRowHeight = 50,
  onColumnResize,
  onColumnReorder,
  cellRenderer: CellRendererProp = DefaultCellRenderer,
  readonly = false,
}) => {
  const CellRenderer = resolve("ui:Grid.CellRenderer", CellRendererProp);

  const [internalColumns, setInternalColumns] = useState<GridColumn[]>(columns);
  useEffect(() => {
    setInternalColumns(columns);
  }, [columns]);

  const [localSelectedKeys, setLocalSelectedKeys] = useState<string[]>(
    propSelectedRowKeys || [],
  );
  useEffect(() => {
    if (propSelectedRowKeys) {
      setLocalSelectedKeys(propSelectedRowKeys);
    }
  }, [propSelectedRowKeys]);

  const selectedRowKeys = propSelectedRowKeys || localSelectedKeys;

  const selectedKeySet = useMemo(
    () => new Set(selectedRowKeys),
    [selectedRowKeys],
  );

  const [gridElement, setGridElement] = useState<HTMLDivElement | null>(null);

  const rowCount = hasMore ? data.length + 1 : data.length;

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => gridElement,
    estimateSize: () => estimatedRowHeight,
    overscan: 5,
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (virtualItems.length === 0) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem.index >= data.length - 1 &&
      hasMore &&
      !isLoadingMore &&
      onLoadMore
    ) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore, data.length, rowVirtualizer]);

  const totalColumns = selectable
    ? internalColumns.length + 1
    : internalColumns.length;

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
    scrollToRow: (index) =>
      rowVirtualizer.scrollToIndex(index, { align: "auto" }),
  });

  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      setGridElement(node);
      (gridRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [gridRef],
  );

  const [, activeCol] = activeCell;

  const activeCellRef = useRef(activeCell);
  activeCellRef.current = activeCell;

  const dataRef = useRef(data);
  dataRef.current = data;

  const onRowClickRef = useRef(onRowClick);
  onRowClickRef.current = onRowClick;

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
          gridRef.current?.focus();
          if (curRow !== rowIdx || curCol !== colIdx) {
            setIsEditing(false);
          }
          onRowClickRef.current?.(dataRef.current[rowIdx], rowIdx);
        }
      } else {
        setIsEditing(false);
        setActiveCell([-1, -1]);
      }
    },
    [setActiveCell, setInteractionMode, setIsEditing, gridRef],
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

  const stickyOffsets = useMemo(() => {
    const offsets: Record<string, number> = {};
    let currentLeft = selectable ? 48 : 0;

    internalColumns.forEach((col) => {
      if (col.fixed && col.fixedDirection !== "right") {
        offsets[col.id] = currentLeft;
      }
      const width = typeof col.width === "number" ? col.width : 150;
      currentLeft += width;
    });
    return offsets;
  }, [internalColumns, selectable]);

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
        "custom-scrollbar relative h-full w-full overflow-auto rounded-xl border border-border bg-card shadow-sm outline-none focus:outline-none",
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
                "group relative flex items-center p-3 text-sm font-semibold text-muted-foreground transition-colors",
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

              {!isLastCol && (
                <div
                  className={cn(
                    "absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent transition-colors",
                    resizingCol?.id === col.id && "bg-primary/10",
                  )}
                  onMouseDown={(e) => startResize(e, col.id)}
                >
                  <div
                    className={cn(
                      "mx-auto h-1/2 w-0.5 translate-y-1/2 rounded-full bg-border/50 transition-colors group-hover:bg-primary",
                      resizingCol?.id === col.id && "bg-primary",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {data.length === 0 && !isLoadingMore ? (
          <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const rowIndex = virtualRow.index;
            const isLoaderRow = rowIndex > data.length - 1;

            if (isLoaderRow) {
              return (
                <div
                  key="loader"
                  className="absolute left-0 top-0 flex w-full items-center justify-center p-4 text-sm text-muted-foreground"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  Loading more...
                </div>
              );
            }

            const row = data[rowIndex];
            const isActiveRow = activeCell[0] === virtualRow.index;
            const key = String(row[rowKey] ?? virtualRow.index.toString());
            return (
              <GridRow
                key={virtualRow.key}
                row={row}
                rowIndex={virtualRow.index}
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
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default VirtualizedGrid;

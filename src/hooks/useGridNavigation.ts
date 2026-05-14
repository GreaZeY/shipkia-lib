import { useState, useCallback, useRef } from "react";

export interface UseGridNavigationProps {
  rowCount: number;
  colCount: number;
  initialRow?: number;
  initialCol?: number;
  onCellSelect?: (row: number, col: number) => void;
  onEnter?: (row: number, col: number) => void;
  onEscape?: () => void;
  scrollToRow?: (index: number) => void;
  gridRef?: React.RefObject<HTMLDivElement>;
}

export const useGridNavigation = ({
  rowCount,
  colCount,
  initialRow = -1,
  initialCol = -1,
  onCellSelect,
  onEnter,
  onEscape,
  scrollToRow: externalScrollToRow,
  gridRef: externalGridRef,
}: UseGridNavigationProps) => {
  const [activeCell, setActiveCell] = useState<[number, number]>([
    initialRow,
    initialCol,
  ]);

  const internalRef = useRef<HTMLDivElement>(null);
  const gridRef = externalGridRef || internalRef;

  const [interactionMode, setInteractionMode] = useState<"keyboard" | "mouse">(
    "mouse",
  );

  const [isEditing, setIsEditing] = useState(false);

  const scrollToCell = useCallback(
    (row: number, col: number) => {
      // 1. If we have a virtualizer, we must tell it to scroll to the row first
      if (externalScrollToRow) {
        externalScrollToRow(row);
      }

      // 2. Then try to find the cell in the DOM for horizontal scrolling or minor adjustments
      // We wrap in requestAnimationFrame to allow the virtualizer to render the row if it just scrolled
      requestAnimationFrame(() => {
        if (!gridRef.current) return;
        const cellEl = gridRef.current.querySelector(
          `[data-row="${row}"][data-col="${col}"]`,
        );

        if (cellEl) {
          cellEl.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }
      });
    },
    [externalScrollToRow],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      setInteractionMode("keyboard");
      const [currentRow, currentCol] = activeCell;

      // If no cell is active, and arrow is pressed, activate 0,0
      if (currentRow === -1 || currentCol === -1) {
        if (
          ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)
        ) {
          e.preventDefault();
          setActiveCell([0, 0]);
          scrollToCell(0, 0);
          onCellSelect?.(0, 0);
        }
        return;
      }

      // If we are editing, some keys should exit edit mode
      if (isEditing) {
        if (e.key === "Escape") {
          e.preventDefault();
          setIsEditing(false);
          onEscape?.();
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          setIsEditing(false);
          onEnter?.(currentRow, currentCol);
          return;
        }
        // For arrows/tabs, we exit editing and then navigate
        if (
          ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab"].includes(
            e.key,
          )
        ) {
          setIsEditing(false);
          // Don't return, let it fall through to navigation logic
        } else {
          // While editing, don't let grid navigation intercept other keys
          return;
        }
      }

      let newRow = currentRow;
      let newCol = currentCol;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          newRow = Math.min(currentRow + 1, rowCount - 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          newRow = Math.max(currentRow - 1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          newCol = Math.min(currentCol + 1, colCount - 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          newCol = Math.max(currentCol - 1, 0);
          break;
        case "Tab":
          // Move to next cell on tab
          e.preventDefault();
          if (e.shiftKey) {
            if (currentCol > 0) newCol = currentCol - 1;
            else if (currentRow > 0) {
              newRow = currentRow - 1;
              newCol = colCount - 1;
            }
          } else {
            if (currentCol < colCount - 1) newCol = currentCol + 1;
            else if (currentRow < rowCount - 1) {
              newRow = currentRow + 1;
              newCol = 0;
            }
          }
          break;
        case "Enter":
          e.preventDefault();
          setIsEditing(true);
          onEnter?.(currentRow, currentCol);
          return;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          return;
        default:
          return;
      }

      if (newRow !== currentRow || newCol !== currentCol) {
        setActiveCell([newRow, newCol]);
        scrollToCell(newRow, newCol);
        onCellSelect?.(newRow, newCol);
      }
    },
    [
      activeCell,
      rowCount,
      colCount,
      onCellSelect,
      onEnter,
      onEscape,
      scrollToCell,
      isEditing,
    ],
  );

  return {
    activeCell,
    setActiveCell,
    handleKeyDown,
    gridRef,
    scrollToCell,
    interactionMode,
    setInteractionMode,
    isEditing,
    setIsEditing,
  };
};

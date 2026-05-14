import type { FieldType } from "../../forms/FormBuilder/types";
import type { ReactiveRule } from "@/framework/reactive/engine";

export type GridRowData = Record<string, unknown>;

export interface GridColumn {
  id: string;
  type?: FieldType | string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  flex?: number;
  align?: "left" | "center" | "right";
  // specific options for select/radio etc.
  options?: { label: string; value: string }[];
  fixed?: boolean;
  fixedDirection?: "left" | "right";
}

export interface GridProps {
  columns: GridColumn[];
  data: GridRowData[];
  rowKey?: string; // unique identifier for a row, defaults to 'id'
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectionChange?: (selectedKeys: string[]) => void;
  className?: string;
  onRowClick?: (row: GridRowData, rowIndex: number) => void;
  // Used to distinguish when grid wants to manage its own focus wrapper
  disableDefaultFocus?: boolean;
  // Virtualization & Infinite Scroll
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  estimatedRowHeight?: number;
  onColumnResize?: (colId: string, width: number) => void;
  onColumnReorder?: (newColumns: GridColumn[]) => void;
  cellRenderer?: React.ComponentType<GridCellRendererProps>;
  readonly?: boolean;
}

export interface GridCellRendererProps {
  value: unknown;
  column: GridColumn;
  row: GridRowData;
  rowIndex: number;
  colIndex: number;
  isActive?: boolean;
  isEditing?: boolean;
  stopEditing?: () => void;
}

export interface EditableGridProps extends GridProps {
  onCellChange?: (params: {
    rowIndex: number;
    colId: string;
    newValue: unknown;
    oldValue: unknown;
    row: GridRowData;
    column: GridColumn;
  }) => void;
  onDataChange?: (newData: GridRowData[]) => void;
  gridComponent?: React.ComponentType<GridProps>;
  rules?: ReactiveRule[];
}

export interface GridNavigation {
  activeCell: [number, number];
  setActiveCell: (cell: [number, number]) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  gridRef: React.RefObject<HTMLDivElement>;
  interactionMode: "keyboard" | "mouse";
  setInteractionMode: (mode: "keyboard" | "mouse") => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
}

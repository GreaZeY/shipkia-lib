import React from "react";
import type { GridCellRendererProps } from "@/components/ui/display/Grid/types";
import Chip from "@/components/ui/display/Chip/Chip";
import Checkbox from "@/components/ui/inputs/Checkbox/Checkbox";
import Truncate from "@/components/ui/display/Truncate/Truncate";

export const DefaultCellRenderer: React.FC<GridCellRendererProps> = ({
  value,
  column,
}) => {
  if (value === undefined || value === null)
    return <span className="text-sm text-muted-foreground">-</span>;

  if (column.type === "checkbox") {
    const isChecked = typeof value === "boolean" ? value : value === "true";
    return <Checkbox checked={isChecked} disabled />;
  }

  if (column.type === "select" || column.type === "radio") {
    const option = column.options?.find((opt) => opt.value === value);
    if (option) {
      return <Chip variant="secondary" className="text-sm">{option.label}</Chip>;
    }
  }

  if (typeof value === "boolean") {
    return <span className="text-sm">{value ? "Yes" : "No"}</span>;
  }

  // Use Truncate for strings and numbers to prevent cell overflow
  if (typeof value === "string" || typeof value === "number") {
    return (
      <Truncate className="w-full text-left text-sm" fadePercentage={90}>
        {String(value)}
      </Truncate>
    );
  }

  // Fallback for React elements or other non-primitive values
  if (React.isValidElement(value)) {
    return <div className="text-sm">{value}</div>;
  }

  return <span className="text-sm">{String(value)}</span>;
};

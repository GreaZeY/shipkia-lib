"use no memo";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SelectItem } from "./SelectItem";
import { type SelectOption } from "@/hooks/useSelect";

export interface VirtualizedListProps {
  options: SelectOption[];
  value?: string | string[];
  multi?: boolean;
  onSelect: (id: string) => void;
  height?: number;
  dropdownWidth?: number;
  activeIndex?: number | null;
}

const VirtualizedList = ({
  options,
  value,
  multi,
  onSelect,
  height = 350,
  activeIndex,
}: VirtualizedListProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // Default estimate, actual size is measured dynamically
    overscan: 20,
  });

  // Auto-scroll to active index when keyboard navigating
  React.useEffect(() => {
    if (activeIndex !== undefined && activeIndex !== null && activeIndex >= 0) {
      virtualizer.scrollToIndex(activeIndex, { align: "auto" });
    }
  }, [activeIndex, virtualizer]);

  return (
    <div
      ref={parentRef}
      className="custom-scrollbar overflow-y-auto"
      style={{
        height: `${height}px`,
        width: "100%",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const option = options[virtualItem.index];
          const isSelected = multi
            ? (value as string[])?.includes(option.id)
            : value === option.id;

          return (
            <SelectItem
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              option={option}
              isSelected={isSelected}
              isFocused={virtualItem.index === activeIndex}
              onClick={() => onSelect(option.id)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VirtualizedList;

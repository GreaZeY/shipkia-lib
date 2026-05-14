import * as React from "react";
import SelectItem from "@components/ui/inputs/Select/SelectItem";
import { type SelectOption } from "@/hooks/useSelect";

export interface DropListProps {
  options: SelectOption[];
  value?: string | string[];
  multi?: boolean;
  onSelect: (id: string) => void;
  activeIndex?: number | null;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const DropList = ({
  options,
  value,
  multi,
  onSelect,
  activeIndex,
  onKeyDown,
}: DropListProps) => {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const item = target.closest("[data-id]");
      if (item) {
        const id = item.getAttribute("data-id");
        if (id) {
          onSelect(id);
        }
      }
    },
    [onSelect]
  );

  return (
    <div onKeyDown={onKeyDown} onClick={handleClick}>
      {options.map((option, index) => (
        <SelectItem
          key={option.id}
          option={option}
          isSelected={
            multi
              ? (value as string[])?.includes(option.id)
              : value === option.id
          }
          isFocused={index === activeIndex}
        />
      ))}
    </div>
  );
};

export default DropList;

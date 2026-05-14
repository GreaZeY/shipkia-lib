import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Box from "../../containers/Box/Box";
import { type SelectOption } from "@/hooks/useSelect";
import Truncate from "../../display/Truncate/Truncate";

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  option: SelectOption;
  isSelected: boolean;
  isFocused?: boolean;
  onClick?: () => void;
}

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  (
    { option, isSelected, isFocused, onClick, className, style, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      disabled={option.disabled}
      onClick={onClick}
      style={style}
      data-id={option.id}
      {...props}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted focus:outline-none disabled:opacity-50",
        isSelected && "text-primary",
        isFocused && !isSelected && "bg-muted",
        className,
      )}
    >
      <Box className="flex h-4 w-4 shrink-0 items-center justify-center">
        {isSelected && <Check size={16} strokeWidth={3} />}
      </Box>
      {option.icon && (
        <Box
          display="flex"
          align="center"
          justify="center"
          className="h-5 w-5 shrink-0"
        >
          {option.icon}
        </Box>
      )}
      <Box
        display="flex"
        direction="column"
        className="flex-1 overflow-hidden text-left"
      >
        <Truncate className="w-full text-left">{option.label}</Truncate>
        {option.description && (
          <span className="text-[10px] leading-tight text-muted-foreground opacity-80">
            {option.description}
          </span>
        )}
      </Box>
    </button>
  ),
);

SelectItem.displayName = "SelectItem";

export default SelectItem;

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Button, { type ButtonProps } from "../Button/Button";

export interface SelectTriggerProps extends Omit<ButtonProps, "variant"> {
  isOpen?: boolean;
  multi?: boolean;
  hasSelection?: boolean;

  count?: number;

  variant?: "outline" | "button" | "ghost";
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      isOpen,
      multi,
      hasSelection,
      variant,
      size,
      count = 0,
      ...props
    },
    ref,
  ) => (
    <Button
      ref={ref}
      variant={variant === "button" ? "secondary" : variant || "outline"}
      className={cn(
        "min-w-[50px] justify-between px-3 font-medium ring-0 transition-all duration-200 hover:border-transparent hover:bg-transparent focus:border-transparent focus:ring-0 focus-visible:outline-none active:translate-y-0 active:bg-transparent active:shadow-none",
        variant === "button" ? "w-40 justify-center gap-1" : "w-full",
        !size && !variant && "h-10", // Default height if no size or special variant
        isOpen && "border-primary",
        isOpen && multi && count > 5 && "rounded-3xl",
        multi && hasSelection && "h-auto min-h-[40px] py-1.5",
        variant === "ghost" &&
          "h-full border-transparent ring-0 hover:border-transparent hover:bg-transparent focus:border-transparent focus:ring-0 active:bg-transparent active:shadow-none",
        (!variant || variant === "outline") && "active:bg-transparent",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "items-center overflow-hidden text-left",
          variant === "button" ? "flex-none" : "flex flex-1",
        )}
      >
        {children}
      </div>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
          variant !== "button" && "ml-2",
          isOpen && "rotate-180",
        )}
      />
    </Button>
  ),
);

SelectTrigger.displayName = "SelectTrigger";

export default SelectTrigger;

import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Box from "@/components/ui/containers/Box/Box";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold transition-all",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary hover:bg-primary/20",
        secondary: "bg-muted text-muted-foreground hover:bg-muted/80",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted/50",
        success: "bg-success/10 text-success hover:bg-success/20",
        error: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

export interface ChipProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  /**
   * The content of the chip.
   */
  children?: React.ReactNode;
  /**
   * The label of the chip.
   */
  label?: string;
  /**
   * Callback function to be called when the remove button is clicked.
   */
  onRemove?: () => void;
  /**
   * Icon to be displayed in the chip.
   */
  icon?: React.ReactNode;
}

const Chip = ({
  className,
  variant,
  label,
  children,
  onRemove,
  icon,
  ...props
}: ChipProps) => {
  return (
    <Box
      display="inlineFlex"
      align="center"
      className={cn(chipVariants({ variant, className }))}
      {...props}
    >
      {icon && (
        <span className="flex shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
      <span className="truncate">{children || label}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          <X size={10} strokeWidth={3} />
        </span>
      )}
    </Box>
  );
};

export default Chip;

import * as React from "react";
import { useResizeObserver } from "@/hooks/useGlobalResizeObserver";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./../Tooltip/Tooltip";
import { cn } from "@/lib/utils";

export interface TruncateProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  fadePercentage?: number; // e.g. 80 means fade starts at 80% of width
}

const Truncate = React.forwardRef<HTMLDivElement, TruncateProps>(
  (
    { children, className, tooltipSide = "top", fadePercentage = 80, ...props },
    forwardedRef,
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    // Combine forwarded ref and internal ref
    const ref = React.useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    useResizeObserver(internalRef, (entry) => {
      const el = entry.target as HTMLDivElement;
      // 1px threshold to account for rounding errors in scrollWidth
      setIsOverflowing(el.scrollWidth > el.clientWidth + 1);
    });

    const fadeStyle = isOverflowing
      ? {
          WebkitMaskImage: `linear-gradient(to right, black ${fadePercentage}%, transparent 100%)`,
          maskImage: `linear-gradient(to right, black ${fadePercentage}%, transparent 100%)`,
        }
      : {};

    const handleOpenChange = (newOpen: boolean) => {
      if (isOverflowing) {
        setOpen(newOpen);
      } else {
        setOpen(false);
      }
    };

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip open={open} onOpenChange={handleOpenChange}>
          <TooltipTrigger asChild>
            <div className={cn("min-w-0 max-w-full", className)} {...props}>
              <div
                ref={ref}
                className="w-full overflow-hidden whitespace-nowrap"
                style={{
                  ...fadeStyle,
                  ...props.style,
                  textOverflow: "clip",
                }}
              >
                {children}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side={tooltipSide}
            className="max-w-[400px] whitespace-normal break-words text-center"
          >
            {children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

Truncate.displayName = "Truncate";

export default Truncate;

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const boxVariants = cva("transition-all", {
  variants: {
    display: {
      flex: "flex min-w-0",
      grid: "grid",
      block: "block",
      inline: "inline",
      inlineFlex: "inline-flex min-w-0",
      none: "hidden",
    },
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    padding: {
      none: "p-0",
      xs: "p-1",
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
      xl: "p-6",
    },
    margin: {
      none: "m-0",
      xs: "m-1",
      sm: "m-2",
      md: "m-3",
      lg: "m-4",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    full: {
      true: "w-full h-full",
      width: "w-full",
      height: "h-full",
    },
  },
  defaultVariants: {
    display: "block",
    padding: "none",
    gap: "none",
  },
});

export interface BoxProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {
  as?: React.ElementType;
}

const Box = ({
  className,
  display,
  direction,
  align,
  justify,
  padding,
  margin,
  gap,
  wrap,
  full,
  as: Component = "div",
  ...props
}: BoxProps) => {
  return (
    <Component
      className={cn(
        boxVariants({
          display,
          direction:
            display === "flex" || display === "inlineFlex"
              ? direction
              : undefined,
          align:
            display === "flex" || display === "inlineFlex" ? align : undefined,
          justify:
            display === "flex" || display === "inlineFlex"
              ? justify
              : undefined,
          padding,
          margin,
          gap:
            display === "flex" || display === "inlineFlex" || display === "grid"
              ? gap
              : undefined,
          wrap,
          full,
          className,
        }),
      )}
      role="box"
      {...props}
    />
  );
};

export default Box;

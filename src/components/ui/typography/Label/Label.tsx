import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva("transition-colors duration-200", {
  variants: {
    variant: {
      heading: "text-[16px] text-foreground",
      subheading: "text-[14px] text-muted-foreground",
      title: "text-[14px] text-foreground",
      subtitle: "text-[12px] text-muted-foreground",
      body: "text-[12px] text-foreground",
      label: "text-[10px] text-muted-foreground tracking-widest",
      input: "text-[8px] text-muted-foreground tracking-wider",
    },
  },
  defaultVariants: {
    variant: "title",
  },
});

export interface LabelProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof labelVariants> {
  /**
   * The typography variant of the label.
   * "heading" and "subheading" are for large, page-level text.
   * "title" and "subtitle" are for section-level text.
   * "body" is for normal text, and "label" is for small uppercase identifiers.
   */
  variant?: VariantProps<typeof labelVariants>["variant"];
}

const Label = ({ className, variant, children, ...props }: LabelProps) => {
  return (
    <span className={cn(labelVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
};

export default Label;

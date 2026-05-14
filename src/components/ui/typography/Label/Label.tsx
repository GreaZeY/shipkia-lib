import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva("transition-colors duration-200", {
  variants: {
    variant: {
      heading: "text-xl text-foreground",
      subheading: "text-l text-muted-foreground",
      title: "text-title-large text-foreground",
      subtitle: "text-title-medium text-muted-foreground",
      body: "text-body-large text-foreground",
      label: "text-xs text-muted-foreground tracking-widest",
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

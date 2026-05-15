import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { hoverVariant, tapVariant } from "@/lib/motion";

const cardVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "border border-border bg-card text-card-foreground shadow-sm",
        glass: "water-lens border border-white/10",
        outline: "border border-border bg-transparent shadow-none",
        ghost: "border-none bg-transparent shadow-none",
      },
      padding: {
        none: "p-0",
        xs: "p-1.5",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md transition-shadow duration-200",
        false: "",
      },
    },
    defaultVariants: {
      variant: "glass",
      padding: "md",
      radius: "2xl",
      interactive: false,
    },
  },
);

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = ({
  className,
  variant,
  padding,
  radius,
  interactive,
  ...props
}: CardProps) => {
  return (
    <motion.div
      className={cn(
        cardVariants({ variant, padding, radius, interactive, className }),
      )}
      whileHover={interactive ? hoverVariant : undefined}
      whileTap={interactive ? tapVariant : undefined}
      role="card"
      {...(props as any)}
    />
  );
};

export default Card;

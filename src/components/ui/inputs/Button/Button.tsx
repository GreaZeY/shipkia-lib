import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { LoaderCircle } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@components/ui/inputs/Button/Button.styles";
import { motion } from "motion/react";
import { tapVariant } from "@/lib/motion";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * The visual style variant of the button.
   */
  variant?: VariantProps<typeof buttonVariants>["variant"];
  /**
   * The size of the button, affecting padding and typography.
   */
  size?: VariantProps<typeof buttonVariants>["size"];
  /**
   * Renders the button as its child element, passing all props down. Useful for routing links.
   */
  asChild?: boolean;
  /**
   * An optional icon element to render inside the button.
   */
  icon?: React.ReactNode;
  /**
   * Alias for icon. Kept for older call sites.
   */
  startIcon?: React.ReactNode;
  /**
   * Optional icon rendered after the button text.
   */
  endIcon?: React.ReactNode;
  /**
   * The position of the icon relative to the button text.
   * @default "left"
   */
  iconPosition?: "left" | "right";
  /**
   * Shows a small spinner and disables the button while work is pending.
   */
  loading?: boolean;
  /**
   * Reference to the underlying HTMLButtonElement.
   */
  ref?: React.Ref<HTMLButtonElement>;
}

// Ensure Slot is compatible with motion
const MotionSlot = motion.create(Slot);

const Button = ({
  className,
  variant,
  size,
  isActive,
  icon,
  startIcon,
  endIcon,
  iconPosition = "left",
  loading = false,
  asChild = false,
  children,
  disabled,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? MotionSlot : motion.button;
  const leadingIcon = loading ? (
    <LoaderCircle size={16} className="animate-spin" />
  ) : (
    (startIcon ?? icon)
  );

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, isActive, className }))}
      ref={ref}
      disabled={disabled || loading}
      whileTap={!(disabled || loading) ? tapVariant : undefined}
      {...(props as any)}
    >
      {leadingIcon && iconPosition === "left" && (
        <span className={cn("inline-flex shrink-0", children ? "mr-2.5" : "")}>
          {leadingIcon}
        </span>
      )}
      {children}
      {leadingIcon && iconPosition === "right" && (
        <span className={cn("inline-flex shrink-0", children ? "ml-2.5" : "")}>
          {leadingIcon}
        </span>
      )}
      {endIcon && (
        <span className={cn("inline-flex shrink-0", children ? "ml-2.5" : "")}>
          {endIcon}
        </span>
      )}
    </Comp>
  );
};

export default Button;

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SPRING_DEFAULT, SPRING_SOFT } from "@/lib/motion";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
  {
    variants: {
      size: {
        sm: "h-4 w-8",
        md: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbVariants = cva(
  "pointer-events-none block flex items-center justify-center rounded-full bg-white shadow-lg ring-0",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbXTranslation = {
  sm: 16, // translate-x-4
  md: 16, // translate-x-4
  lg: 20, // translate-x-5
};

export interface SwitchProps
  extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  /**
   * The icon displayed inside the thumb when the switch is active.
   */
  activeThumbIcon?: React.ReactNode;
  /**
   * The icon displayed inside the thumb when the switch is inactive.
   */
  inactiveThumbIcon?: React.ReactNode;
  /**
   * Reference to the underlying Switch primitive.
   */
  ref?: React.Ref<React.ElementRef<typeof SwitchPrimitives.Root>>;
}

const Switch = ({
  className,
  size = "md",
  activeThumbIcon,
  inactiveThumbIcon,
  ref,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  ...props
}: SwitchProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleCheckedChange = (value: boolean) => {
    if (!isControlled) setInternalChecked(value);
    onCheckedChange?.(value);
  };

  return (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ size, className }))}
      checked={checked}
      onCheckedChange={handleCheckedChange}
      ref={ref}
      {...props}
    >
      <SwitchPrimitives.Thumb asChild>
        <motion.span
          className={cn(thumbVariants({ size }))}
          animate={{ x: checked ? thumbXTranslation[size || "md"] : 0 }}
          transition={SPRING_DEFAULT}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {checked && activeThumbIcon ? (
              <motion.div
                key="active"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 0.75, opacity: 1 }}
                exit={{ scale: 0.2, opacity: 0 }}
                transition={SPRING_SOFT}
                className="text-black flex items-center justify-center absolute"
              >
                {activeThumbIcon}
              </motion.div>
            ) : null}
            {!checked && inactiveThumbIcon ? (
              <motion.div
                key="inactive"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 0.75, opacity: 1 }}
                exit={{ scale: 0.2, opacity: 0 }}
                transition={SPRING_SOFT}
                className="text-muted-foreground flex items-center justify-center absolute"
              >
                {inactiveThumbIcon}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.span>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
};

export default Switch;

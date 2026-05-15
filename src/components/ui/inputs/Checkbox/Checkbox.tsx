import { useId, useState, type ComponentProps } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import Box from "@/components/ui/containers/Box/Box";
import { motion, AnimatePresence } from "motion/react";
import { SPRING_DEFAULT } from "@/lib/motion";

export interface CheckboxProps extends ComponentProps<
  typeof CheckboxPrimitive.Root
> {
  /**
   * The primary label displayed next to the checkbox.
   */
  label?: string;
  /**
   * Secondary description text displayed below the label.
   */
  description?: string;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <motion.svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
    animate={{ pathLength: 1, opacity: 1, scale: 1 }}
    exit={{ pathLength: 0, opacity: 0, scale: 0.8 }}
    transition={SPRING_DEFAULT}
  >
    <motion.path d="M20 6 9 17l-5-5" />
  </motion.svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <motion.svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    transition={SPRING_DEFAULT}
  >
    <path d="M5 12h14" />
  </motion.svg>
);

const Checkbox = ({
  className,
  label,
  description,
  ref,
  id,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxProps & { id?: string }) => {
  const generatedId = useId();
  const elementId = id || generatedId;

  const [internalChecked, setInternalChecked] = useState<
    boolean | "indeterminate"
  >(defaultChecked ?? false);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleCheckedChange = (value: boolean | "indeterminate") => {
    if (!isControlled) setInternalChecked(value);
    onCheckedChange?.(value);
  };

  return (
    <Box display="flex" align="start" gap="sm" className="relative">
      <CheckboxPrimitive.Root
        ref={ref}
        id={elementId}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded border-2 border-input bg-background shadow-sm transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
          className,
        )}
        {...props}
        label=""
      >
        <CheckboxPrimitive.Indicator
          forceMount
          className="flex items-center justify-center text-current"
        >
          <AnimatePresence mode="wait">
            {checked === true && <CheckIcon key="check" />}
            {checked === "indeterminate" && <MinusIcon key="minus" />}
          </AnimatePresence>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {(label || description) && (
        <Box
          display="flex"
          direction="column"
          gap="none"
          className="leading-none"
        >
          {label && (
            <label
              htmlFor={elementId}
              className="cursor-pointer text-body-medium font-bold text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="mt-1 text-[10px] leading-tight text-muted-foreground">
              {description}
            </p>
          )}
        </Box>
      )}
    </Box>
  );
};
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export default Checkbox;

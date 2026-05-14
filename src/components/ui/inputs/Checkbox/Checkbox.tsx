import { useId, type ComponentProps } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import Box from "@/components/ui/containers/Box/Box";

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

const Checkbox = ({
  className,
  label,
  description,
  ref,
  id,
  ...props
}: CheckboxProps & { id?: string }) => {
  const generatedId = useId();

  const elementId = id || generatedId;

  return (
    <Box display="flex" align="start" gap="sm" className="relative">
      <CheckboxPrimitive.Root
        ref={ref}
        id={elementId}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded border-2 border-input bg-background shadow-sm transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            "group/indicator flex items-center justify-center text-current",
          )}
        >
          <Check
            className="hidden h-3 w-3 group-data-[state=checked]/indicator:block"
            strokeWidth={4}
          />
          <Minus
            className="hidden h-3 w-3 group-data-[state=indeterminate]/indicator:block"
            strokeWidth={4}
          />
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

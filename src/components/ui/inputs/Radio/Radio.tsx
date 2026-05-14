import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "../../../../lib/utils";
import Box from "../../containers/Box/Box";

export interface RadioOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> {
  /**
   * Array of options to render as radio items.
   */
  options?: RadioOption[];
  /**
   * Layout orientation of the radio items.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    { className, options, orientation = "vertical", children, ...props },
    ref,
  ) => {
    return (
      <RadioGroupPrimitive.Root
        className={cn("w-full", className)}
        {...props}
        ref={ref}
      >
        <Box
          display="flex"
          direction={orientation === "vertical" ? "column" : "row"}
          gap={orientation === "vertical" ? "sm" : "md"}
          wrap={orientation === "horizontal"}
        >
          {options
            ? options.map((option) => (
                <RadioGroupItem
                  key={option.id}
                  value={option.id}
                  id={option.id}
                  label={option.label}
                  description={option.description}
                  disabled={option.disabled}
                />
              ))
            : children}
        </Box>
      </RadioGroupPrimitive.Root>
    );
  },
);
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label?: string;
    description?: string;
  }
>(({ className, label, description, id, ...props }, ref) => {
  const generatedId = React.useId();
  const elementId = id || generatedId;

  return (
    <Box display="flex" align="start" gap="sm" className="relative">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={elementId}
        className={cn(
          "aspect-square h-4 w-4 shrink-0 rounded-full border-2 border-input bg-background text-primary shadow-sm transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10",
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2 w-2 fill-current text-primary" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {(label || description) && (
        <Box
          display="flex"
          direction="column"
          gap="xs"
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
            <p className="text-[10px] leading-tight text-muted-foreground">
              {description}
            </p>
          )}
        </Box>
      )}
    </Box>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export default RadioGroup;
export { RadioGroupItem };

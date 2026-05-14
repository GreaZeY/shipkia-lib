import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";
import { useState } from "react";

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
  "pointer-events-none block flex items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        md: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

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
  ...props
}: SwitchProps) => {
  const [checked, setChecked] = useState(
    props.defaultChecked || props.checked || false,
  );

  const handleCheckedChange = (value: boolean) => {
    setChecked(value);
    props.onCheckedChange?.(value);
  };

  // // Handle controlled state
  // useEffect(() => {
  //   if (props.checked !== undefined) {
  //     setChecked(props.checked);
  //   }
  // }, [props.checked]);

  return (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ size, className }))}
      {...props}
      onCheckedChange={handleCheckedChange}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={cn(thumbVariants({ size }))}>
        {checked ? (
          <div className="animate-in zoom-in-50 scale-75 text-black duration-200">
            {activeThumbIcon}
          </div>
        ) : (
          <div className="animate-in zoom-in-50 scale-75 text-muted-foreground duration-200">
            {inactiveThumbIcon}
          </div>
        )}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
};

export default Switch;

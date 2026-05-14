import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../../../lib/utils";
import { containerVariants } from "./Container.styles";

export interface ContainerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  fluid?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const Container = ({
  className,
  variant,
  radius,
  elevation,
  padding,
  fluid = false,
  children,
  ref,
  ...props
}: ContainerProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        containerVariants({ variant, radius, elevation, padding, className }),
        fluid && "w-full max-w-none",
      )}
      role="container"
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;

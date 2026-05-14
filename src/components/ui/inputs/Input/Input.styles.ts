import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "flex w-full border-2 text-foreground outline-none focus-visible:outline-none transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background shadow-sm",
        ghost: "border-transparent bg-transparent shadow-none",
      },
      size: {
        sm: "h-7.5 px-3 text-xs rounded-full p-1",
        md: "h-9 px-4 text-sm rounded-full",
        lg: "h-11 px-5 text-base rounded-full",
      },
      hasError: {
        true: "border-destructive focus:border-destructive focus:ring-destructive/10",
        false: "focus:border-primary/50 focus:ring-primary/10",
      },
      hasStartIcon: {
        true: "",
        false: "",
      },
      hasEndIcon: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        hasStartIcon: true,
        className: "pl-9",
      },
      {
        size: "sm",
        hasEndIcon: true,
        className: "pr-9",
      },
      {
        size: "md",
        hasStartIcon: true,
        className: "pl-11",
      },
      {
        size: "md",
        hasEndIcon: true,
        className: "pr-11",
      },
      {
        size: "lg",
        hasStartIcon: true,
        className: "pl-12",
      },
      {
        size: "lg",
        hasEndIcon: true,
        className: "pr-12",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      hasError: false,
      hasStartIcon: false,
      hasEndIcon: false,
    },
  },
);

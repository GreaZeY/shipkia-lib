import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] active:translate-y-[1px]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-105 active:shadow-inner",
        secondary:
          "bg-secondary-container text-secondary-on-container hover:bg-secondary-container/80 active:shadow-inner",
        outline:
          "border border-border bg-background/50 backdrop-blur-sm text-foreground hover:bg-background hover:shadow-sm active:bg-muted",
        ghost:
          "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:bg-muted",
        danger:
          "bg-error text-error-foreground hover:bg-error/90 shadow-lg shadow-error/10 active:shadow-inner",
        list: "w-full justify-start px-4 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground active:scale-[0.99] active:translate-y-0",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7.5 px-3 py-1 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-9 w-9",
      },
      isActive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "list",
        isActive: true,
        className:
          "bg-foreground text-background hover:bg-foreground hover:text-background shadow-lg",
      },
      {
        variant: ["primary", "secondary", "outline", "ghost", "danger"],
        isActive: true,
        className: "ring-2 ring-primary ring-offset-2",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
      isActive: false,
    },
  },
);

import { cva } from "class-variance-authority";

export const containerVariants = cva("transition-all duration-300", {
  variants: {
    variant: {
      surface: "bg-card text-foreground",
      primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
      secondary: "bg-muted text-muted-foreground",
      error: "bg-error-container text-error-on-container",
      outline: "border bg-transparent",
      ghost: "bg-transparent",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      "4xl": "rounded-[40px]",
      full: "rounded-full",
    },
    elevation: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl",
    },
    padding: {
      none: "p-0",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
      "2xl": "p-10",
      "3xl": "p-12",
    },
  },
  defaultVariants: {
    variant: "ghost",
    radius: "2xl",
    elevation: "none",
    padding: "md",
  },
});

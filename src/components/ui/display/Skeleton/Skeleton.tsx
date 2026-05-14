import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text";
}

const Skeleton = ({ className, variant = "rect", ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/40",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-md",
        variant === "text" && "h-4 w-full rounded",
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;

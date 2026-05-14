import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@components/ui/inputs/Button/Button";

const drawerVariants = cva(
  "z-50 flex flex-col gap-4 p-6 transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      position: {
        top: "inset-x-0 top-0 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top drawer-top",
        bottom:
          "inset-x-0 bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom drawer-bottom",
        left: "inset-y-0 left-0 h-full data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm drawer-left",
        right:
          "inset-y-0 right-0 h-full border-l border-white/10 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm drawer-right",
      },
      variant: {
        temporary: "fixed w-3/4 shadow-2xl water-lens",
        persistent: "relative w-full h-full bg-background border-none shadow-none",
      },
    },
    defaultVariants: {
      position: "right",
      variant: "temporary",
    },
  },
);

export interface DrawerProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  variant?: "temporary" | "persistent";
  position?: VariantProps<typeof drawerVariants>["position"];
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Drawer = ({
  open,
  onOpenChange,
  defaultOpen,
  variant = "temporary",
  position = "right",
  trigger,
  title,
  description,
  footer,
  children,
  className,
}: DrawerProps) => {
  const isPersistent = variant === "persistent";

  const renderTitle = () => {
    if (!title) return null;
    const inner = <div className="text-lg font-bold text-foreground">{title}</div>;
    if (isPersistent) return inner;
    return <DialogPrimitive.Title asChild>{inner}</DialogPrimitive.Title>;
  };

  const renderDescription = () => {
    if (!description) return null;
    const inner = <div className="text-sm text-muted-foreground">{description}</div>;
    if (isPersistent) return inner;
    return <DialogPrimitive.Description asChild>{inner}</DialogPrimitive.Description>;
  };

  const content = (
    <div className="flex h-full flex-col">
      {(title || description) && (
        <div className="flex flex-col gap-1 pb-4">
          {renderTitle()}
          {renderDescription()}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">{children}</div>

      {footer && <div className="mt-4 border-t pt-4">{footer}</div>}

      {!isPersistent && (
        <DialogPrimitive.Close asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );

  if (isPersistent) {
    return (
      <div
        className={cn(
          drawerVariants({ position, variant }),
          !open && "hidden",
          className,
        )}
        data-state={open ? "open" : "closed"}
      >
        {content}
      </div>
    );
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/5 backdrop-blur-[2px]" />

        <DialogPrimitive.Content
          onInteractOutside={(e) => {
            if (isPersistent) {
              e.preventDefault();
            }
          }}
          className={cn(drawerVariants({ position, variant }), className)}
        >
          {content}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Drawer;

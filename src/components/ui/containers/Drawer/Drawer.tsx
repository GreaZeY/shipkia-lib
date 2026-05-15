import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@components/ui/inputs/Button/Button";
import { motion, AnimatePresence } from "motion/react";
import { SPRING_DEFAULT, PREMIUM_EASE } from "@/lib/motion";

const drawerVariants = cva(
  "z-50 flex flex-col gap-4 p-6",
  {
    variants: {
      position: {
        top: "inset-x-0 top-0",
        bottom: "inset-x-0 bottom-0",
        left: "inset-y-0 left-0 h-full sm:max-w-sm",
        right: "inset-y-0 right-0 h-full border-l border-white/10 sm:max-w-sm",
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

const getSlideVariants = (position: "top" | "bottom" | "left" | "right") => {
  switch (position) {
    case "top":
      return { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } };
    case "bottom":
      return { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };
    case "left":
      return { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } };
    case "right":
    default:
      return { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };
  }
};

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
  
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

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
          !currentOpen && "hidden",
          className,
        )}
      >
        {content}
      </div>
    );
  }

  const slideVariants = getSlideVariants(position as any);

  return (
    <DialogPrimitive.Root
      open={currentOpen}
      onOpenChange={handleOpenChange}
    >
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}

      <AnimatePresence>
        {currentOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15, ease: PREMIUM_EASE } }}
                exit={{ opacity: 0, transition: { duration: 0.1, ease: PREMIUM_EASE } }}
                className="fixed inset-0 z-50 bg-black/5 backdrop-blur-[2px]"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              onInteractOutside={(e) => {
                if (isPersistent) {
                  e.preventDefault();
                }
              }}
              asChild
            >
              <motion.div
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={SPRING_DEFAULT}
                className={cn(drawerVariants({ position, variant }), className)}
              >
                {content}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default Drawer;

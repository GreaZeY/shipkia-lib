import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { PREMIUM_EASE, SPRING_DEFAULT } from "@/lib/motion";

const PopoverContext = React.createContext<{ open: boolean }>({ open: false });

export interface PopoverProps extends React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Root
> {}

const Popover = ({
  open,
  onOpenChange,
  defaultOpen,
  children,
  ...props
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider value={{ open: currentOpen }}>
      <PopoverPrimitive.Root
        open={currentOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const { open } = React.useContext(PopoverContext);

  return (
    <AnimatePresence>
      {open && (
        <PopoverPrimitive.Portal forceMount>
          <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            asChild
            {...props}
          >
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 4,
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "z-50 w-72 rounded-2xl border border-border bg-card p-2 text-card-foreground shadow-xl outline-none",
                className,
              )}
            >
              {props.children}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export default Popover;
export { PopoverTrigger, PopoverContent, PopoverAnchor };

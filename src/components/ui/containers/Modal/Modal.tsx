import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button, { type ButtonProps } from "@components/ui/inputs/Button/Button";
import { motion, AnimatePresence } from "motion/react";
import { modalEntranceVariant, PREMIUM_EASE } from "@/lib/motion";

export interface ModalControl extends ButtonProps {
  label: string;
  metadata?: unknown;
}

export interface ModalControls {
  leftControls?: ModalControl[];
  rightControls?: ModalControl[];
}

export interface ModalProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Root
> {
  id?: string;
  title?: React.ReactNode;
  content?: React.ReactNode;
  controls?: ModalControls;
  onClick?: (action: string, metadata?: unknown) => void;
  alert?: boolean;
  noControls?: boolean;
  trigger?: React.ReactNode;
  className?: string;
}

const Modal = ({
  id,
  title,
  content,
  controls: customControls,
  onClick,
  alert = false,
  noControls = false,
  trigger,
  className,
  open,
  onOpenChange,
  defaultOpen,
}: ModalProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  // Determine the controls to render
  const controls: ModalControls = React.useMemo(() => {
    if (customControls) return customControls;
    if (noControls) return { leftControls: [], rightControls: [] };

    if (alert) {
      return {
        rightControls: [{ label: "ok", variant: "primary" }],
      };
    }

    return {
      rightControls: [
        { label: "No", variant: "outline" },
        { label: "Yes", variant: "primary" },
      ],
    };
  }, [customControls, noControls, alert]);

  // Handle click wrapper
  const handleControlClick = (
    control: ModalControl,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    control.onClick?.(e);
    onClick?.(control.label, control.metadata);
  };

  const renderControlGroup = (group?: ModalControl[]) => {
    if (!group || group.length === 0) return null;

    return (
      <div className="flex items-center gap-2">
        {group.map((control, idx) => (
          <DialogPrimitive.Close asChild key={control.label + idx}>
            <Button
              variant={control.variant || "primary"}
              disabled={control.disabled}
              onClick={(e) => handleControlClick(control, e)}
              icon={control.icon}
              iconPosition={control.iconPosition}
              size={control.size || "sm"}
            >
              {control.label}
            </Button>
          </DialogPrimitive.Close>
        ))}
      </div>
    );
  };

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

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <DialogPrimitive.Content
                id={id}
                asChild
              >
                <motion.div
                  variants={modalEntranceVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={cn(
                    "water-lens relative flex w-full max-w-lg flex-col gap-4 rounded-3xl border border-white/10 p-6 shadow-2xl pointer-events-auto",
                    className,
                  )}
                >
                  <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    {title && (
                      <DialogPrimitive.Title className="text-xl font-bold leading-none tracking-tight">
                        {title}
                      </DialogPrimitive.Title>
                    )}
                  </div>

                  {content && (
                    <DialogPrimitive.Description asChild>
                      <div className="text-sm text-muted-foreground">{content}</div>
                    </DialogPrimitive.Description>
                  )}

                  {!noControls && (
                    <div
                      className={cn(
                        "mt-4 flex flex-col-reverse gap-4 sm:flex-row sm:items-center",
                        controls.leftControls?.length ? "justify-between" : "justify-end",
                      )}
                    >
                      {renderControlGroup(controls.leftControls)}
                      {renderControlGroup(controls.rightControls)}
                    </div>
                  )}

                  <DialogPrimitive.Close asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4 h-8 w-8 rounded-full opacity-70 transition-opacity hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </DialogPrimitive.Close>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default Modal;

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button, { type ButtonProps } from "../../inputs/Button/Button";

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
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      {trigger && (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      )}

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/5 backdrop-blur-[2px]" />

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPrimitive.Content
            id={id}
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 water-lens relative flex w-full max-w-lg flex-col gap-4 rounded-3xl border border-white/10 p-6 shadow-2xl duration-200",
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
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Modal;

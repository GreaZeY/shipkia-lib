import { useState, useCallback } from "react";

export interface UseListNavigationProps {
  itemCount: number;
  isOpen: boolean;
  onSelect: (index: number) => void;
  onClose?: () => void;
  onOpen?: () => void;
  initialIndex?: number;
}

export const useListNavigation = ({
  itemCount,
  isOpen,
  onSelect,
  onClose,
  onOpen,
  initialIndex = -1,
}: UseListNavigationProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setActiveIndex(initialIndex);
    }
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          onOpen?.();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < itemCount - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < itemCount) {
            onSelect(activeIndex);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose?.();
          break;
        case "Tab":
          // Let tab naturally move focus, but close popover
          onClose?.();
          break;
      }
    },
    [isOpen, itemCount, activeIndex, onSelect, onClose, onOpen],
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
};

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelect, type SelectOption } from "@/hooks/useSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../containers/Popover/Popover";
import Box from "../../containers/Box/Box";
import Chip from "../../display/Chip/Chip";
import Input from "../Input/Input";
import { SelectTrigger } from "./SelectTrigger";
import { useListNavigation } from "@/hooks/useListNavigation";
import Skeleton from "../../display/Skeleton/Skeleton";

// Lazy load the virtualized list to keep the initial bundle small
const VirtualizedList = React.lazy(() => import("./VirtualizedList"));
const DropList = React.lazy(() => import("./DropList"));

const SelectContent = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <PopoverContent className={cn("p-1", className)} align="start" style={style}>
    <Box
      display="flex"
      direction="column"
      className="custom-scrollbar max-h-[350px] overflow-y-auto"
    >
      {children}
    </Box>
  </PopoverContent>
);

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (data: {
    value: string | string[];
    newValue: string;
    error: string | null;
    metadata: SelectOption | null;
  }) => void;
  onSearch?: (query: string) => void;
  useVirtual?: boolean;
  multi?: boolean;
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  maxVisibleChips?: number;
  variant?: "outline" | "ghost" | "button";
  onBlur?: () => void;
  defaultOpen?: boolean;
  defaultValue?: string | string[];
}

const Select = ({
  options,
  value,
  onChange,
  onSearch,
  useVirtual = false,
  multi = true,
  label,
  placeholder = "Select option...",
  icon: startIcon,
  className,
  disabled,
  maxVisibleChips = 2,
  variant = "outline",
  onBlur,
  defaultOpen = false,
  defaultValue,
}: SelectProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    isOpen,
    setIsOpen,
    value: internalValue,
    selectedOptions,
    handleSelect,
    removeValue,
  } = useSelect({
    options,
    value: value ?? defaultValue,
    onChange,
    multi,
    defaultOpen,
  });

  const [triggerWidth, setTriggerWidth] = React.useState(300);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Measure trigger width when dropdown opens or selection changes to keep layout in sync
  React.useLayoutEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [isOpen, selectedOptions]);

  const [isFocused, setIsFocused] = React.useState(false);
  const isGhost = variant === "ghost";

  // Filter options based on search query if internal search is used
  const filteredOptions = React.useMemo(() => {
    if (onSearch || !searchQuery) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery, onSearch]);

  const { activeIndex, setActiveIndex, handleKeyDown } = useListNavigation({
    itemCount: filteredOptions.length,
    isOpen,
    onSelect: (index) => handleSelect(filteredOptions[index].id),
    onClose: () => setIsOpen(false),
    onOpen: () => setIsOpen(true),
    initialIndex:
      selectedOptions.length > 0
        ? options.findIndex((opt) => opt.id === selectedOptions[0].id)
        : 0,
  });

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    onSearch?.(val);
    setActiveIndex(0); // Reset to top when searching
  };

  const renderTriggerContent = () => {
    if (selectedOptions.length === 0) {
      if (isGhost || !label) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }
      return null;
    }

    if (multi) {
      const visibleOptions =
        isOpen || isFocused
          ? selectedOptions
          : selectedOptions.slice(0, maxVisibleChips);
      const remainingCount = selectedOptions.length - visibleOptions.length;

      return (
        <Box
          display="flex"
          align="center"
          gap="xs"
          wrap
          className="max-w-full overflow-hidden"
        >
          {visibleOptions.map((opt) => (
            <Chip
              key={opt.id}
              variant="primary"
              onRemove={() => {
                removeValue(opt.id);
              }}
              icon={opt.icon}
            >
              {opt.label}
            </Chip>
          ))}
          {remainingCount > 0 && (
            <Chip variant="secondary">+{remainingCount}</Chip>
          )}
        </Box>
      );
    }

    return (
      <Box display="flex" align="center" gap="sm" className="w-full">
        {selectedOptions[0].icon}
        {selectedOptions[0].label}
      </Box>
    );
  };

  return (
    <Box
      display="flex"
      direction="column"
      gap={isGhost ? "none" : "xs"}
      className={cn(variant === "button" ? "w-fit" : "w-full", className)}
    >
      <div
        className={cn("relative", className?.includes("h-full") && "h-full")}
      >
        {/* Fieldset for floating label border gap */}
        {label && !isGhost && (
          <fieldset
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 z-10 m-0 rounded-full border-2 transition-all duration-200",
              isOpen || isFocused
                ? "border-primary ring-2 ring-primary/10"
                : "border-input",
            )}
          >
            <legend
              className={cn(
                "invisible ml-4 h-0 overflow-hidden whitespace-nowrap px-0 text-[10.5px] font-bold transition-all duration-200",
                isOpen || selectedOptions.length > 0
                  ? "max-w-full"
                  : "max-w-[0.01px]",
              )}
            >
              <span className="px-[3px] opacity-0">{label}</span>
            </legend>
          </fieldset>
        )}

        {/* Floating label — skip for ghost variant */}
        {label && !isGhost && (
          <label
            className={cn(
              "pointer-events-none absolute z-10 origin-top-left px-1 transition-all duration-200",
              isOpen || selectedOptions.length > 0
                ? "left-4 top-0 -translate-y-[37.5%] translate-x-[2px] scale-75 text-[13px] font-bold text-primary"
                : "left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
            )}
          >
            {label}
          </label>
        )}
        <Popover
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) onBlur?.();
          }}
        >
          <PopoverTrigger asChild>
            <SelectTrigger
              ref={triggerRef}
              className={cn(
                label && !isGhost && "!border-transparent !ring-transparent",
                "focus-visible:outline-none",
              )}
              isOpen={isOpen}
              multi={multi}
              hasSelection={selectedOptions.length > 0}
              disabled={disabled}
              icon={startIcon}
              variant={variant}
              count={selectedOptions.length}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                if (!isOpen) onBlur?.();
              }}
              onKeyDown={handleKeyDown}
            >
              {renderTriggerContent()}
            </SelectTrigger>
          </PopoverTrigger>
          <SelectContent
            className="w-full min-w-[200px]"
            style={{ width: triggerWidth > 0 ? triggerWidth : "auto" }}
          >
            {options.length > 5 && (
              <Box
                padding="xs"
                className="mb-1 border-b border-border"
                onKeyDown={handleKeyDown}
              >
                <Input
                  size="sm"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(data) => handleSearchChange(data.value)}
                  startIcon={<Search />}
                  className="border-transparent bg-muted/30 focus:border-primary/20"
                  autoFocus // Auto-focus search input when available
                />
              </Box>
            )}

            {filteredOptions.length === 0 ? (
              <Box
                padding="xl"
                align="center"
                justify="center"
                className="text-xs italic text-muted-foreground"
              >
                No results found
              </Box>
            ) : useVirtual || filteredOptions.length > 1000 ? (
              <React.Suspense
                fallback={
                  <Box display="flex" direction="column" gap="xs" padding="xs">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </Box>
                }
              >
                <VirtualizedList
                  options={filteredOptions}
                  value={internalValue}
                  multi={multi}
                  onSelect={handleSelect}
                  dropdownWidth={triggerWidth}
                  activeIndex={activeIndex}
                />
              </React.Suspense>
            ) : (
              <React.Suspense
                fallback={
                  <Box display="flex" direction="column" gap="xs" padding="xs">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </Box>
                }
              >
                <DropList
                  options={filteredOptions}
                  value={internalValue}
                  multi={multi}
                  onSelect={handleSelect}
                  activeIndex={activeIndex}
                  onKeyDown={handleKeyDown}
                />
              </React.Suspense>
            )}
          </SelectContent>
        </Popover>
      </div>
    </Box>
  );
};

export default Select;

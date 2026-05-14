import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAutocomplete,
  type UseAutocompleteProps,
} from "@/hooks/useAutocomplete";
import Popover, {
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/containers/Popover/Popover";
import Box from "@components/ui/containers/Box/Box";
import Chip from "@components/ui/display/Chip/Chip";
import { useListNavigation } from "@/hooks/useListNavigation";
import Skeleton from "@components/ui/display/Skeleton/Skeleton";

// Lazy load the virtualized list to keep the initial bundle small
const VirtualizedList = React.lazy(() => import("../Select/VirtualizedList"));
const DropList = React.lazy(() => import("../Select/DropList"));

export interface AutocompleteProps extends UseAutocompleteProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: "outline" | "ghost";
  startIcon?: React.ReactNode;
  maxVisibleChips?: number;
  onBlur?: () => void;
  useVirtual?: boolean;
}

const AutocompleteContent = ({
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

const Autocomplete = ({
  options,
  value,
  onChange,
  multi = false,
  required = false,
  allowCustom = false,
  label,
  placeholder,
  disabled = false,
  className,
  variant = "outline",
  startIcon,
  maxVisibleChips = 5,
  onBlur,
  useVirtual = false,
}: AutocompleteProps) => {
  const {
    isOpen,
    setIsOpen,
    selectedOptions,
    filteredOptions,
    searchQuery,
    setSearchQuery,
    handleSelect,
    removeValue,
  } = useAutocomplete({
    options,
    value,
    onChange,
    multi,
    required,
    allowCustom,
  });

  const [isFocused, setIsFocused] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState(0);

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef.current?.offsetWidth]);

  // Handle keyboard navigation
  const { activeIndex, handleKeyDown: handleListKeyDown } = useListNavigation({
    options: filteredOptions,
    onSelect: handleSelect,
    isOpen,
    setIsOpen,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Backspace" &&
      searchQuery === "" &&
      multi &&
      selectedOptions.length > 0
    ) {
      removeValue(selectedOptions[selectedOptions.length - 1].id);
      return;
    }
    handleListKeyDown(e);
  };

  const isGhost = variant === "ghost";

  return (
    <Box
      display="flex"
      direction="column"
      gap={isGhost ? "none" : "xs"}
      className={cn("w-full", className)}
    >
      <div
        ref={triggerRef}
        className={cn(
          "relative w-full",
          className?.includes("h-full") && "h-full",
        )}
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
                isOpen || isFocused || selectedOptions.length > 0
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
              isOpen || isFocused || selectedOptions.length > 0
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
            <div
              className={cn(
                "flex min-h-[40px] w-full flex-wrap items-center gap-1.5 rounded-full border border-input px-3 py-1.5 transition-all duration-200 focus-within:border-primary/50",
                disabled && "cursor-not-allowed opacity-50",
                label && !isGhost && "!border-transparent !ring-transparent",
                className,
              )}
              onClick={() => inputRef.current?.focus()}
            >
              {startIcon && (
                <div className="text-muted-foreground">{startIcon}</div>
              )}

              {multi && (
                <Box
                  display="flex"
                  align="center"
                  gap="xs"
                  wrap
                  className="max-w-full overflow-hidden"
                >
                  {selectedOptions.slice(0, maxVisibleChips).map((opt) => (
                    <Chip
                      key={opt.id}
                      variant="primary"
                      onRemove={() => removeValue(opt.id)}
                      icon={opt.icon}
                    >
                      {opt.label}
                    </Chip>
                  ))}
                  {selectedOptions.length > maxVisibleChips && (
                    <Chip variant="secondary">
                      +{selectedOptions.length - maxVisibleChips}
                    </Chip>
                  )}
                </Box>
              )}

              <input
                ref={inputRef}
                type="text"
                className="min-w-[50px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                placeholder={selectedOptions.length === 0 ? placeholder : ""}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!isOpen) setIsOpen(true);
                }}
                onFocus={() => {
                  setIsFocused(true);
                  if (!isOpen) setIsOpen(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  if (!isOpen) onBlur?.();
                }}
                onKeyDown={handleKeyDown}
                disabled={disabled}
              />

              {selectedOptions.length > 0 && !multi && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect("");
                    setSearchQuery("");
                  }}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <X size={14} className="text-muted-foreground" />
                </button>
              )}
            </div>
          </PopoverTrigger>
          <AutocompleteContent
            className="w-full min-w-[200px]"
            style={{ width: triggerWidth > 0 ? triggerWidth : "auto" }}
          >
            {filteredOptions.length === 0 ? (
              <Box
                padding="xl"
                align="center"
                justify="center"
                className="text-xs italic text-muted-foreground"
              >
                {allowCustom && searchQuery
                  ? `Press Enter to add "${searchQuery}"`
                  : "No results found"}
              </Box>
            ) : useVirtual || filteredOptions.length > 1000 ? (
              <React.Suspense
                fallback={
                  <Box display="flex" direction="column" gap="xs" padding="xs">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </Box>
                }
              >
                <VirtualizedList
                  options={filteredOptions}
                  value={value as string | string[]}
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
                  value={value as string | string[]}
                  multi={multi}
                  onSelect={handleSelect}
                  activeIndex={activeIndex}
                  onKeyDown={handleKeyDown}
                />
              </React.Suspense>
            )}
          </AutocompleteContent>
        </Popover>
      </div>
    </Box>
  );
};

export default Autocomplete;

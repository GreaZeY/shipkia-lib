import { useState, useCallback, useMemo } from "react";
import type { SelectOption, UseSelectProps } from "@/hooks/useSelect";

export interface UseAutocompleteProps extends UseSelectProps {
  allowCustom?: boolean;
}

export const useAutocomplete = ({
  options,
  value: initialValue,
  onChange,
  multi = false,
  required = false,
  defaultOpen = false,
  allowCustom = false,
}: UseAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState<string | string[]>(
    initialValue || (multi ? [] : ""),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOptions = useMemo(() => {
    if (multi) {
      const currentValues = internalValue as string[];
      return currentValues.map(id => {
        const option = options.find((opt) => opt.id === id);
        if (option) return option;
        if (allowCustom) return { id, label: id } as SelectOption;
        return null;
      }).filter(Boolean) as SelectOption[];
    }
    const option = options.find((opt) => opt.id === internalValue);
    if (option) return [option];
    if (allowCustom && internalValue) return [{ id: internalValue as string, label: internalValue as string }] as SelectOption[];
    return [];
  }, [options, internalValue, multi, allowCustom]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const lowerQuery = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerQuery) ||
        opt.id.toLowerCase().includes(lowerQuery),
    );
  }, [options, searchQuery]);

  const handleSelect = useCallback(
    (id: string) => {
      const option = options.find((opt) => opt.id === id) || (allowCustom ? { id, label: id } : null);
      if (!option || (option as SelectOption).disabled) return;

      let newValue: string | string[];
      let error: string | null = null;

      if (multi) {
        const currentValues = internalValue as string[];
        if (currentValues.includes(id)) {
          newValue = currentValues.filter((v) => v !== id);
        } else {
          newValue = [...currentValues, id];
        }
        setSearchQuery(""); // Clear search on multi-select
      } else {
        newValue = id;
        setSearchQuery(option.label); // Set search query to label on single select
        setIsOpen(false);
      }

      if (required && (!newValue || (multi && (newValue as string[]).length === 0))) {
        error = "This field is required";
      }

      setInternalValue(newValue);
      onChange?.({
        value: newValue,
        newValue: id,
        error,
        metadata: options.find((opt) => opt.id === id) || null,
      });
    },
    [options, internalValue, multi, required, onChange, allowCustom],
  );

  const removeValue = useCallback(
    (id: string) => {
      if (!multi) return;
      handleSelect(id);
    },
    [multi, handleSelect],
  );

  return {
    isOpen,
    setIsOpen,
    value: internalValue,
    selectedOptions,
    filteredOptions,
    searchQuery,
    setSearchQuery,
    handleSelect,
    removeValue,
  };
};

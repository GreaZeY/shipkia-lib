import { useState, useCallback, useMemo } from "react";

export interface SelectOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface UseSelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (data: {
    value: string | string[];
    newValue: string;
    error: string | null;
    metadata: SelectOption | null;
  }) => void;
  multi?: boolean;
  required?: boolean;
  defaultOpen?: boolean;
}

export const useSelect = ({
  options,
  value: initialValue,
  onChange,
  multi = false,
  required = false,
  defaultOpen = false,
}: UseSelectProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState<string | string[]>(
    initialValue || (multi ? [] : ""),
  );

  const selectedOptions = useMemo(() => {
    if (multi) {
      return options.filter((opt) => (internalValue as string[]).includes(opt.id));
    }
    return options.filter((opt) => opt.id === internalValue) || [];
  }, [options, internalValue, multi]);

  const handleSelect = useCallback(
    (id: string) => {
      const option = options.find((opt) => opt.id === id);
      if (!option || option.disabled) return;

      let newValue: string | string[];
      let error: string | null = null;

      if (multi) {
        const currentValues = internalValue as string[];
        if (currentValues.includes(id)) {
          newValue = currentValues.filter((v) => v !== id);
        } else {
          newValue = [...currentValues, id];
        }
      } else {
        newValue = id;
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
        metadata: option,
      });
    },
    [options, internalValue, multi, required, onChange],
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
    handleSelect,
    removeValue,
  };
};

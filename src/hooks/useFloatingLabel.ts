import { useState, useCallback } from "react";

export interface UseFloatingLabelProps {
  hasValue: boolean;
  isFocused?: boolean;
}

export const useFloatingLabel = () => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);

  const isFloating = useCallback(
    (hasValue: boolean) => isFocused || hasValue,
    [isFocused],
  );

  return { isFocused, isFloating, onFocus, onBlur };
};

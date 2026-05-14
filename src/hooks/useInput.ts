import { useState, useCallback, useRef } from "react";
import { validators } from "@/lib/validators";

export type InputType =
  | "text"
  | "tel"
  | "email"
  | "integer"
  | "decimal"
  | "url"
  | "password"
  | "search";

export type ValidationTrigger = "change" | "blur";

export interface InputChangeData {
  value: string;
  prevValue: string;
  error?: string;
  isValid: boolean;
}

export interface UseInputOptions {
  initialValue?: string;
  type?: InputType;
  required?: boolean;
  requiredMessage?: string;
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  min?: number;
  minMessage?: string;
  max?: number;
  maxMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  custom?: (value: string) => string | null | undefined;
  validateOn?: ValidationTrigger;
  onChange?: (
    data: InputChangeData,
    e?: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export function useInput({
  initialValue = "",
  type = "text",
  required,
  requiredMessage,
  minLength,
  minLengthMessage,
  maxLength,
  maxLengthMessage,
  min: minValue,
  minMessage,
  max: maxValue,
  maxMessage,
  pattern: patternValue,
  patternMessage,
  custom,
  validateOn = "change",
  onChange: externalOnChange,
}: UseInputOptions = {}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isTouched, setIsTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (currentValue: string) => {
      // 1. Required check
      if (required) {
        const err = validators.required(currentValue, requiredMessage);
        if (err) return err;
      }

      if (currentValue) {
        // 2. Type-based auto-validation
        if (type === "email") {
          const err = validators.email(currentValue);
          if (err) return err;
        }

        // 3. Length checks
        if (minLength !== undefined) {
          const err = validators.minLength(
            currentValue,
            minLength,
            minLengthMessage,
          );
          if (err) return err;
        }
        if (maxLength !== undefined) {
          const err = validators.maxLength(
            currentValue,
            maxLength,
            maxLengthMessage,
          );
          if (err) return err;
        }

        // 4. Numeric range checks
        if (minValue !== undefined) {
          const err = validators.min(currentValue, minValue, minMessage);
          if (err) return err;
        }
        if (maxValue !== undefined) {
          const err = validators.max(currentValue, maxValue, maxMessage);
          if (err) return err;
        }

        // 5. Pattern check
        if (patternValue) {
          const err = validators.pattern(
            currentValue,
            patternValue,
            patternMessage,
          );
          if (err) return err;
        }

        // 6. Custom validator
        if (custom) {
          const err = custom(currentValue);
          if (err) return err;
        }
      }

      return undefined;
    },
    [
      required,
      requiredMessage,
      type,
      minLength,
      minLengthMessage,
      maxLength,
      maxLengthMessage,
      minValue,
      minMessage,
      maxValue,
      maxMessage,
      patternValue,
      patternMessage,
      custom,
    ],
  );

  const handleChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e?.target.value ?? "";
    const nextError =
      validateOn === "change" || isTouched ? validate(newValue) : undefined;

    setValue(newValue);
    setError(nextError);

    externalOnChange?.(
      {
        value: newValue,
        prevValue: value,
        error: nextError,
        isValid: !nextError,
      },
      e,
    );
  };

  const handleBlur = () => {
    setIsTouched(true);
    if (validateOn === "blur" || validateOn === "change") {
      setError(validate(value));
    }
  };

  const handleIncrement = () => {
    if (inputRef.current) {
      inputRef.current.stepUp();
      const newValue = inputRef.current.value;
      const nextError =
        validateOn === "change" || isTouched ? validate(newValue) : undefined;

      setValue(newValue);
      setError(nextError);

      externalOnChange?.({
        value: newValue,
        prevValue: value,
        error: nextError,
        isValid: !nextError,
      });
    }
  };

  const handleDecrement = () => {
    if (inputRef.current) {
      inputRef.current.stepDown();
      const newValue = inputRef.current.value;
      const nextError =
        validateOn === "change" || isTouched ? validate(newValue) : undefined;

      setValue(newValue);
      setError(nextError);

      externalOnChange?.({
        value: newValue,
        prevValue: value,
        error: nextError,
        isValid: !nextError,
      });
    }
  };

  const getInputMode = () => {
    if (type === "integer") return "numeric";
    if (type === "decimal") return "decimal";
    if (type === "tel") return "tel";
    if (type === "email") return "email";
    if (type === "url") return "url";
    if (type === "search") return "search";
    return "text";
  };

  const getHtmlType = () => {
    if (type === "integer" || type === "decimal") return "number";
    return type;
  };

  return {
    value,
    error,
    isTouched,
    inputRef,
    handleChange,
    onBlur: handleBlur,
    onIncrement: handleIncrement,
    onDecrement: handleDecrement,
    inputMode: getInputMode(),
    htmlType: getHtmlType(),
    validate: () => {
      setIsTouched(true);
      const err = validate(value);
      setError(err);
      return !err;
    },
    reset: () => {
      setValue(initialValue);
      setError(undefined);
      setIsTouched(false);
    },
    setValue,
  };
}

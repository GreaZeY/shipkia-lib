import { ChevronUp, ChevronDown } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import {
  useInput,
  type InputType,
  type ValidationTrigger,
  type InputChangeData,
} from "@/hooks/useInput";
import { cn } from "@/lib/utils";
import { inputVariants } from "@components/ui/inputs/Input/Input.styles";
import { useFloatingLabel } from "@/hooks/useFloatingLabel";
import { useImperativeHandle } from "react";

export { type InputType, type ValidationTrigger, type InputChangeData };

export interface InputProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "onChange" | "type" | "value" | "size" | "pattern"
    >,
    VariantProps<typeof inputVariants> {
  /**
   * The type of input element.
   * @default "text"
   */
  type?: InputType;
  /**
   * Optional label displayed above the input.
   */
  label?: string;
  /**
   * Current value of the input.
   */
  value?: string;
  /**
   * Error message displayed below the input. Triggers error styling.
   * If provided, overrides the internal validation error.
   */
  error?: string;
  /**
   * Whether the input is required.
   */
  required?: boolean;
  /**
   * Custom message for required validation.
   */
  requiredMessage?: string;
  /**
   * Minimum length of the input value.
   */
  minLength?: number;
  /**
   * Custom message for minLength validation.
   */
  minLengthMessage?: string;
  /**
   * Maximum length of the input value.
   */
  maxLength?: number;
  /**
   * Custom message for maxLength validation.
   */
  maxLengthMessage?: string;
  /**
   * Minimum numeric value.
   */
  min?: number;
  /**
   * Custom message for min validation.
   */
  minMessage?: string;
  /**
   * Maximum numeric value.
   */
  max?: number;
  /**
   * Custom message for max validation.
   */
  maxMessage?: string;
  /**
   * Regex pattern for validation.
   */
  pattern?: RegExp;
  /**
   * Custom message for pattern validation.
   */
  patternMessage?: string;
  /**
   * Custom validation function.
   */
  custom?: (value: string) => string | null | undefined;
  /**
   * Icon element to display on the left side of the input.
   */
  startIcon?: React.ReactNode;
  /**
   * Icon element to display on the right side of the input.
   */
  endIcon?: React.ReactNode;
  /**
   * Callback fired when the input value changes.
   */
  onChange?: (
    data: InputChangeData,
    e?: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /**
   * Reference to the underlying HTMLInputElement.
   */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Callback fired when the input loses focus. Useful for validation.
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /**
   * When to trigger validation.
   * @default "change"
   */
  validateOn?: ValidationTrigger;
  /**
   * The size of the input.
   * @default "md"
   */
  size?: VariantProps<typeof inputVariants>["size"];
  /**
   * The default value of the input (uncontrolled).
   */
  defaultValue?: string;
}

const Input = ({
  className,
  label,
  error: externalError,
  startIcon,
  endIcon,
  type = "text",
  onChange,
  onBlur,
  required,
  requiredMessage,
  minLength,
  minLengthMessage,
  maxLength,
  maxLengthMessage,
  min,
  minMessage,
  max,
  maxMessage,
  pattern,
  patternMessage,
  custom,
  validateOn = "change",
  value: externalValue,
  defaultValue,
  ref,
  size = "md",
  variant = "default",
  ...props
}: InputProps) => {
  const {
    value,
    error: internalError,
    inputRef,
    handleChange,
    onBlur: handleBlur,
    onIncrement,
    onDecrement,
    inputMode,
    htmlType,
  } = useInput({
    initialValue: externalValue ?? defaultValue,
    type,
    required,
    requiredMessage,
    minLength,
    minLengthMessage,
    maxLength,
    maxLengthMessage,
    min,
    minMessage,
    max,
    maxMessage,
    pattern,
    patternMessage,
    custom,
    validateOn,
    onChange,
  });

  // Expose the internal ref to the parent
  useImperativeHandle(ref, () => inputRef.current!);

  // Determine which error to show (external override takes precedence)
  const displayError = externalError || internalError;

  const isNumberType = type === "integer" || type === "decimal";
  const showSpinButtons = isNumberType && !endIcon;

  const { isFloating, onFocus, onBlur: floatingBlur } = useFloatingLabel();
  const hasValue = value !== undefined && value !== "";
  const shouldFloat = isFloating(hasValue);

  return (
    <div className="w-full space-y-1">
      <div className="group relative">
        {/* Fieldset for floating label border gap */}
        {label && (
          <fieldset
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 m-0 rounded-full border transition-all duration-200",
              displayError
                ? "border-destructive group-focus-within:border-destructive group-focus-within:ring-2 group-focus-within:ring-destructive/10"
                : "border-input group-focus-within:border-primary/50 group-focus-within:ring-2 group-focus-within:ring-primary/10",
            )}
          >
            <legend
              className={cn(
                "invisible h-0 overflow-hidden whitespace-nowrap px-0 font-bold transition-all duration-200",
                size === "sm"
                  ? "ml-3 text-[8.25px]"
                  : size === "md"
                    ? "ml-4 text-[9.75px]"
                    : "ml-4 text-[11.25px]",
                shouldFloat ? "max-w-full" : "max-w-[0.01px]",
              )}
            >
              <span className="px-[3px] opacity-0">
                {label}
                {required && "*"}
              </span>
            </legend>
          </fieldset>
        )}

        {/* Floating label */}
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "pointer-events-none absolute z-10 origin-top-left px-1 transition-all duration-200",
              shouldFloat
                ? cn(
                    "top-0 -translate-y-[37.5%] translate-x-[2px] scale-75 font-bold text-primary",
                    size === "sm" && "left-3 text-[11px]",
                    size === "md" && "left-4 text-[13px]",
                    size === "lg" && "left-4 text-[15px]",
                  )
                : cn(
                    "top-1/2 -translate-y-1/2 text-muted-foreground",
                    size === "sm" && "left-3 text-xs",
                    size === "md" && "left-4 text-sm",
                    size === "lg" && "left-5 text-base",
                    startIcon &&
                      (size === "sm"
                        ? "left-8"
                        : size === "md"
                          ? "left-10"
                          : "left-12"),
                  ),
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
        )}
        {startIcon && (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary",
              size === "sm"
                ? "left-3 [&>svg]:size-3.5"
                : "left-4 [&>svg]:size-4",
            )}
          >
            {startIcon}
          </div>
        )}
        <input
          type={htmlType}
          inputMode={
            inputMode as React.HTMLAttributes<HTMLInputElement>["inputMode"]
          }
          ref={inputRef}
          value={externalValue !== undefined ? value : undefined}
          defaultValue={externalValue === undefined ? defaultValue : undefined}
          onChange={handleChange}
          onFocus={(e) => {
            onFocus();
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            handleBlur();
            floatingBlur();
            onBlur?.(e);
          }}
          placeholder={shouldFloat ? props.placeholder : undefined}
          className={cn(
            inputVariants({
              variant,
              size,
              hasError: !!displayError,
              hasStartIcon: !!startIcon,
              hasEndIcon: !!endIcon || showSpinButtons,
            }),
            "focus-visible:outline-none",
            label &&
              "!border-transparent placeholder:text-transparent focus:!border-transparent focus:!ring-transparent focus:placeholder:text-muted-foreground",
            className,
          )}
          {...props}
        />
        {endIcon && (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary",
              size === "sm"
                ? "right-3 [&>svg]:size-3.5"
                : "right-4 [&>svg]:size-4",
            )}
          >
            {endIcon}
          </div>
        )}
        {showSpinButtons && (
          <div
            className={cn(
              "absolute right-3 top-1/2 flex -translate-y-1/2 flex-col",
              size === "sm" ? "space-y-0" : "space-y-0.5",
            )}
          >
            <button
              type="button"
              onClick={onIncrement}
              className="flex h-3.5 w-3.5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronUp size={size === "sm" ? 10 : 12} />
            </button>
            <button
              type="button"
              onClick={onDecrement}
              className="flex h-3.5 w-3.5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronDown size={size === "sm" ? 10 : 12} />
            </button>
          </div>
        )}
      </div>
      {displayError && (
        <p className="ml-0.5 text-[9px] font-bold leading-none text-destructive animate-in fade-in slide-in-from-top-0.5">
          {displayError}
        </p>
      )}
    </div>
  );
};

export default Input;

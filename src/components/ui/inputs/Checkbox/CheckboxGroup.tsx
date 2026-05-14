import type { ComponentProps } from "react";
import Checkbox from "./Checkbox";
import { cn } from "../../../../lib/utils";
import Box from "../../containers/Box/Box";

export interface CheckboxOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<
  ComponentProps<"div">,
  "onChange"
> {
  /**
   * Array of options to render as checkboxes.
   */
  options: CheckboxOption[];
  /**
   * The currently selected values (controlled state).
   */
  value?: string[];
  /**
   * Callback fired when a checkbox is toggled. Receives the updated array of selected values.
   */
  onChange?: (value: string[]) => void;
  /**
   * Layout orientation of the checkboxes.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
  /**
   * The name attribute applied to all checkboxes in the group.
   */
  name?: string;
}

const CheckboxGroup = ({
  options,
  value = [],
  onChange,
  orientation = "vertical",
  name,
  className,
  ...props
}: CheckboxGroupProps) => {
  const handleCheckedChange = (optionId: string, checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      onChange([...value, optionId]);
    } else {
      onChange(value.filter((v) => v !== optionId));
    }
  };

  return (
    <Box
      display="flex"
      direction={orientation === "vertical" ? "column" : "row"}
      gap={orientation === "vertical" ? "sm" : "md"}
      wrap={orientation === "horizontal"}
      className={cn("w-full", className)}
      role="group"
      {...props}
    >
      {options.map((option) => {
        const isChecked = value.includes(option.id);
        const uniqueId = `${name || "checkbox-group"}-${option.id}`;

        return (
          <Checkbox
            key={option.id}
            id={uniqueId}
            name={name}
            checked={isChecked}
            onCheckedChange={(checked) =>
              handleCheckedChange(option.id, checked as boolean)
            }
            disabled={option.disabled}
            label={option.label}
            description={option.description}
          />
        );
      })}
    </Box>
  );
};

export default CheckboxGroup;

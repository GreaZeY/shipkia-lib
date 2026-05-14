import * as React from "react";
import { type FormFieldConfig } from "@components/ui/forms/FormBuilder/types";
import { FieldRegistry } from "@components/ui/forms/FormBuilder/fieldRegistry";
import Box from "@/components/ui/containers/Box/Box";
import { useFormContext, useFieldState } from "@/hooks/useFormBuilder";

export default function FieldRenderer({ field }: { field: FormFieldConfig }) {
  const { register } = useFormContext();
  const { value, visible, disabled } = useFieldState(field.name);
  
  // Section 24: Dynamic Visibility
  if (!visible) return null;

  const Component = FieldRegistry[field.type] || FieldRegistry.text;
  const { onChange, ...baseProps } = register(field.name);

  // Adapt props for specific components (The "Projection" Adapter)
  const componentProps: Record<string, unknown> = {
    ...baseProps,
    ...field,
    id: `form-field-${field.name}`,
    disabled: disabled || field.disabled,
  };

  if (field.type === "checkbox" || field.type === "switch") {
    componentProps.checked = Boolean(value);
    componentProps.onCheckedChange = onChange;
    // Remove conflicting props
    delete componentProps.value;
  } else if (field.type === "select") {
    componentProps.value = value;
    componentProps.onChange = onChange;
    componentProps.options = field.options?.map((o) => ({
      id: o.value,
      label: o.label,
      description: o.description,
    })) || [];
    componentProps.multi = field.multiSelect;
  } else if (field.type === "radio") {
    componentProps.value = value;
    componentProps.onValueChange = onChange;
  } else {
    // text, email, number, password, etc.
    componentProps.value = value || "";
    componentProps.onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let val: string | number = e.target.value;
      if (field.type === "number" && val) val = Number(val);
      onChange(val);
    };
  }

  const typesWithInternalLabels = [
    "text", "email", "password", "number", "tel", "url", "search", "decimal", "integer", "select"
  ];
  const hasInternalLabel = typesWithInternalLabels.includes(field.type || "text");
  const showExternalTopLabel = field.label && field.type !== "checkbox" && field.type !== "switch" && !hasInternalLabel;

  return (
    <Box display="flex" direction="column" gap="xs">
      {(showExternalTopLabel || field.type === "checkbox" || field.type === "switch") && (
        <Box display="flex" align="center" gap="sm">
          {showExternalTopLabel && (
            <label
              htmlFor={`form-field-${field.name}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </label>
          )}
          
          {(field.type === "checkbox" || field.type === "switch") && (
            <React.Suspense fallback={<div className="h-4 w-4 bg-muted rounded animate-pulse" />}>
              <Component {...componentProps} />
            </React.Suspense>
          )}
          
          {(field.type === "checkbox" || field.type === "switch") && field.label && (
            <label
              htmlFor={`form-field-${field.name}`}
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {field.label}
              {field.required && <span className="ml-1 text-destructive">*</span>}
            </label>
          )}
        </Box>
      )}

      {field.type !== "checkbox" && field.type !== "switch" && (
        <React.Suspense fallback={<div className="h-10 w-full bg-muted rounded animate-pulse" />}>
          <Component {...componentProps} />
        </React.Suspense>
      )}
      
      {field.description && (
        <p className="text-[13px] text-muted-foreground">{field.description}</p>
      )}
    </Box>
  );
}

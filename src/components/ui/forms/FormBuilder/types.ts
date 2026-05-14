import type { FieldLogic } from "@/framework/reactive/types";

export type FieldType = 
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "switch";

export interface FormFieldConfig {
  name: string;
  label?: string;
  description?: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: unknown;
  colSpan?: number; // For grid layouts, e.g., span 2 columns
  
  // Specific to select/radio
  options?: { label: string; value: string; description?: string }[];
  multiSelect?: boolean; // Only for select

  // Server-driven reactive logic
  logics?: FieldLogic[];
}

export interface FormSectionConfig {
  id: string;
  title?: string;
  description?: string;
  columns?: number; // Number of columns for the grid in this section (default 1)
  fields: FormFieldConfig[];
}

export interface FormConfig {
  id: string;
  sections: FormSectionConfig[];
}

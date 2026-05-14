import { lazy, type ComponentType } from "react";
import { type FieldType } from "./types";

const Input = lazy(() => import("@/components/ui/inputs/Input/Input"));
const Select = lazy(() => import("@/components/ui/inputs/Select/Select"));
const Checkbox = lazy(() => import("@/components/ui/inputs/Checkbox/Checkbox"));
const Switch = lazy(() => import("@/components/ui/inputs/Switch/Switch"));
const Radio = lazy(() => import("@/components/ui/inputs/Radio/Radio"));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FieldRegistry: Record<FieldType, ComponentType<any>> = {
  text: Input,
  email: Input,
  password: Input,
  number: Input,
  textarea: Input,
  select: Select,
  checkbox: Checkbox,
  switch: Switch,
  radio: Radio,
};

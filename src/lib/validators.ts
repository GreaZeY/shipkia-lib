export const required = (value: string, message?: string) => {
  if (!value || !value.trim()) {
    return message || "This field is required";
  }
  return undefined;
};

export const email = (value: string, message?: string) => {
  if (!value) return undefined;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return message || "Invalid email address";
  }
  return undefined;
};

export const minLength = (value: string, min: number, message?: string) => {
  if (!value) return undefined;
  if (value.length < min) {
    return message || `Minimum length is ${min} characters`;
  }
  return undefined;
};

export const maxLength = (value: string, max: number, message?: string) => {
  if (!value) return undefined;
  if (value.length > max) {
    return message || `Maximum length is ${max} characters`;
  }
  return undefined;
};

export const min = (value: string, minValue: number, message?: string) => {
  if (!value) return undefined;
  if (Number(value) < minValue) {
    return message || `Minimum value is ${minValue}`;
  }
  return undefined;
};

export const max = (value: string, maxValue: number, message?: string) => {
  if (!value) return undefined;
  if (Number(value) > maxValue) {
    return message || `Maximum value is ${maxValue}`;
  }
  return undefined;
};

export const pattern = (value: string, regex: RegExp, message?: string) => {
  if (!value) return undefined;
  if (!regex.test(value)) {
    return message || "Invalid format";
  }
  return undefined;
};

export const validators = {
  required,
  email,
  minLength,
  maxLength,
  min,
  max,
  pattern,
};

export type ValidationRuleType = keyof typeof validators | "custom";

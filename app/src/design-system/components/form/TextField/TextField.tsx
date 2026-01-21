"use client";

import { FormField } from "../FormField";
import styles from "./TextField.module.css";

export interface TextFieldProps {
  /** Label text for the field */
  label: string;
  /** Field name (used for form submission) */
  name: string;
  /** Input type */
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Help text to display below the field */
  helpText?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Autocomplete attribute for browser autofill */
  autoComplete?: string;
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Whether the field is disabled */
  disabled?: boolean;
}

/**
 * TextField is an accessible text input component.
 *
 * RGAA compliance is handled by the underlying FormField component.
 *
 * @example
 * ```tsx
 * <TextField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   required
 *   error={errors.email}
 *   onChange={(value) => setEmail(value)}
 * />
 * ```
 */
export function TextField({
  label,
  name,
  type = "text",
  required,
  error,
  helpText,
  placeholder,
  autoComplete,
  value,
  defaultValue,
  onChange,
  disabled,
}: TextFieldProps) {
  return (
    <FormField label={label} name={name} required={required} error={error} helpText={helpText}>
      {(fieldProps) => (
        <input
          {...fieldProps}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`${styles.input} ${fieldProps.className}`}
        />
      )}
    </FormField>
  );
}

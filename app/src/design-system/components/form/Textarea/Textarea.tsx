"use client";

import { FormField } from "../FormField";
import styles from "./Textarea.module.css";

export interface TextareaProps {
  /** Label text for the field */
  label: string;
  /** Field name (used for form submission) */
  name: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Help text to display below the field */
  helpText?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Number of visible rows */
  rows?: number;
}

/**
 * Textarea is an accessible multi-line text input component.
 *
 * RGAA compliance is handled by the underlying FormField component.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Description"
 *   name="description"
 *   required
 *   helpText="Decrivez le probleme rencontre."
 *   rows={5}
 * />
 * ```
 */
export function Textarea({
  label,
  name,
  required,
  error,
  helpText,
  placeholder,
  value,
  defaultValue,
  onChange,
  disabled,
  rows = 4,
}: TextareaProps) {
  return (
    <FormField label={label} name={name} required={required} error={error} helpText={helpText}>
      {(fieldProps) => (
        <textarea
          {...fieldProps}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          rows={rows}
          className={`${styles.textarea} ${fieldProps.className}`}
        />
      )}
    </FormField>
  );
}

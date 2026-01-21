"use client";

import { ReactNode, useId } from "react";
import styles from "./FormField.module.css";

export interface FormFieldRenderProps {
  id: string;
  name: string;
  "aria-invalid": boolean;
  "aria-required": boolean | undefined;
  "aria-describedby": string | undefined;
  className: string;
}

export interface FormFieldProps {
  /** Label text for the field */
  label: string;
  /** Field name (used for form submission and ID generation) */
  name: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Help text to display below the field */
  helpText?: string;
  /** Render function that receives RGAA-compliant props */
  children: (props: FormFieldRenderProps) => ReactNode;
}

/**
 * FormField is the foundation component for RGAA-compliant form fields.
 *
 * It handles:
 * - RGAA 11.1: Label association (htmlFor/id)
 * - RGAA 11.2: Required indication (visual asterisk + aria-required)
 * - RGAA 11.10: Error association (aria-describedby)
 * - RGAA 11.11: Error messages with role="alert"
 * - RGAA 11.13: Help text association (aria-describedby)
 *
 * @example
 * ```tsx
 * <FormField label="Email" name="email" required error={errors.email}>
 *   {(props) => <input type="email" {...props} />}
 * </FormField>
 * ```
 */
export function FormField({ label, name, required = false, error, helpText, children }: FormFieldProps) {
  const id = useId();
  const fieldId = `field-${name}-${id}`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  const hasError = !!error;
  const showHelp = !!helpText && !hasError;

  // Build aria-describedby: error first (priority), then help
  const describedByIds: string[] = [];
  if (hasError) describedByIds.push(errorId);
  if (showHelp) describedByIds.push(helpId);
  const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(" ") : undefined;

  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
        {required && (
          <span aria-hidden="true" className={styles.requiredStar}>
            {" "}
            *
          </span>
        )}
      </label>

      {showHelp && (
        <p id={helpId} className={styles.helpText}>
          {helpText}
        </p>
      )}

      {children({
        id: fieldId,
        name,
        "aria-invalid": hasError,
        "aria-required": required || undefined,
        "aria-describedby": ariaDescribedBy,
        className: hasError ? styles.inputError : "",
      })}

      {hasError && (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

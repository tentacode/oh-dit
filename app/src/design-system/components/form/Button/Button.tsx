"use client";

import { ReactNode } from "react";
import styles from "./Button.module.css";

export interface ButtonProps {
  /** Button content */
  children: ReactNode;
  /** HTML button type */
  type?: "button" | "submit" | "reset";
  /** Button variant */
  variant?: "default" | "small";
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Accessible label (use when button contains only an icon) */
  ariaLabel?: string;
  /** ID of element that labels this button */
  ariaLabelledBy?: string;
  /** Additional CSS class */
  className?: string;
  /** Button ID */
  id?: string;
}

/**
 * Button is an accessible button component.
 *
 * RGAA compliance:
 * - RGAA 11.9: Interactive elements have accessible names
 * - RGAA 12.8: Focus is visible (3px border on focus)
 *
 * @example
 * ```tsx
 * <Button type="submit">Se connecter</Button>
 *
 * <Button variant="small" onClick={handleSave}>
 *   <SaveIcon /> Enregistrer
 * </Button>
 * ```
 */
export function Button({
  children,
  type = "submit",
  variant = "default",
  onClick,
  disabled,
  ariaLabel,
  ariaLabelledBy,
  className,
  id,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`${styles.button} ${variant === "small" ? styles.buttonSmall : ""} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

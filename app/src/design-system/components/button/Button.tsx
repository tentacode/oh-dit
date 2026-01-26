import buttonStyles from "@/src/design-system/styles/button/button.module.css";
import { clsx } from "clsx";

export default function Button({
  onClick,
  type,
  className,
  ariaPressed,
  ariaLabel,
  disabled,
  children,
}: {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  ariaPressed?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type={type ?? "button"}
      className={clsx([
        buttonStyles.button,
        disabled && buttonStyles.disabled,
        className,
      ])}
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

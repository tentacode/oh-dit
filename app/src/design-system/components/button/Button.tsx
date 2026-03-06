import buttonStyles from "@/src/design-system/styles/button/button.module.css";
import { clsx } from "clsx";

export default function Button({
  id,
  onClick,
  type,
  className,
  style,
  ariaPressed,
  ariaLabel,
  ariaHasPopup,
  disabled,
  children,
  ref,
}: {
  id?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
  ariaPressed?: boolean;
  ariaHasPopup?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog";
  ariaLabel?: string;
  disabled?: boolean;
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      id={id}
      ref={ref}
      onClick={onClick}
      type={type ?? "button"}
      className={clsx([
        buttonStyles.button,
        disabled && buttonStyles.disabled,
        className,
      ])}
      style={style}
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      aria-haspopup={ariaHasPopup}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

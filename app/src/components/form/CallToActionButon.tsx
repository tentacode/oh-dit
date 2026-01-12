import styles from "./styles/buttons.module.css";

export default function CallToActionButton({
  children,
  id, 
  className,
  ariaLabel,
  ariaLabelledBy,
  type,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: "small";
}) {
  return (
    <button
      id={id}
      type={type ?? "submit"}
      className={`${styles.callToAction} ${className} ${variant === "small" ? styles.callToActionSmall : ""}`}
      disabled={disabled ?? false}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </button>
  );
}

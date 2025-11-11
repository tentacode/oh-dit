import styles from "./styles/buttons.module.css";

export default function CallToActionButton({
  children,
  className,
  ariaLabel,
  type,
  onClick,
  disabled
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type ?? "submit"}
      className={`${styles.callToAction} ${className}`}
      disabled={disabled ?? false}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

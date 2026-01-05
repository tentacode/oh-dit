import Link from "next/link";
import styles from "./styles/buttons.module.css";

export default function CallToActionLink({
  children,
  href,
  variant,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  variant?: "small";
  onClick?: () => void;
}) {
  return (
    <Link
      prefetch={false}
      href={href}
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`${styles.callToAction} ${variant === "small" ? styles.callToActionSmall : ""}`}
    >
      {children}
    </Link>
  );
}

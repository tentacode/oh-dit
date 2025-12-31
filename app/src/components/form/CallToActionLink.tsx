import Link from "next/link";
import styles from "./styles/buttons.module.css";

export default function CallToActionLink({
  children,
  href,
  variant,
}: {
  children: React.ReactNode;
  href: string;
  variant?: "small";
}) {
  return (
    <Link
      prefetch={false}
      href={href}
      role="button"
      tabIndex={0}
      className={`${styles.callToAction} ${variant === "small" ? styles.callToActionSmall : ""}`}
    >
      {children}
    </Link>
  );
}

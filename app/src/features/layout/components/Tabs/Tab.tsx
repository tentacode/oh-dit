import { clsx } from "clsx";

import styles from "../../styles/tabs.module.css";
import Link from "next/link";

export default function Tab({
  isActive,
  href,
  children,
}: {
  isActive: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li className={styles.tab}>
      <Link
        prefetch={false}
        href={href}
        aria-selected={isActive}
        className={clsx([
          styles.tabLink,
          isActive && styles.activeTabLink,
        ])}
      >
        {children}
      </Link>
    </li>
  );
}

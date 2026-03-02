import sidebarStyles from "@/src/design-system/styles/sidebar/sidebar.module.css"
import Link from "next/link";

export default function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className={`${sidebarStyles.sidebarItem} ${active ? sidebarStyles.sidebarItemActive : ""}`}>
      <Link prefetch={false} href={href} className={sidebarStyles.sidebarItemContent}>{children}</Link>
    </li>
  );
}
import sidebarStyles from "@/src/design-system/styles/sidebar/sidebar.module.css"

export default function SidebarItem({
  badge,
  children,
}: {
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <li className={sidebarStyles.sidebarItem}>
      <div className={sidebarStyles.sidebarItemContent}>{children}</div>
      {badge && <span className={sidebarStyles.sidebarItemBadge}>{badge}</span>}
    </li>
  );
}
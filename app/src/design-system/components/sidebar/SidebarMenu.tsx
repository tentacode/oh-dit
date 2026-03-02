import sidebarStyles from "@/src/design-system/styles/sidebar/sidebar.module.css"

export default function SidebarMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ul className={sidebarStyles.sidebarMenu}>
      {children}
    </ul>
  );
}
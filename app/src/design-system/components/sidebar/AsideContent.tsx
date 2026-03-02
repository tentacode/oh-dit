import sidebarStyles from "@/src/design-system/styles/sidebar/sidebar.module.css"

export default function AsideContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<div className={sidebarStyles.asideContent}>
    {children}
  </div>);
}
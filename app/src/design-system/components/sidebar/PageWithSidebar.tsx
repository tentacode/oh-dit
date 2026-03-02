import sidebarStyles from "@/src/design-system/styles/sidebar/sidebar.module.css"

export default function PageWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${sidebarStyles.pageWithSidebar} horizontalGutter mt-8`}>
       {children}
    </div>
  );
}
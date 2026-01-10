import styles from "../../styles/tabs.module.css";

export default function TabsHeaders({ children, label }: { children: React.ReactNode, label: string }) {
  return (
    <nav aria-label={label}>
      <ul className={styles.tabsHeader}>
        {children}
      </ul>
    </nav>
  );
}
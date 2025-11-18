import styles from "../../styles/tabs.module.css";

export default function TabsHeaders({ children }: { children: React.ReactNode }) {
  return (
    <ul role="navigation" className={styles.tabsHeader}>
      {children}
    </ul>
  );
}
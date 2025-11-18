import styles from "../../styles/tabs.module.css";

export default function TabContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.tabContainer}>
      {children}
    </div>
  );
}
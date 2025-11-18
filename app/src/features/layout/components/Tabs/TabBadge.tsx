import styles from "../../styles/tabs.module.css";

export default function TabBadge({
  value,
}: {
  value: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <span className={`${styles.tabBadge} inline-flex items-center rounded-md px-1.5 py-0.5`}>
        {value}
    </span>
  );
}

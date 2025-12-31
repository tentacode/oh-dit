import styles from "./styles/filters.module.css";

export default function FilterActions({children}: {children: React.ReactNode}) {
    return (<div className={styles.filterActions}>{children}</div>);
};

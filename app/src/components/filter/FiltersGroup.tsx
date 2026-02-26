import styles from "./styles/filters.module.css";

export default function FiltersGroup({children}: {children: React.ReactNode}) {
    return (<div className={styles.filtersGroup}>{children}</div>);
};

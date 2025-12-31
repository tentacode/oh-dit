import styles from "./styles/filters.module.css";

export default function FilterAction({children}: {children: React.ReactNode}) {
    return (<div className={styles.filterAction}>{children}</div>);
};

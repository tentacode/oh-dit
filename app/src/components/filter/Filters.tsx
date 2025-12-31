import styles from "./styles/filters.module.css";

export default function Filters({children}: {children: React.ReactNode}) {
    return (<div className={styles.filters}>{children}</div>);
};

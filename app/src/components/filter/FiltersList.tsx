import styles from "./styles/filters.module.css";

export default function FiltersList({children}: {children: React.ReactNode}) {
    return (<ul className={styles.filtersList}>{children}</ul>);
};

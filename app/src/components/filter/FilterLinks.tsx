import styles from "./styles/filters.module.css";

export default function FilterLinks({children}: {children: React.ReactNode}) {
    return (<ul className={styles.filterLinks}>{children}</ul>);
};

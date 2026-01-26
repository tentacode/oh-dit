import styles from '@/src/design-system/styles/layout/illustrated_container.module.css';

export default function IllustratedContainer({children, illustration}: {children: React.ReactNode, illustration: React.ReactNode}) {
  return (
    <div className={styles.container}>
        <div className={styles.content}>{children}</div>
        <div className={styles.illustrationContainer}>
            {illustration}
        </div>
    </div>
  );
}
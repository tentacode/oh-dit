import styles from "../../../styles/audit_grid.module.css";

export default function CategoryComplianceStatus() {
  return (
    <div className={styles.complianceStatus}>
      <button role="gridcell" className={`${styles.squareButton} ${styles.complianceStatus}`} >NA</button>
    </div>
  );
}

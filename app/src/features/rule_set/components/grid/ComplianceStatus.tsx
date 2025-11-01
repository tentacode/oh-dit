import styles from "./rule_set_grid.module.css";

export default function ComplianceStatus() {
  return (
    <>
      <td className={`${styles.complianceStatus} ${styles.compliant}`}>
        <button>C</button>
      </td>
      <td className={`${styles.complianceStatus} ${styles.notCompliant}`}>
        <button>NC</button>
      </td>
      <td className={`${styles.complianceStatus} ${styles.notApplicable}`}>
        <button>NA</button>
      </td>
    </>
  );
}

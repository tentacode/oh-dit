import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";

export default function RecommandationsButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const badgeNumber = 0; // Replace with actual logic to get number of comments


  return (
    <button role="gridcell" className={`${styles.squareButton} ${styles.ruleButton}`} onClick={onClick}>
      {badgeNumber > 0 && (
      <span className={styles.badge}>{badgeNumber}</span>
      )}
      <ExclamationTriangleIcon className={styles.buttonIcon} />
    </button>
  );
}
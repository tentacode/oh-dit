import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";

export default function RuleHelpButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button role="gridcell" className={`${styles.squareButton} ${styles.ruleButton}`} onClick={onClick}>
      <QuestionMarkCircleIcon className={styles.buttonIcon} />
    </button>
  );
}
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";
import clsx from "clsx";

export default function RuleHelpButton({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button role="gridcell" className={clsx(styles.squareButton, styles.ruleButton, isActive && styles.activeTab)} onClick={onClick}>
      <QuestionMarkCircleIcon className={styles.buttonIcon} />
    </button>
  );
}
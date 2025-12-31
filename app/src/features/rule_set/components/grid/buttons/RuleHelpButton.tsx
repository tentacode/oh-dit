import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";
import clsx from "clsx";

export function getRuleHelpButtonId(ruleUuid: string, screenUuid: string) {
  return `help-button-${ruleUuid}-${screenUuid}`;
}

export default function RuleHelpButton({
  ruleUuid,
  screenUuid,
  isActive,
  onClick,
  onFocus,
}: {
  ruleUuid: string;
  screenUuid: string;
  isActive: boolean;
  onClick: () => void;
  onFocus: () => void;
}) {
  return (
    <button
      aria-label="Aide sur le critère"
      id={getRuleHelpButtonId(ruleUuid, screenUuid)}
      role="gridcell"
      className={clsx(
        styles.squareButton,
        styles.ruleButton,
        isActive && styles.activeTab
      )}
      onClick={onClick}
      onFocus={(e) => {
        e.stopPropagation();
        onFocus()}
      }
    >
      <QuestionMarkCircleIcon className={styles.buttonIcon} />
    </button>
  );
}

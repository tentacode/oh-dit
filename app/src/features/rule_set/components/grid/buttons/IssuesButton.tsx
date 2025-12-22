import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import clsx from "clsx";

export function getIssuesButtonId(ruleUuid: string, screenUuid: string) {
  return `issues-button-${ruleUuid}-${screenUuid}`;
}

export default function IssuesButton({
  isActive,
  ruleUuid,
  screenUuid,
  onClick,
  onFocus,
}: {
  isActive: boolean;
  ruleUuid: string;
  screenUuid: string;
  onClick: () => void;
  onFocus: () => void;
}) {
  const allIssues = useAuditStore((state) => state.issues);
  const issues = allIssues.filter(
    (issue) => issue.ruleUuid === ruleUuid && issue.screenUuid === screenUuid
  );

  const badgeNumber = issues.length;

  return (
    <button
      id={getIssuesButtonId(ruleUuid, screenUuid)}
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
      {badgeNumber > 0 && <span className={styles.badge}>{badgeNumber}</span>}
      <ExclamationTriangleIcon className={styles.buttonIcon} />
    </button>
  );
}

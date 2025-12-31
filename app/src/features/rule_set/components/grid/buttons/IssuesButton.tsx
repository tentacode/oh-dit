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

  const pendingIssues = issues.filter((issue) => issue.status === "pending");

  const badgeNumber = pendingIssues.length;

  const allIssuesFixed = issues.length > 0 && pendingIssues.length === 0;

  return (
    <button
      id={getIssuesButtonId(ruleUuid, screenUuid)}
      role="gridcell"
      className={clsx(
        styles.squareButton,
        styles.ruleButton,
        isActive && styles.activeTab
      )}
      aria-label='Recommandations'
      onClick={onClick}
      onFocus={(e) => {
        e.stopPropagation();
        onFocus()}
      }
    >
      <span className="sr-only">{allIssuesFixed ? `Toutes les recommandations sont corrigées` : `${badgeNumber} recommandations à corriger`}</span>
      {!allIssuesFixed && badgeNumber > 0 && <span aria-hidden="true" className={styles.badge}>{badgeNumber}</span>}
      {allIssuesFixed && (
        <span className={styles.badge} aria-hidden="true">✓</span>
      )}
      <ExclamationTriangleIcon className={styles.buttonIcon} />
    </button>
  );
}
